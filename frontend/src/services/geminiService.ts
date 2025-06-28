// geminiService.ts - Fixed Gemini API Implementation
export async function sendMessageToGemini(messages: { role: string, content: string }[]): Promise<string> {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    if (!apiKey) {
        throw new Error('Gemini API key is not configured. Please add VITE_GEMINI_API_KEY to your .env file.');
    }

    // Get the latest user message
    const latestMessage = messages[messages.length - 1]?.content || '';
    
    // Build conversation context
    const conversationContext = messages
        .slice(-5) // Last 5 messages for context
        .map(msg => `${msg.role === 'user' ? 'Human' : 'Assistant'}: ${msg.content}`)
        .join('\n');

    // Correct Gemini API endpoint and model
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;
    
    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            {
                                text: `You are Vaani-Nyay, a helpful legal AI assistant. You provide legal guidance and information to users in a professional and helpful manner.

Conversation context:
${conversationContext}

Please respond to the latest question professionally and helpfully. Keep responses concise but informative.`
                            }
                        ]
                    }
                ],
                generationConfig: {
                    temperature: 0.7,
                    topP: 0.8,
                    topK: 40,
                    maxOutputTokens: 200,
                    stopSequences: []
                },
                safetySettings: [
                    {
                        category: "HARM_CATEGORY_HARASSMENT",
                        threshold: "BLOCK_MEDIUM_AND_ABOVE"
                    },
                    {
                        category: "HARM_CATEGORY_HATE_SPEECH",
                        threshold: "BLOCK_MEDIUM_AND_ABOVE"
                    },
                    {
                        category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                        threshold: "BLOCK_MEDIUM_AND_ABOVE"
                    },
                    {
                        category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                        threshold: "BLOCK_MEDIUM_AND_ABOVE"
                    }
                ]
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Gemini API error:', errorData);
            
            if (response.status === 400) {
                throw new Error('Invalid request format or parameters.');
            } else if (response.status === 403) {
                throw new Error('API key is invalid or doesn\'t have permission.');
            } else if (response.status === 429) {
                throw new Error('Rate limit exceeded. Please try again later.');
            } else if (response.status === 404) {
                throw new Error('Model not found. Please check the model name.');
            } else {
                throw new Error(`Gemini API error: ${response.status} - ${errorData?.error?.message || 'Unknown error'}`);
            }
        }

        const data = await response.json();
        
        // Extract the response text
        const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (!responseText) {
            throw new Error('No response received from Gemini API');
        }

        return responseText.trim();
        
    } catch (error) {
        console.error('Gemini API call failed:', error);
        throw error;
    }
}

// Alternative function with different model (if the above doesn't work)
export async function sendMessageToGeminiAlternative(messages: { role: string, content: string }[]): Promise<string> {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    if (!apiKey) {
        throw new Error('Gemini API key is not configured.');
    }

    const latestMessage = messages[messages.length - 1]?.content || '';
    
    // Try with gemini-pro model (older but more stable)
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;
    
    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            {
                                text: `You are a helpful legal AI assistant named Vaani-Nyay. Please answer this question: ${latestMessage}`
                            }
                        ]
                    }
                ],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 150
                }
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Gemini API error: ${response.status} - ${errorData?.error?.message || 'Unknown error'}`);
        }

        const data = await response.json();
        const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (!responseText) {
            throw new Error('No response received from Gemini API');
        }

        return responseText.trim();
        
    } catch (error) {
        console.error('Gemini API call failed:', error);
        throw error;
    }
}

// Function to list available models (for debugging)
export async function listGeminiModels(): Promise<void> {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    if (!apiKey) {
        console.error('API key not found');
        return;
    }

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();
        console.log('Available Gemini models:', data.models?.map((m: any) => m.name));
    } catch (error) {
        console.error('Failed to list models:', error);
    }
}