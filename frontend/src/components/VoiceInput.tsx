import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, Home, Mic, MicOff, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from '@/hooks/use-toast';

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
  const { translate } = useLanguage();
  const [isListening, setIsListening] = useState(false);
  const [showExample, setShowExample] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const getFieldQuestion = (fieldKey: string) => {
    const questions = {
      'assemblyConstituencyNo': translate('question.assemblyConstituencyNo') || 'What is your Assembly Constituency Number?',
      'assemblyConstituencyName': translate('question.assemblyConstituencyName') || 'What is the name of your Assembly Constituency?',
      'parliamentaryConstituencyNo': translate('question.parliamentaryConstituencyNo') || 'What is your Parliamentary Constituency Number?',
      'parliamentaryConstituencyName': translate('question.parliamentaryConstituencyName') || 'What is the name of your Parliamentary Constituency?',
      'applicantName': translate('question.applicantName') || 'What is your full name?',
      'epicNo': translate('question.epicNo') || 'What is your EPIC (Voter ID) Number?',
      'aadhaarNumber': translate('question.aadhaarNumber') || 'What is your Aadhaar Number?',
      'mobileNoSelf': translate('question.mobileNoSelf') || 'What is your mobile number?',
      'mobileNoRelative': translate('question.mobileNoRelative') || 'What is your relative\'s mobile number?',
      'emailSelf': translate('question.emailSelf') || 'What is your email address?',
      'emailRelative': translate('question.emailRelative') || 'What is your relative\'s email address?',
      'shiftingReason': translate('question.shiftingReason') || 'What is the reason for shifting your residence?',
      'presentAddress.houseNo': translate('question.houseNo') || 'What is your house/building/apartment number?',
      'presentAddress.streetArea': translate('question.streetArea') || 'What is your street/area/locality/mohalla/road?',
      'presentAddress.townVillage': translate('question.townVillage') || 'What is your town/village name?',
      'presentAddress.postOffice': translate('question.postOffice') || 'What is your post office name?',
      'presentAddress.pinCode': translate('question.pinCode') || 'What is your PIN code?',
      'presentAddress.tehsilTaluka': translate('question.tehsilTaluka') || 'What is your tehsil/taluka/mandal name?',
      'presentAddress.district': translate('question.district') || 'What is your district name?',
      'presentAddress.stateUt': translate('question.stateUt') || 'What is your state/UT name?',
      'otherDocument': translate('question.otherDocument') || 'Please specify any other document you want to attach'
    };
    return questions[fieldKey] || field.label;
  };

  const getFieldExample = (fieldKey: string) => {
    const examples = {
      'assemblyConstituencyNo': translate('example.assemblyConstituencyNo') || 'e.g., 123',
      'assemblyConstituencyName': translate('example.assemblyConstituencyName') || 'e.g., Gandhi Nagar',
      'parliamentaryConstituencyNo': translate('example.parliamentaryConstituencyNo') || 'e.g., 45',
      'parliamentaryConstituencyName': translate('example.parliamentaryConstituencyName') || 'e.g., Delhi Central',
      'applicantName': translate('example.applicantName') || 'e.g., Raj Kumar Sharma',
      'epicNo': translate('example.epicNo') || 'e.g., ABC1234567',
      'aadhaarNumber': translate('example.aadhaarNumber') || 'e.g., 1234 5678 9012',
      'mobileNoSelf': translate('example.mobileNoSelf') || 'e.g., 9876543210',
      'mobileNoRelative': translate('example.mobileNoRelative') || 'e.g., 9876543210',
      'emailSelf': translate('example.emailSelf') || 'e.g., raj.sharma@gmail.com',
      'emailRelative': translate('example.emailRelative') || 'e.g., family@gmail.com',
      'shiftingReason': translate('example.shiftingReason') || 'e.g., Job transfer, Marriage, etc.',
      'presentAddress.houseNo': translate('example.houseNo') || 'e.g., A-123, Flat 405',
      'presentAddress.streetArea': translate('example.streetArea') || 'e.g., Main Street, Sector 15',
      'presentAddress.townVillage': translate('example.townVillage') || 'e.g., Delhi, Mumbai',
      'presentAddress.postOffice': translate('example.postOffice') || 'e.g., Central Post Office',
      'presentAddress.pinCode': translate('example.pinCode') || 'e.g., 110001',
      'presentAddress.tehsilTaluka': translate('example.tehsilTaluka') || 'e.g., Central Delhi',
      'presentAddress.district': translate('example.district') || 'e.g., New Delhi',
      'presentAddress.stateUt': translate('example.stateUt') || 'e.g., Delhi, Maharashtra',
      'otherDocument': translate('example.otherDocument') || 'e.g., Birth Certificate, Passport'
    };
    return examples[fieldKey] || '';
  };

  const getQuestionText = () => {
    // Use the field label directly for a user-friendly prompt
    return field.label;
  };

  const getExampleText = () => {
    // Optionally, you can keep this as is or improve examples
    return translate(`example.${field.key}`) || '';
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && canGoNext) {
      onNext();
    }
  };

  const startListening = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        onChange(value + ' ' + transcript);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        toast({
          title: "Voice Input Error",
          description: "Please try again or type your response.",
          variant: "destructive",
        });
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      toast({
        title: "Voice Input Not Supported",
        description: "Please type your response.",
        variant: "destructive",
      });
    }
  };

  const stopListening = () => {
    setIsListening(false);
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#141E28] p-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar - always visible, white slider */}
        <div className="bg-[#33FEBF] text-[#141E28] p-2 rounded mb-4">
          <p className="text-sm font-medium">
            {`Step ${currentStep + 1} of ${totalSteps}${sectionLabel ? ` - ${sectionLabel}` : field.section ? ` - ${field.section.toUpperCase()} SECTION` : ''}`}
          </p>
          <div className="w-full bg-[#141E28] rounded-full h-2 mt-2">
            <div
              className="bg-white h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>
        {/* Header */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => navigate('/forms')}
                className="border-[#33FEBF] text-[#33FEBF] hover:bg-[#33FEBF] hover:text-[#141E28]"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />

                {translate('button.back') || 'Back to Forms'}
              </Button>
            </div>





          </div>
        </div>

        <Card className="shadow-lg border border-[#33FEBF] bg-white">
          <CardHeader className="bg-white">
            <CardTitle className="text-xl text-center text-[#141E28]">
              {getQuestionText()}
            </CardTitle>
          </CardHeader>

          <CardContent className="p-8 bg-white">
            <div className="space-y-6">
              <div className="relative">
                {field.type === 'textarea' ? (
                  <Textarea
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={placeholder}
                    className="w-full text-lg p-4 border-2 border-[#33FEBF] focus:border-[#33FEBF] focus:ring-[#33FEBF] rounded-lg"
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
                    className="w-full text-lg p-4 border-2 border-[#33FEBF] focus:border-[#33FEBF] focus:ring-[#33FEBF] rounded-lg"
                  />
                )}

                {getExampleText() && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowExample(!showExample)}
                    className="absolute right-2 top-2 text-[#33FEBF] hover:text-[#33FEBF]/80"
                  >
                    <HelpCircle className="w-4 h-4" />
                  </Button>
                )}
              </div>

              {showExample && getExampleText() && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-700">
                    <strong>Example:</strong> {getExampleText()}
                  </p>
                </div>
              )}

              <div className="flex justify-center">
                <Button
                  onClick={toggleListening}
                  className={`${isListening
                    ? 'bg-red-500 hover:bg-red-600'
                    : 'bg-[#33FEBF] hover:bg-[#33FEBF]/90'
                    } text-white px-6 py-3`}
                >
                  {isListening ? <MicOff className="w-5 h-5 mr-2" /> : <Mic className="w-5 h-5 mr-2" />}
                  {isListening ? translate('button.stopListening') : translate('button.useVoice')}
                </Button>
              </div>

              <div className="flex justify-between pt-6 border-t border-gray-200">
                <Button
                  variant="outline"
                  onClick={onPrevious}
                  disabled={!canGoPrevious}
                  className="border-[#33FEBF] text-[#33FEBF] hover:bg-[#33FEBF] hover:text-[#141E28]"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {translate('button.previous')}
                </Button>

                <Button
                  onClick={onNext}
                  disabled={!canGoNext}
                  className="bg-[#33FEBF] hover:bg-[#33FEBF]/90 text-[#141E28]"
                >
                  {isLastField ? (translate('button.preview') || 'Preview') : (translate('button.next') || 'Next')}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VoiceInput;
