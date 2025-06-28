import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, Mic, MicOff, Volume2, VolumeX, Home, HelpCircle, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

// Enhanced TTS hook with better language support
const useTTS = () => {
  const speak = (text: string, lang: string = 'hi-IN') => {
    const synth = window.speechSynthesis;
    if (!synth) {
      console.warn('Speech synthesis not supported');
      return;
    }

    const speakNow = () => {
      const voices = synth.getVoices();

      // Prioritized fallback order for each language
      const fallbackMap: Record<string, string[]> = {
        'mr-IN': ['mr', 'hi-IN', 'hi', 'en-IN', 'en-US'],
        'kn-IN': ['kn', 'hi-IN', 'hi', 'en-IN', 'en-US'],
        'hi-IN': ['hi-IN', 'hi', 'en-IN', 'en-US'],
        'en-IN': ['en-IN', 'en-US', 'en-GB', 'en']
      };

      // Try to find the best voice
      const candidateLangs = [lang, ...(fallbackMap[lang] || ['en-IN', 'en-US'])];
      const matchedVoice = candidateLangs
        .map(code => voices.find(v => v.lang.startsWith(code.split('-')[0])))
        .find(Boolean);

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 0.9; // Slightly slower for better comprehension
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }

      // Cancel any ongoing speech
      synth.cancel();
      synth.speak(utterance);
    };

    // Handle voice loading
    if (synth.getVoices().length === 0) {
      const handleVoicesChanged = () => {
        speakNow();
        synth.removeEventListener('voiceschanged', handleVoicesChanged);
      };
      synth.addEventListener('voiceschanged', handleVoicesChanged);
    } else {
      speakNow();
    }
  };

  const stopSpeaking = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  };

  return { speak, stopSpeaking };
};

interface VoiceInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  field: {
    key: string;
    label: string;
    type: string;
    section: string;
    options?: string[];
  };
  onNext: () => void;
  onPrevious: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
  isLastField: boolean;
  currentStep: number;
  totalSteps: number;
  sectionLabel?: string;
}

// Field labels in different languages for TTS
const fieldLabels: Record<string, Record<string, string>> = {
  'assemblyConstituencyNo': {
    'en-IN': 'Assembly Constituency Number',
    'hi-IN': 'विधान सभा निर्वाचन क्षेत्र संख्या',
    'mr-IN': 'विधानसभा मतदारसंघ क्रमांक',
    'kn-IN': 'ವಿಧಾನಸಭಾ ಕ್ಷೇತ್ರ ಸಂಖ್ಯೆ'
  },
  // ... (keep all other field labels from original)
};

// Instructions in different languages
const instructions: Record<string, string> = {
  'en-IN': 'Please enter',
  'hi-IN': 'कृपया दर्ज करें',
  'mr-IN': 'कृपया प्रविष्ट करा',
  'kn-IN': 'ದಯವಿಟ್ಟು ನಮೂದಿಸಿ'
};

const VoiceInput = ({
  value,
  onChange,
  placeholder,
  field,
  onNext,
  onPrevious,
  canGoNext,
  canGoPrevious,
  isLastField,
  currentStep,
  totalSteps,
  sectionLabel
}: VoiceInputProps) => {
  const navigate = useNavigate();
  const { translate, selectedLanguage, speechLang } = useLanguage();
  const { speak, stopSpeaking } = useTTS();
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showExample, setShowExample] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedTTSLang, setSelectedTTSLang] = useState('en-IN');
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    },
    exit: { opacity: 0, y: -20 }
  };

  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  };

  const pulseVariants = {
    initial: { scale: 1 },
    pulse: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  // Get localized field label
  const getLocalizedLabel = (fieldKey: string, lang: string) => {
    return fieldLabels[fieldKey]?.[lang] || field.label;
  };

  // Speak field label with instructions
  const speakFieldLabel = () => {
    const instruction = instructions[selectedTTSLang] || instructions['en-IN'];
    const localizedLabel = getLocalizedLabel(field.key, selectedTTSLang);
    const textToSpeak = `${instruction} ${localizedLabel}`;

    setIsSpeaking(true);
    speak(textToSpeak, selectedTTSLang);

    // Reset speaking state after a delay
    setTimeout(() => setIsSpeaking(false), 3000);
  };

  const getFieldQuestion = (fieldKey: string) => {
    return translate(`question.${fieldKey}`) || field.label;
  };

  const getFieldExample = (fieldKey: string) => {
    return translate(`example.${fieldKey}`) || '';
  };

  const getFieldHint = (fieldKey: string) => {
    const hints = {
      'assemblyConstituencyNo': {
        title: 'Assembly Constituency Number',
        description: 'This is the number assigned to your local electoral area. You can find it on your voter ID card or by checking the Election Commission website.',
        example: 'e.g., 123',
        tips: [
          'Check your voter ID card for this number',
          'Contact your local electoral office if unsure',
          'Must be a numeric value'
        ]
      },
      'assemblyConstituencyName': {
        title: 'Assembly Constituency Name',
        description: 'The name of your local electoral area where you are registered to vote.',
        example: 'e.g., Gandhi Nagar',
        tips: [
          'Should match exactly with official records',
          'Check recent election notifications for exact spelling',
          'Usually named after a prominent local area or leader'
        ]
      },
      'applicantName': {
        title: 'Full Name',
        description: 'Your complete legal name as it appears on official documents.',
        example: 'e.g., Raj Kumar Sharma',
        tips: [
          'Enter exactly as in your ID proof',
          'Include middle name if applicable',
          'Avoid nicknames or abbreviations'
        ]
      },
      'epicNo': {
        title: 'Voter ID Number',
        description: 'The unique identification number on your Electors Photo Identity Card (EPIC).',
        example: 'e.g., ABC1234567',
        tips: [
          '10-character alphanumeric code',
          'Found on the front of your voter ID',
          'Starts with letters followed by numbers'
        ]
      },
      'aadhaarNumber': {
        title: 'Aadhaar Number',
        description: 'Your 12-digit unique identification number issued by UIDAI.',
        example: 'e.g., 1234 5678 9012',
        tips: [
          'Exactly 12 digits with no spaces or hyphens',
          'Can be found on your Aadhaar card',
          'Not mandatory but helps in verification'
        ]
      },
      'mobileNoSelf': {
        title: 'Mobile Number',
        description: 'Your personal mobile number for official communication.',
        example: 'e.g., 9876543210',
        tips: [
          'Should be active and accessible',
          '10-digit Indian mobile number',
          'Will receive OTPs and updates'
        ]
      },
      'presentAddress.houseNo': {
        title: 'House/Building Number',
        description: 'The official number or name of your residence.',
        example: 'e.g., A-123, Flat 405',
        tips: [
          'As per your address proof document',
          'Include floor/unit if applicable',
          'Should match utility bills'
        ]
      },
      'presentAddress.pinCode': {
        title: 'PIN Code',
        description: '6-digit postal code for your area.',
        example: 'e.g., 110001',
        tips: [
          'Find on India Post website if unsure',
          'Must match your current address',
          'First digit indicates region'
        ]
      },
    };

    const defaultHint = {
      title: field.label,
      description: 'Please provide the required information for this field.',
      example: 'e.g., Enter appropriate value',
      tips: [
        'Check your official documents',
        'Ensure accuracy of information',
        'Contact support if unsure'
      ]
    };

    return hints[fieldKey] || defaultHint;
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && canGoNext) {
      setIsAnimating(true);
      setTimeout(() => {
        onNext();
        setIsAnimating(false);
      }, 300);
    }
  };

  const handleLanguageChange = (newLang: string) => {
    stopSpeaking(); // Stop current speech
    setSelectedTTSLang(newLang);
  };

  const startListening = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();

      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = speechLang;

      recognitionRef.current.onstart = () => {
        setIsListening(true);
      };

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        onChange(value + (value ? ' ' : '') + transcript);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        toast({
          title: translate('error.voiceInput') || 'Voice Input Error',
          description: translate('error.tryAgainOrType') || 'Please try again or type your response.',
          variant: 'destructive'
        });
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.start();
    } else {
      toast({
        title: translate('error.voiceNotSupported') || 'Voice Input Not Supported',
        description: translate('error.pleaseType') || 'Please type your response.',
        variant: 'destructive'
      });
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleStopSpeaking = () => {
    stopSpeaking();
    setIsSpeaking(false);
  };

  const handleNext = () => {
    setIsAnimating(true);
    setTimeout(() => {
      onNext();
      setIsAnimating(false);
    }, 300);
  };

  const handlePrevious = () => {
    setIsAnimating(true);
    setTimeout(() => {
      onPrevious();
      setIsAnimating(false);
    }, 300);
  };

  // Auto-speak when component mounts or language changes
  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();

    // Wait for voices to load and component to be ready
    const timeout = setTimeout(() => {
      speakFieldLabel();
    }, 500);

    return () => {
      clearTimeout(timeout);
      stopSpeaking(); // Stop any ongoing speech when unmounting
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [selectedTTSLang, field.key]);

  const currentHint = getFieldHint(field.key);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={containerVariants}
      className="min-h-screen bg-[#141E28] p-4"
    >
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <motion.div
          className="bg-[#33FEBF] text-[#141E28] p-4 rounded-lg mb-6 shadow-lg"
          whileHover={{ scale: 1.01 }}
        >
          <div className="flex justify-between items-center mb-1">
            <p className="text-sm font-semibold">
              {`${translate('step.label') || 'Step'} ${currentStep + 1} ${translate('of.label') || 'of'} ${totalSteps}${sectionLabel ? ` - ${sectionLabel}` : field.section ? ` - ${field.section.toUpperCase()} ${translate('section.label') || 'SECTION'}` : ''}`}
            </p>
            <p className="text-sm font-semibold">
              {Math.round(((currentStep + 1) / totalSteps) * 100)}% {translate('complete') || 'Complete'}
            </p>
          </div>
          <div className="w-full bg-[#141E28] bg-opacity-30 rounded-full h-3">
            <motion.div
              className="bg-white h-3 rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
        </motion.div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <motion.div whileHover={{ x: -5 }}>
              <Button
                variant="outline"
                onClick={() => navigate('/forms')}
                className="border-2 border-[#33FEBF] hover:bg-[#33FEBF] hover:text-[#141E28]"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {translate('button.back') || 'Back to Forms'}
              </Button>
            </motion.div>
          </div>
        </div>

        <motion.div
          key={field.key}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="shadow-xl border-2 border-[#33FEBF] bg-white overflow-hidden">
            <CardHeader className="bg-[#33FEBF] p-6">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl md:text-2xl text-center text-[#141E28] font-bold">
                  {getFieldQuestion(field.key)}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowHint(!showHint)}
                  className="text-[#141E28] hover:bg-[#141E28]/10"
                >
                  <Info className="w-5 h-5" />
                </Button>
              </div>

              {/* Audio Control Buttons */}
              <div className="flex justify-center items-center gap-3 mt-4">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={speakFieldLabel}
                  disabled={isSpeaking}
                  className="flex items-center gap-2 text-[#141E28] hover:bg-[#141E28] hover:text-white"
                >
                  <Volume2 className="w-5 h-5" />
                  {translate('button.listenAgain') || 'Listen Again'}
                </Button>

                {isSpeaking && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleStopSpeaking}
                    className="flex items-center gap-2 text-red-600 hover:bg-red-100"
                  >
                    <VolumeX className="w-5 h-5" />
                    {translate('button.stop') || 'Stop'}
                  </Button>
                )}
              </div>

              {/* Language Selector */}
              <div className="flex justify-center mt-4">
                <div className="flex flex-col items-center gap-2">
                  <label className="text-sm text-[#141E28] font-medium">
                    {translate('language.audio') || 'Audio Language'}
                  </label>
                  <select
                    value={selectedTTSLang}
                    onChange={(e) => handleLanguageChange(e.target.value)}
                    className="border-2 border-[#141E28] rounded-lg px-4 py-2 text-[#141E28] bg-white focus:ring-2 focus:ring-[#141E28] focus:outline-none"
                  >
                    <option value="en-IN">English (English)</option>
                    <option value="hi-IN">Hindi (हिंदी)</option>
                    <option value="mr-IN">Marathi (मराठी)</option>
                    <option value="kn-IN">Kannada (ಕನ್ನಡ)</option>
                  </select>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6 md:p-8 bg-white">
              <div className="space-y-6">
                <AnimatePresence>
                  {showHint && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-[#33FEBF]/10 border border-[#33FEBF]/30 rounded-lg p-4 overflow-hidden mb-4"
                    >
                      <h3 className="font-bold text-[#141E28] mb-2">{currentHint.title}</h3>
                      <p className="text-sm text-[#141E28] mb-3">{currentHint.description}</p>

                      <div className="mb-3">
                        <p className="text-sm font-medium text-[#141E28]">Example:</p>
                        <p className="text-sm text-[#141E28] bg-white/50 p-2 rounded">{currentHint.example}</p>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-[#141E28]">Tips:</p>
                        <ul className="list-disc pl-5 text-sm text-[#141E28] space-y-1">
                          {currentHint.tips.map((tip, index) => (
                            <li key={index}>{tip}</li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="relative">
                  {field.type === 'textarea' ? (
                    <Textarea
                      value={value}
                      onChange={(e) => onChange(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder={placeholder}
                      className="w-full text-lg p-4 border-2 border-[#33FEBF] focus:border-[#33FEBF] focus:ring-2 focus:ring-[#33FEBF]/50 rounded-lg transition-all duration-200"
                      rows={4}
                    />
                  ) : (
                    <Input
                      ref={inputRef}
                      type={field.type === 'email' ? 'email' : 'text'}
                      value={value}
                      onChange={(e) => onChange(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder={placeholder}
                      className="w-full text-lg p-4 border-2 border-[#33FEBF] focus:border-[#33FEBF] focus:ring-2 focus:ring-[#33FEBF]/50 rounded-lg transition-all duration-200"
                    />
                  )}

                  {getFieldExample(field.key) && (
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="absolute right-2 top-2"
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowExample(!showExample)}
                        className="text-[#33FEBF] hover:bg-[#33FEBF]/10"
                      >
                        <HelpCircle className="w-5 h-5" />
                      </Button>
                    </motion.div>
                  )}
                </div>

                <AnimatePresence>
                  {showExample && getFieldExample(field.key) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-[#33FEBF]/10 border border-[#33FEBF]/30 rounded-lg p-3 overflow-hidden"
                    >
                      <p className="text-sm text-[#141E28]">
                        <strong>{translate('example') || 'Example'}:</strong> {getFieldExample(field.key)}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.div
                  className="flex justify-center"
                  whileHover={{ scale: 1.02 }}
                >
                  <motion.button
                    onClick={toggleListening}
                    className={`${isListening
                      ? 'bg-red-500 hover:bg-red-600 shadow-lg'
                      : 'bg-[#33FEBF] hover:bg-[#33FEBF]/90 shadow-lg'
                      } text-white px-8 py-4 rounded-full flex items-center text-lg font-medium`}
                    whileHover="hover"
                    whileTap="tap"
                    animate={isListening ? "pulse" : "initial"}
                    variants={isListening ? pulseVariants : buttonVariants}
                  >
                    {isListening ? (
                      <>
                        <MicOff className="w-6 h-6 mr-3" />
                        {translate('button.stopListening') || 'Stop Listening'}
                      </>
                    ) : (
                      <>
                        <Mic className="w-6 h-6 mr-3" />
                        {translate('button.useVoice') || 'Use Voice Input'}
                      </>
                    )}
                  </motion.button>
                </motion.div>

                <div className="flex justify-between pt-6 border-t border-[#33FEBF]/20">
                  <motion.div
                    whileHover={{ x: -5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="outline"
                      onClick={handlePrevious}
                      disabled={!canGoPrevious}
                      className={`border-2 ${canGoPrevious ? 'border-[#33FEBF] hover:bg-[#33FEBF] hover:text-[#141E28]' : 'border-gray-300 text-gray-400'} px-6 py-3`}
                    >
                      <ArrowLeft className="w-5 h-5 mr-2" />
                      {translate('button.previous') || 'Previous'}
                    </Button>
                  </motion.div>

                  <motion.div
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      onClick={handleNext}
                      disabled={!canGoNext}
                      className={`bg-[#33FEBF] hover:bg-[#33FEBF]/90 text-[#141E28] px-6 py-3 ${isAnimating ? 'animate-pulse' : ''}`}
                    >
                      {isLastField ? (translate('button.preview') || 'Preview') : (translate('button.next') || 'Next')}
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </motion.div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default VoiceInput;