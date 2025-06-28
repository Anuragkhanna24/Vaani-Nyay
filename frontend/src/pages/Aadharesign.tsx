import React, { useState, useEffect } from 'react';
import {
  FileText,
  Shield,
  Smartphone,
  PenTool,
  CheckCircle,
  Eye,
  EyeOff,
  Clock,
  Download,
  Send,
  AlertCircle,
  Lock,
  Award,
  RefreshCw,
  Home
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface FormData {
  aadhaarNumber: string;
  mobileNumber: string;
  otp: string;
  consentGiven: boolean;
}

const AadhaarESignPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    aadhaarNumber: '',
    mobileNumber: '',
    otp: '',
    consentGiven: false
  });
  const [showAadhaar, setShowAadhaar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [otpTimer, setOtpTimer] = useState(300); // 5 minutes
  const [signatureProgress, setSignatureProgress] = useState(0);

  const navigate = useNavigate();

  const steps = [
    { id: 1, title: 'Document Review', icon: FileText },
    { id: 2, title: 'Aadhaar Verification', icon: Shield },
    { id: 3, title: 'OTP Authentication', icon: Smartphone },
    { id: 4, title: 'Digital Signature', icon: PenTool },
    { id: 5, title: 'Submission', icon: CheckCircle }
  ];

  // OTP Timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (currentStep === 3 && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [currentStep, otpTimer]);

  // Signature progress animation
  useEffect(() => {
    if (currentStep === 4) {
      const interval = setInterval(() => {
        setSignatureProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setCurrentStep(5), 1000);
            return 100;
          }
          return prev + 2;
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [currentStep]);

  const formatAadhaar = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const formatted = cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
    return formatted.substring(0, 14); // 12 digits + 2 spaces
  };

  const formatMobile = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    return cleaned.substring(0, 10);
  };

  const formatOTP = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    return cleaned.substring(0, 6);
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.consentGiven) {
          newErrors.consent = 'You must provide consent to proceed';
        }
        break;
      case 2:
        const aadhaarDigits = formData.aadhaarNumber.replace(/\s/g, '');
        if (!aadhaarDigits || aadhaarDigits.length !== 12) {
          newErrors.aadhaar = 'Please enter a valid 12-digit Aadhaar number';
        }
        if (!formData.mobileNumber || formData.mobileNumber.length !== 10) {
          newErrors.mobile = 'Please enter a valid 10-digit mobile number';
        }
        break;
      case 3:
        if (!formData.otp || formData.otp.length !== 6) {
          newErrors.otp = 'Please enter the 6-digit OTP';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleNext = async () => {
    if (!validateStep(currentStep)) return;

    setLoading(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (currentStep === 2) {
      setOtpTimer(300); // Reset timer when moving to OTP step
    }

    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
    } else if (currentStep === 4) {
      setSignatureProgress(0);
      // Progress animation will handle moving to step 5
    }

    setLoading(false);
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setOtpTimer(300);
    setLoading(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">Document Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-600">Document:</span>
                  <p className="text-gray-900">Application_Form_2024.pdf • 245 KB</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Court:</span>
                  <p className="text-gray-900">District Court, Indore</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Case Number:</span>
                  <p className="text-gray-900">VN/2024/001234</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Filing Date:</span>
                  <p className="text-gray-900">June 13, 2025</p>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                <div className="text-sm text-amber-800">
                  <p className="font-medium">Important Notice</p>
                  <p>By proceeding with e-Sign, you acknowledge that this document will be digitally signed using your Aadhaar-based authentication. This signature will have the same legal validity as a physical signature.</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  checked={formData.consentGiven}
                  onChange={(e) => handleInputChange('consentGiven', e.target.checked)}
                  className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">
                  I have read and understood the document contents. I provide my consent for Aadhaar-based authentication and digital signing of this document.
                </span>
              </label>
              {errors.consent && (
                <p className="text-red-600 text-sm ml-7">{errors.consent}</p>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Aadhaar Number
                </label>
                <div className="relative">
                  <input
                    type={showAadhaar ? "text" : "password"}
                    value={formData.aadhaarNumber}
                    onChange={(e) => handleInputChange('aadhaarNumber', formatAadhaar(e.target.value))}
                    placeholder="XXXX XXXX XXXX"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAadhaar(!showAadhaar)}
                    className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                  >
                    {showAadhaar ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.aadhaar && (
                  <p className="text-red-600 text-sm mt-1">{errors.aadhaar}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile Number
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-500">+91</span>
                  <input
                    type="tel"
                    value={formData.mobileNumber}
                    onChange={(e) => handleInputChange('mobileNumber', formatMobile(e.target.value))}
                    placeholder="9876543210"
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                {errors.mobile && (
                  <p className="text-red-600 text-sm mt-1">{errors.mobile}</p>
                )}
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-center space-x-2">
                <Lock className="h-5 w-5 text-green-600" />
                <p className="text-sm text-green-800 font-medium">Secure Verification</p>
              </div>
              <p className="text-sm text-green-700 mt-1">
                Your Aadhaar details are encrypted and processed securely through UIDAI's e-Sign service.
              </p>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Smartphone className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">OTP Verification</h3>
              <p className="text-sm text-gray-600">
                An OTP has been sent to +91 {formData.mobileNumber.replace(/(\d{5})(\d{5})/, '$1*****')}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter 6-digit OTP
              </label>
              <input
                type="text"
                value={formData.otp}
                onChange={(e) => handleInputChange('otp', formatOTP(e.target.value))}
                placeholder="123456"
                className="w-full px-4 py-3 text-center text-2xl font-mono border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 tracking-widest"
                maxLength={6}
              />
              {errors.otp && (
                <p className="text-red-600 text-sm mt-1">{errors.otp}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  Time remaining: {formatTime(otpTimer)}
                </span>
              </div>
              <button
                onClick={handleResendOTP}
                disabled={otpTimer > 0 || loading}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium disabled:text-gray-400 disabled:cursor-not-allowed flex items-center space-x-1"
              >
                {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                <span>Resend OTP</span>
              </button>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-blue-600" />
                <p className="text-sm text-blue-800 font-medium">Secure Authentication</p>
              </div>
              <p className="text-sm text-blue-700 mt-1">
                This OTP is valid for 5 minutes and can only be used once for security purposes.
              </p>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <PenTool className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Generating Digital Signature</h3>
              <p className="text-sm text-gray-600">
                Please wait while we process your digital signature...
              </p>
            </div>

            <div className="space-y-4">
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${signatureProgress}%` }}
                ></div>
              </div>
              <div className="text-center">
                <span className="text-sm font-medium text-gray-700">{signatureProgress}% Complete</span>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border">
              <h4 className="font-medium text-gray-900 mb-3">Certificate Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Certificate Authority:</span>
                  <span className="text-gray-900">e-Mudhra CA</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Algorithm:</span>
                  <span className="text-gray-900">RSA-2048</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Hash Algorithm:</span>
                  <span className="text-gray-900">SHA-256</span>
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-center space-x-2">
                <Award className="h-5 w-5 text-green-600" />
                <p className="text-sm text-green-800 font-medium">Legal Compliance</p>
              </div>
              <p className="text-sm text-green-700 mt-1">
                This signature complies with IT Act 2000 and is legally valid for all official purposes.
              </p>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Document Successfully Signed</h3>
              <p className="text-gray-600">
                Your document has been digitally signed and is ready for submission.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg border">
              <h4 className="font-medium text-gray-900 mb-4">Signature Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-600">Document Status:</span>
                  <p className="text-green-600 font-medium">Successfully Signed</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Signature Time:</span>
                  <p className="text-gray-900">June 13, 2025, 2:30 PM IST</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Hash Value:</span>
                  <p className="text-gray-900 font-mono text-xs break-all">
                    SHA256: a1b2c3d4e5f6789012345678901234567890abcdef
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Certificate Serial:</span>
                  <p className="text-gray-900 font-mono">123456789</p>
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <button className="flex-1 flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                <Download className="h-5 w-5 mr-2" />
                Download Signed Document
              </button>
              <button className="flex-1 flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                <Send className="h-5 w-5 mr-2" />
                Submit
              </button>
              <button
                className="flex-1 flex items-center justify-center px-4 py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                onClick={() => navigate('/forms')}
              >
                <Home className="h-5 w-5 mr-2" />
                Home
              </button>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-900 mb-2">Next Steps</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Download and save the signed document for your records</li>
                <li>• Submit the document to the court registry</li>
                <li>• You will receive a confirmation email with case details</li>
                <li>• Track your case status through the court portal</li>
              </ul>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Aadhaar e-Sign</h1>
          <p className="text-gray-600">Secure Digital Document Signing</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;

              return (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className={`
                      w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all
                      ${isCompleted ? 'bg-green-600 border-green-600 text-white' :
                        isActive ? 'bg-blue-600 border-blue-600 text-white' :
                          'bg-white border-gray-300 text-gray-400'}
                    `}>
                      {isCompleted ? <CheckCircle className="h-6 w-6" /> : <Icon className="h-6 w-6" />}
                    </div>
                    <span className={`
                      mt-2 text-xs font-medium text-center
                      ${isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'}
                    `}>
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`
                      flex-1 h-0.5 mx-4 transition-all
                      ${currentStep > step.id ? 'bg-green-600' : 'bg-gray-300'}
                    `} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm border p-8">
          {renderStepContent()}

          {/* Navigation Buttons */}
          {currentStep < 5 && (
            <div className="flex justify-between mt-8 pt-6 border-t">
              <button
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <button
                onClick={handleNext}
                disabled={loading || currentStep === 4}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
              >
                {loading && <RefreshCw className="h-4 w-4 animate-spin" />}
                <span>{currentStep === 3 ? 'Verify OTP' : 'Continue'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <div className="bg-white rounded-lg border p-4">
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Lock className="h-4 w-4" />
                <span>256-bit SSL Encryption</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4" />
                <span>UIDAI Certified</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="h-4 w-4" />
                <span>IT Act 2000 Compliant</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AadhaarESignPage;