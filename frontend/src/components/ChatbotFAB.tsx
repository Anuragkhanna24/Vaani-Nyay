// Enhanced ChatbotFAB with Gemini API integration and fallback responses
import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Minimize2, AlertCircle } from 'lucide-react';
import '../Chatbot.css';
import { sendMessageToGemini } from '../services/geminiService';

interface Message {
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    isOffline?: boolean;
}

// Enhanced fallback responses for legal topics
const fallbackResponses = [
    "I'm currently experiencing high demand. Here are some general legal guidance resources you might find helpful.",
    "While I'm temporarily unavailable, I recommend consulting with a qualified legal professional for specific advice.",
    "I'm having trouble connecting right now. For immediate legal assistance, please contact your local legal aid office.",
    "Due to high usage, I'm temporarily offline. Please try again in a few minutes, or contact a legal professional directly.",
];

const getLegalFallbackResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();

    // Enhanced keyword matching for legal topics
    if (message.includes('property') || message.includes('land') || message.includes('real estate')) {
        return "For property-related legal matters, I recommend consulting with a property lawyer. They can provide specific guidance based on local laws and your situation. Key areas include property disputes, land acquisition, property registration, and real estate transactions.";
    } else if (message.includes('family') || message.includes('divorce') || message.includes('marriage') || message.includes('custody')) {
        return "Family law matters require specialized attention. Please consult with a family law attorney who can guide you through the legal process in your jurisdiction. This includes divorce proceedings, child custody, adoption, and domestic relations.";
    } else if (message.includes('criminal') || message.includes('police') || message.includes('arrest') || message.includes('bail')) {
        return "For criminal law matters, it's crucial to speak with a criminal defense attorney immediately. They can protect your rights and provide proper legal representation. Remember, you have the right to remain silent and the right to legal counsel.";
    } else if (message.includes('contract') || message.includes('agreement') || message.includes('business')) {
        return "Contract-related issues should be reviewed by a legal professional who can examine the specific terms and advise you on your rights and obligations. This includes business agreements, employment contracts, and commercial transactions.";
    } else if (message.includes('employment') || message.includes('job') || message.includes('workplace') || message.includes('labor')) {
        return "Employment law matters vary by location. Consider consulting with an employment attorney who understands your local labor laws and regulations. This covers workplace harassment, wrongful termination, wage disputes, and workers' rights.";
    } else if (message.includes('consumer') || message.includes('fraud') || message.includes('scam')) {
        return "Consumer protection and fraud cases require immediate attention. Contact your local consumer protection agency or a lawyer specializing in consumer rights. Document all communications and transactions related to your case.";
    } else if (message.includes('tax') || message.includes('income') || message.includes('irs')) {
        return "Tax-related legal issues should be handled by a tax attorney or CPA with legal expertise. They can help with tax disputes, audits, and compliance matters.";
    } else {
        return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
    }
};

const ChatbotFAB: React.FC<{ forceOpen?: boolean }> = ({ forceOpen = false }) => {
    const [open, setOpen] = useState(forceOpen);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isOfflineMode, setIsOfflineMode] = useState(false);
    const [retryCount, setRetryCount] = useState(0);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Enhanced welcome message
    useEffect(() => {
        if (messages.length === 0) {
            setMessages([{
                role: 'assistant',
                content: 'Hello! I\'m Vaani-Nyay AI assistant. I\'m here to help you with your legal questions and provide guidance on Indian law. How can I assist you today?',
                timestamp: new Date()
            }]);
        }
    }, []);

    useEffect(() => {
        if (open) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [messages, open]);

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMessage: Message = {
            role: 'user',
            content: input.trim(),
            timestamp: new Date()
        };

        setMessages(msgs => [...msgs, userMessage]);
        const currentInput = input.trim();
        setInput('');
        setLoading(true);
        setError(null);

        try {
            if (isOfflineMode) {
                // Use fallback response
                await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate processing time
                const fallbackResponse = getLegalFallbackResponse(currentInput);

                setMessages(msgs => [...msgs, {
                    role: 'assistant',
                    content: fallbackResponse,
                    timestamp: new Date(),
                    isOffline: true
                }]);
                return;
            }

            // Try Gemini API
            const apiMessages = [...messages, userMessage].map(msg => ({
                role: msg.role,
                content: msg.content
            }));

            // Add system context for legal AI assistant
            const contextualMessages = [
                {
                    role: 'user',
                    content: 'You are Vaani-Nyay, a helpful AI legal assistant specializing in Indian law. Provide accurate, helpful legal information while always recommending users consult with qualified legal professionals for specific legal advice. Keep responses concise and user-friendly.'
                },
                {
                    role: 'assistant',
                    content: 'I understand. I\'ll provide helpful legal information while emphasizing the importance of consulting qualified legal professionals for specific cases.'
                },
                ...apiMessages
            ];

            const aiReply = await sendMessageToGemini(contextualMessages);

            setMessages(msgs => [...msgs, {
                role: 'assistant',
                content: aiReply,
                timestamp: new Date()
            }]);

            // Reset retry count on success
            setRetryCount(0);
            setIsOfflineMode(false); // Re-enable online mode on success

        } catch (err) {
            console.error('Chat error:', err);
            const errorMessage = err instanceof Error ? err.message : 'Something went wrong.';

            // Check if it's a rate limit error or API issue
            if (errorMessage.includes('Rate limit') || errorMessage.includes('429') ||
                errorMessage.includes('quota') || errorMessage.includes('RESOURCE_EXHAUSTED')) {
                setRetryCount(prev => prev + 1);

                if (retryCount >= 2) {
                    // Switch to offline mode after 3 failures
                    setIsOfflineMode(true);
                    const fallbackResponse = getLegalFallbackResponse(currentInput);

                    setMessages(msgs => [...msgs, {
                        role: 'assistant',
                        content: fallbackResponse + "\n\n⚠️ Note: I'm currently in offline mode due to high API demand. I'm providing general guidance based on common legal topics.",
                        timestamp: new Date(),
                        isOffline: true
                    }]);
                } else {
                    setError(`API limit reached. Retrying... (${retryCount + 1}/3)`);
                    setMessages(msgs => [...msgs, {
                        role: 'assistant',
                        content: `I'm experiencing high demand right now. ${errorMessage}\n\nPlease try again in a moment, or I can provide general legal guidance in offline mode.`,
                        timestamp: new Date()
                    }]);
                }
            } else if (errorMessage.includes('safety')) {
                setMessages(msgs => [...msgs, {
                    role: 'assistant',
                    content: "I can't provide a response to that particular question due to safety guidelines. Please rephrase your legal question in a different way, and I'll be happy to help with general legal information.",
                    timestamp: new Date()
                }]);
            } else {
                setError(errorMessage);
                setMessages(msgs => [...msgs, {
                    role: 'assistant',
                    content: `I encountered an error: ${errorMessage}\n\nPlease try rephrasing your question or contact a legal professional directly for assistance.`,
                    timestamp: new Date()
                }]);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const clearChat = () => {
        setMessages([{
            role: 'assistant',
            content: 'Hello! I\'m Vaani-Nyay AI assistant powered by Google Gemini. I\'m here to help you with your legal questions and provide guidance on Indian law. How can I assist you today?',
            timestamp: new Date()
        }]);
        setError(null);
        setRetryCount(0);
    };

    const toggleOfflineMode = () => {
        setIsOfflineMode(prev => !prev);
        setRetryCount(0);
        setError(null);

        // Add a message to inform about mode change
        const modeMessage = isOfflineMode
            ? "Switched to online mode. I'll try to connect to Gemini API for better responses."
            : "Switched to offline mode. I'll provide general legal guidance based on common topics.";

        setMessages(msgs => [...msgs, {
            role: 'assistant',
            content: modeMessage,
            timestamp: new Date()
        }]);
    };

    return (
        <>
            {/* Floating Action Button */}
            <button
                className="chatbot-fab"
                onClick={() => setOpen(o => !o)}
                aria-label="Open Vaani-Nyay AI Chat"
            >
                <Bot className="w-6 h-6 mr-2" />
                <span>Ask Vaani Nyay?</span>
            </button>

            {/* Chat Modal */}
            {open && (
                <div className="chatbot-modal" role="dialog" aria-labelledby="chatbot-title">
                    <div className="chatbot-header">
                        <div className="chatbot-header-left">
                            <Bot className="w-5 h-5 mr-2" />
                            <span id="chatbot-title">
                                Vaani-Nyay AI
                                {isOfflineMode && <span className="ml-2 text-yellow-200">• Offline Mode</span>}
                            </span>
                        </div>
                        <div className="chatbot-header-actions">
                            <button
                                onClick={toggleOfflineMode}
                                className="chatbot-header-btn"
                                title={isOfflineMode ? "Switch to online mode (Gemini API)" : "Switch to offline mode"}
                            >
                                <AlertCircle className="w-4 h-4" />
                            </button>
                            <button
                                onClick={clearChat}
                                className="chatbot-header-btn"
                                title="Clear chat"
                            >
                                <Minimize2 className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setOpen(false)}
                                className="chatbot-header-btn"
                                title="Close chat"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <div className="chatbot-messages">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`chatbot-msg ${msg.role}`}>
                                <div className="chatbot-msg-content">
                                    {msg.content}
                                    {msg.isOffline && (
                                        <div className="mt-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                                            📡 Offline Response
                                        </div>
                                    )}
                                </div>
                                <div className="chatbot-msg-time">
                                    {msg.timestamp.toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </div>
                            </div>
                        ))}

                        {loading && (
                            <div className="chatbot-msg assistant">
                                <div className="chatbot-msg-content">
                                    <div className="chatbot-typing">
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {error && (
                        <div className="chatbot-error">
                            <span>⚠️ {error}</span>
                            <button onClick={() => setError(null)}>×</button>
                        </div>
                    )}

                    <div className="chatbot-input">
                        <input
                            ref={inputRef}
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder={isOfflineMode ? "Ask a general legal question..." : "Ask your legal question..."}
                            disabled={loading}
                            className="chatbot-input-field"
                        />
                        <button
                            onClick={handleSend}
                            disabled={loading || !input.trim()}
                            className="chatbot-send-btn"
                            aria-label="Send message"
                        >
                            {loading ? (
                                <div className="chatbot-spinner" />
                            ) : (
                                <Send className="w-4 h-4" />
                            )}
                        </button>
                    </div>
                </div>
            )}

            {/* Backdrop */}
            {open && <div className="chatbot-backdrop" onClick={() => setOpen(false)} />}
        </>
    );
};

export default ChatbotFAB;