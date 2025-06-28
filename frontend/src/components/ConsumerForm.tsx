import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import VoiceInput from './VoiceInput';
import { useLanguage } from '@/contexts/LanguageContext';
import ConsumerPreview from './ConsumerPreview';

interface ConsumerFormData {
  // Case Details
  caseNumber: string;
  forumType: 'district' | 'state' | 'national';
  forumName: string;
  complaintNumber: string;
  matter: string;

  // Complainant Details
  complainantName: string;
  complainantAddress: string;

  // Opposite Party Details
  oppositePartyName: string;
  oppositePartyAddress: string;

  // Complaint Details
  complaintText: string;

  // Prayer Details
  refundAmount: string;
  compensationAmount: string;
  litigationCost: boolean;

  // Verification
  verificationPlace: string;
  verificationDate: string;

  // Annexures
  annexures: string[];
}

const ConsumerForm = () => {
  const navigate = useNavigate();
  const { translate } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [formData, setFormData] = useState<ConsumerFormData>({
    caseNumber: '',
    forumType: 'district',
    forumName: '',
    complaintNumber: '',
    matter: '',
    complainantName: '',
    complainantAddress: '',
    oppositePartyName: '',
    oppositePartyAddress: '',
    complaintText: '',
    refundAmount: '',
    compensationAmount: '',
    litigationCost: false,
    verificationPlace: '',
    verificationDate: '',
    annexures: ['', '', '']
  });

  const formFields = [
    // Case Details
    { key: 'caseNumber', label: 'Case Number', type: 'text', section: 'case' },
    {
      key: 'forumType',
      label: 'Forum Type',
      type: 'radio',
      section: 'case',
      options: ['District Forum', 'State Commission', 'National Commission']
    },
    { key: 'forumName', label: 'Forum Name', type: 'text', section: 'case' },
    { key: 'complaintNumber', label: 'Complaint Number', type: 'text', section: 'case' },
    { key: 'matter', label: 'Matter of', type: 'textarea', section: 'case' },

    // Complainant Details
    { key: 'complainantName', label: 'Name & address of complainant', type: 'textarea', section: 'complainant' },

    // Opposite Party Details
    { key: 'oppositePartyName', label: 'Name & address of opposite party', type: 'textarea', section: 'opposite' },

    // Complaint Details
    { key: 'complaintText', label: 'Complaint text', type: 'textarea', section: 'complaint' },

    // Prayer Details
    { key: 'refundAmount', label: 'Refund amount (Rs.)', type: 'text', section: 'prayer' },
    { key: 'compensationAmount', label: 'Compensation amount (Rs.)', type: 'text', section: 'prayer' },
    {
      key: 'litigationCost',
      label: 'Cost of litigation',
      type: 'radio',
      section: 'prayer',
      options: ['Yes', 'No']
    },

    // Verification
    { key: 'verificationPlace', label: 'Place of verification', type: 'text', section: 'verification' },
    { key: 'verificationDate', label: 'Date of verification', type: 'text', section: 'verification' },

    // Annexures
    { key: 'annexures.0', label: 'Annexure I', type: 'textarea', section: 'annexures' },
    { key: 'annexures.1', label: 'Annexure II', type: 'textarea', section: 'annexures' },
    { key: 'annexures.2', label: 'Annexure III', type: 'textarea', section: 'annexures' }
  ];

  const handleInputChange = (key: string, value: string | boolean | string[]) => {
    if (key.includes('.')) {
      const [parent, child] = key.split('.');
      const index = parseInt(child);
      setFormData(prev => ({
        ...prev,
        [parent]: Array.isArray(prev[parent as keyof ConsumerFormData])
          ? (prev[parent as keyof ConsumerFormData] as string[]).map((item: string, i: number) =>
            i === index ? value : item
          )
          : prev[parent as keyof ConsumerFormData]
      }));

    } else if (key === 'forumType') {
      setFormData(prev => ({
        ...prev,
        forumType: value === 'District Forum' ? 'district' :
          value === 'State Commission' ? 'state' : 'national'
      }));
    } else if (key === 'litigationCost') {
      setFormData(prev => ({
        ...prev,
        litigationCost: value === 'Yes'
      }));
    } else {
      setFormData(prev => ({ ...prev, [key]: value }));
    }
  };

  const getCurrentValue = (key: string) => {
    if (key.includes('.')) {
      const [parent, child] = key.split('.');
      const index = parseInt(child);
      return formData[parent as keyof ConsumerFormData][index];
    } else if (key === 'forumType') {
      return formData.forumType === 'district' ? 'District Forum' :
        formData.forumType === 'state' ? 'State Commission' : 'National Commission';
    } else if (key === 'litigationCost') {
      return formData.litigationCost ? 'Yes' : 'No';
    }
    return formData[key as keyof ConsumerFormData] as string;
  };

  const nextStep = () => {
    if (editingField) {
      const confirmed = window.confirm(translate('confirm.saveChanges') || 'Save changes and return to preview?');
      if (confirmed) {
        setEditingField(null);
        setShowPreview(true);
      }
      return;
    }

    if (currentStep < formFields.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowPreview(true);
    }
  };

  const prevStep = () => {
    if (showPreview) {
      setShowPreview(false);
      setCurrentStep(formFields.length - 1);
    } else if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleEdit = (field: string) => {
    const fieldIndex = formFields.findIndex(f => f.key === field);
    if (fieldIndex !== -1) {
      setCurrentStep(fieldIndex);
      setShowPreview(false);
      setEditingField(field);
    }
  };

  const currentField = formFields[currentStep];

  if (showPreview) {
    return (
      <ConsumerPreview
        formData={formData}
        onBack={prevStep}
        onEdit={handleEdit}
      />
    );
  }

  if (!['radio'].includes(currentField.type)) {
    return (
      <VoiceInput
        value={getCurrentValue(currentField.key)}
        onChange={(value) => handleInputChange(currentField.key, value)}
        placeholder={`Enter ${currentField.label.toLowerCase()}`}
        field={currentField}
        onNext={nextStep}
        onPrevious={prevStep}
        canGoNext={true}
        canGoPrevious={currentStep > 0 || showPreview || editingField !== null}
        isLastField={currentStep === formFields.length - 1}
        currentStep={currentStep}
        totalSteps={formFields.length}
        sectionLabel={currentField.section ? currentField.section.toUpperCase() : undefined}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#141E28] p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <Button
              variant="outline"
              onClick={() => navigate('/forms')} // <-- changed from '/' to '/forms'
              className="border-[#33FEBF] text-[#33FEBF] hover:bg-[#33FEBF] hover:text-[#141E28]"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {translate('button.back')}
            </Button>
          </div>

          <div className="bg-[#33FEBF] text-[#141E28] p-2 rounded mb-4">
            <p className="text-sm font-medium">
              {translate('step.label') || 'Step'} {currentStep + 1} {translate('of.label') || 'of'} {formFields.length} - {currentField.section.toUpperCase()} {translate('section.label') || 'SECTION'}
            </p>
            <div className="w-full bg-[#141E28] rounded-full h-2 mt-2">
              <div
                className="bg-[#33FEBF] h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / formFields.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        <Card className="shadow-lg border border-[#33FEBF] bg-white">
          <CardHeader className="bg-[#33FEBF] text-[#141E28]">
            <CardTitle className="text-xl text-center">
              {translate('software.name')} - Consumer Complaint Form
            </CardTitle>
            <p className="text-center text-sm">Consumer Protection Act, 1986</p>
          </CardHeader>

          <CardContent className="p-8 bg-white">
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-[#141E28] mb-4">
                  {currentField.label}
                </h2>
              </div>

              {currentField.type === 'radio' && (
                <div className="space-y-4">
                  {currentField.options?.map((option) => (
                    <label key={option} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name={currentField.key}
                        value={option}
                        checked={getCurrentValue(currentField.key) === option}
                        onChange={(e) => handleInputChange(currentField.key, e.target.value)}
                        className="w-4 h-4 text-[#33FEBF]"
                      />
                      <span className="text-[#141E28]">{option}</span>
                    </label>
                  ))}
                </div>
              )}

              <div className="flex justify-between pt-6 border-t border-gray-200">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="border-[#33FEBF] text-[#33FEBF] hover:bg-[#33FEBF] hover:text-[#141E28]"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {translate('button.previous')}
                </Button>

                <Button
                  onClick={nextStep}
                  className="bg-[#33FEBF] hover:bg-[#33FEBF]/90 text-[#141E28]"
                >
                  {currentStep === formFields.length - 1 ? (translate('button.preview') || 'Preview') : (translate('button.next') || 'Next')}
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

export default ConsumerForm;