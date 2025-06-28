// Enhanced TTS utility with multi-language support
// File: hooks/useTTS.ts

import { useState, useCallback } from 'react';

interface TTSOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: any) => void;
}

interface Voice {
  name: string;
  lang: string;
  localService: boolean;
  default: boolean;
}

const useTTS = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<Voice[]>([]);

  /**
   * Speaks the given text in the specified language
   * @param text - Text to speak
   * @param lang - Language code (en-IN, hi-IN, mr-IN, kn-IN)
   * @param options - Additional speech options
   */
  const speak = useCallback((
    text: string, 
    lang: string = 'hi-IN',
    options: TTSOptions = {}
  ) => {
    const synth = window.speechSynthesis;
    
    if (!synth) {
      console.warn('Speech synthesis not supported in this browser');
      options.onError?.('Speech synthesis not supported');
      return;
    }

    const speakNow = () => {
      const voices = synth.getVoices();

      // Enhanced fallback mapping for better language support
      const fallbackMap: Record<string, string[]> = {
        'mr-IN': ['mr-IN', 'mr', 'hi-IN', 'hi', 'en-IN', 'en-US'],
        'kn-IN': ['kn-IN', 'kn', 'hi-IN', 'hi', 'en-IN', 'en-US'],
        'hi-IN': ['hi-IN', 'hi', 'en-IN', 'en-US'],
        'en-IN': ['en-IN', 'en-US', 'en-GB', 'en']
      };

      // Try to find the best matching voice
      const candidateLangs = [lang, ...(fallbackMap[lang] || ['en-IN', 'en-US'])];
      
      let matchedVoice = null;
      for (const candidateLang of candidateLangs) {
        // First try exact match
        matchedVoice = voices.find(v => v.lang === candidateLang);
        if (matchedVoice) break;
        
        // Then try partial match (language code without region)
        const langCode = candidateLang.split('-')[0];
        matchedVoice = voices.find(v => v.lang.startsWith(langCode));
        if (matchedVoice) break;
      }

      // Create utterance
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = options.rate || 0.85; // Slightly slower for better comprehension
      utterance.pitch = options.pitch || 1.0;
      utterance.volume = options.volume || 1.0;
      
      if (matchedVoice) {
        utterance.voice = matchedVoice;
        console.log(`Using voice: ${matchedVoice.name} (${matchedVoice.lang})`);
      } else {
        console.warn(`No suitable voice found for ${lang}, using default`);
      }

      // Event handlers
      utterance.onstart = () => {
        console.log(`Started speaking: "${text}" in ${lang}`);
        setIsSpeaking(true);
        options.onStart?.();
      };

      utterance.onend = () => {
        console.log(`Finished speaking: "${text}"`);
        setIsSpeaking(false);
        options.onEnd?.();
      };

      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        setIsSpeaking(false);
        options.onError?.(event);
      };

      // Cancel any ongoing speech and start new one
      synth.cancel();
      
      // Small delay to ensure cancellation is processed
      setTimeout(() => {
        synth.speak(utterance);
      }, 100);
    };

    // Handle voice loading - some browsers load voices asynchronously
    if (synth.getVoices().length === 0) {
      const handleVoicesChanged = () => {
        speakNow();
        synth.removeEventListener('voiceschanged', handleVoicesChanged);
      };
      synth.addEventListener('voiceschanged', handleVoicesChanged);
    } else {
      speakNow();
    }
  }, []);

  /**
   * Stops any ongoing speech
   */
  const stopSpeaking = useCallback(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  /**
   * Checks if speech synthesis is currently speaking
   */
  const isCurrentlySpeaking = useCallback(() => {
    return window.speechSynthesis?.speaking || false;
  }, []);

  /**
   * Gets available voices for a specific language
   */
  const getVoicesForLanguage = useCallback((lang: string) => {
    if (!window.speechSynthesis) return [];
    
    const voices = window.speechSynthesis.getVoices();
    const langCode = lang.split('-')[0];
    
    return voices.filter(voice => 
      voice.lang === lang || voice.lang.startsWith(langCode)
    );
  }, []);

  /**
   * Gets all available voices
   */
  const getAllVoices = useCallback(() => {
    return window.speechSynthesis?.getVoices() || [];
  }, []);

  /**
   * Initialize voices - call this on component mount
   */
  const initializeVoices = useCallback(() => {
    const synth = window.speechSynthesis;
    if (!synth) return;

    const loadVoices = () => {
      const voices = synth.getVoices();
      setAvailableVoices(voices);
    };

    if (synth.getVoices().length === 0) {
      synth.addEventListener('voiceschanged', loadVoices);
    } else {
      loadVoices();
    }

    return () => {
      synth.removeEventListener('voiceschanged', loadVoices);
    };
  }, []);

  /**
   * Check if TTS is supported
   */
  const isSupported = useCallback(() => {
    return 'speechSynthesis' in window;
  }, []);

  /**
   * Get supported languages from available voices
   */
  const getSupportedLanguages = useCallback(() => {
    const voices = getAllVoices();
    const languages = new Set(voices.map(voice => voice.lang));
    return Array.from(languages);
  }, [getAllVoices]);

  /**
   * Pause speaking (if supported by browser)
   */
  const pauseSpeaking = useCallback(() => {
    if (window.speechSynthesis && window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
    }
  }, []);

  /**
   * Resume speaking (if supported by browser)
   */
  const resumeSpeaking = useCallback(() => {
    if (window.speechSynthesis && window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
  }, []);

  return { 
    speak, 
    stopSpeaking, 
    isSpeaking,
    isCurrentlySpeaking,
    getVoicesForLanguage, 
    getAllVoices,
    initializeVoices,
    isSupported,
    getSupportedLanguages,
    pauseSpeaking,
    resumeSpeaking,
    availableVoices
  };
};

export default useTTS;