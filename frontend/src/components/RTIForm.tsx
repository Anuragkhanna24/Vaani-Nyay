import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import VoiceInput from './VoiceInput';
import { useLanguage } from '@/contexts/LanguageContext';
import RTIPreview from './RTIPreview';

interface RTIFormData {
  // Contact Details
  applicantName: string;
  mailingAddress: string;
  telephone: string;
  email: string;
  isIndianCitizen: boolean;

  // Information Sought
  informationNature: 'lifeLiberty' | 'other';
  informationType: {
    copyDocuments: boolean;
    inspectRecords: boolean;
    sampleMaterial: boolean;
    otherInfo: boolean;
  };
  otherInfoDescription: string;

  // Third Party Info
  relatesToThirdParty: boolean;
  thirdPartyName: string;
  thirdPartyAddress: string;

  // Information Details
  particulars: string[];
  timePeriod: string;

  // BPL Category
  isBPL: boolean;
  bplProofAttached: boolean;

  // Fee Details
  feePaid: string;
}

const RTIForm = () => {
  const navigate = useNavigate();
  const { translate } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [formData, setFormData] = useState<RTIFormData>({
    applicantName: '',
    mailingAddress: '',
    telephone: '',
    email: '',
    isIndianCitizen: true,
    informationNature: 'other',
    informationType: {
      copyDocuments: false,
      inspectRecords: false,
      sampleMaterial: false,
      otherInfo: false
    },
    otherInfoDescription: '',
    relatesToThirdParty: false,
    thirdPartyName: '',
    thirdPartyAddress: '',
    particulars: ['', '', '', '', ''],
    timePeriod: '',
    isBPL: false,
    bplProofAttached: false,
    feePaid: ''
  });

  const formFields = [
    // Contact Details
    { key: 'applicantName', label: 'Name of the Applicant', type: 'text', section: 'contact' },
    { key: 'mailingAddress', label: 'Mailing Address', type: 'textarea', section: 'contact' },
    { key: 'telephone', label: 'Telephone Number', type: 'text', section: 'contact' },
    { key: 'email', label: 'Email Address', type: 'email', section: 'contact' },
    {
      key: 'isIndianCitizen',
      label: 'Whether a citizen of India',
      type: 'radio',
      section: 'contact',
      options: ['Yes', 'No']
    },

    // Information Sought
    {
      key: 'informationNature',
      label: 'Nature of information sought',
      type: 'radio',
      section: 'information',
      options: ['Life & liberty of the person', 'Other than life & liberty']
    },
    {
      key: 'informationType',
      label: 'Type of information required',
      type: 'checkbox',
      section: 'information',
      options: [
        'Copy of documents',
        'Inspection of records',
        'Sample of material',
        'Other information'
      ]
    },
    {
      key: 'otherInfoDescription',
      label: 'Description of other information',
      type: 'textarea',
      section: 'information',
      condition: () => formData.informationType.otherInfo
    },

    // Third Party Info
    {
      key: 'relatesToThirdParty',
      label: 'Whether information sought relates to third party?',
      type: 'radio',
      section: 'thirdParty',
      options: ['Yes', 'No']
    },
    {
      key: 'thirdPartyName',
      label: 'Third party name',
      type: 'text',
      section: 'thirdParty',
      condition: () => formData.relatesToThirdParty
    },
    {
      key: 'thirdPartyAddress',
      label: 'Third party address',
      type: 'textarea',
      section: 'thirdParty',
      condition: () => formData.relatesToThirdParty
    },

    // Information Details
    { key: 'particulars.0', label: 'Particulars of information required (1)', type: 'textarea', section: 'details' },
    { key: 'particulars.1', label: 'Particulars of information required (2)', type: 'textarea', section: 'details' },
    { key: 'particulars.2', label: 'Particulars of information required (3)', type: 'textarea', section: 'details' },
    { key: 'particulars.3', label: 'Particulars of information required (4)', type: 'textarea', section: 'details' },
    { key: 'particulars.4', label: 'Particulars of information required (5)', type: 'textarea', section: 'details' },
    { key: 'timePeriod', label: 'Time period for which information is required', type: 'text', section: 'details' },

    // BPL Category
    {
      key: 'isBPL',
      label: 'Whether applicant belongs to BPL category',
      type: 'radio',
      section: 'bpl',
      options: ['Yes', 'No']
    },
    {
      key: 'bplProofAttached',
      label: 'Proof of BPL attached',
      type: 'radio',
      section: 'bpl',
      options: ['Yes', 'No'],
      condition: () => formData.isBPL
    },

    // Fee Details
    { key: 'feePaid', label: 'Details of fee paid (Rs.)', type: 'text', section: 'fee' }
  ];

  const getVisibleFields = () => {
    return formFields.filter(field => {
      if (field.condition && !field.condition()) return false;
      return true;
    });
  };

  const visibleFields = getVisibleFields();

  const handleInputChange = (key: string, value: string | boolean | string[]) => {
    if (key.includes('.')) {
      const [parent, child] = key.split('.');
      const index = parseInt(child);
      setFormData(prev => ({
        ...prev,
        [parent]: Array.isArray(prev[parent as keyof RTIFormData])
          ? (prev[parent as keyof RTIFormData] as string[]).map((item: string, i: number) =>
            i === index ? value : item
          )
          : prev[parent as keyof RTIFormData]
      }));

    } else if (key === 'informationType') {
      const option = value as string;
      setFormData(prev => ({
        ...prev,
        informationType: {
          ...prev.informationType,
          [option.toLowerCase().replace(/ /g, '')]: !prev.informationType[option.toLowerCase().replace(/ /g, '') as keyof typeof prev.informationType]
        }
      }));
    } else if (key === 'isIndianCitizen' || key === 'relatesToThirdParty' || key === 'isBPL' || key === 'bplProofAttached') {
      setFormData(prev => ({
        ...prev,
        [key]: value === 'Yes'
      }));
    } else if (key === 'informationNature') {
      setFormData(prev => ({
        ...prev,
        informationNature: value === 'Life & liberty of the person' ? 'lifeLiberty' : 'other'
      }));
    } else {
      setFormData(prev => ({ ...prev, [key]: value }));
    }
  };

  const getCurrentValue = (key: string) => {
    if (key.includes('.')) {
      const [parent, child] = key.split('.');
      const index = parseInt(child);
      return formData[parent as keyof RTIFormData][index];
    } else if (key === 'isIndianCitizen' || key === 'relatesToThirdParty' || key === 'isBPL' || key === 'bplProofAttached') {
      return formData[key as keyof RTIFormData] ? 'Yes' : 'No';
    } else if (key === 'informationNature') {
      return formData.informationNature === 'lifeLiberty' ? 'Life & liberty of the person' : 'Other than life & liberty';
    } else if (key === 'informationType') {
      return Object.entries(formData.informationType)
        .filter(([_, val]) => val)
        .map(([key]) => key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()));
    }
    return formData[key as keyof RTIFormData] as string;
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

    if (currentStep < visibleFields.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowPreview(true);
    }
  };

  const prevStep = () => {
    if (showPreview) {
      setShowPreview(false);
      setCurrentStep(visibleFields.length - 1);
    } else if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleEdit = (field: string) => {
    const fieldIndex = visibleFields.findIndex(f => f.key === field);
    if (fieldIndex !== -1) {
      setCurrentStep(fieldIndex);
      setShowPreview(false);
      setEditingField(field);
    }
  };

  const currentField = visibleFields[currentStep];

  if (showPreview) {
    return (
      <RTIPreview
        formData={formData}
        onBack={prevStep}
        onEdit={handleEdit}
      />
    );
  }

  if (!['radio', 'checkbox'].includes(currentField.type)) {
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
              {translate('step.label') || 'Step'} {currentStep + 1} {translate('of.label') || 'of'} {visibleFields.length} - {currentField.section.toUpperCase()} {translate('section.label') || 'SECTION'}
            </p>
            <div className="w-full bg-[#141E28] rounded-full h-2 mt-2">
              <div
                className="bg-[#33FEBF] h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / visibleFields.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        <Card className="shadow-lg border border-[#33FEBF] bg-white">
          <CardHeader className="bg-[#33FEBF] text-[#141E28]">
            <CardTitle className="text-xl text-center">
              {translate('software.name')} - RTI Application
            </CardTitle>
            <p className="text-center text-sm">Right to Information Act, 2005</p>
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

              {currentField.type === 'checkbox' && (
                <div className="space-y-4">
                  {currentField.options?.map((option) => (
                    <label key={option} className="flex items-start space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.informationType[option.toLowerCase().replace(/ /g, '') as keyof typeof formData.informationType]}
                        onChange={() => handleInputChange('informationType', option)}
                        className="w-4 h-4 text-[#33FEBF] mt-1"
                      />
                      <span className="text-[#141E28] text-sm">{option}</span>
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
                  {currentStep === visibleFields.length - 1 ? (translate('button.preview') || 'Preview') : (translate('button.next') || 'Next')}
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

export default RTIForm;