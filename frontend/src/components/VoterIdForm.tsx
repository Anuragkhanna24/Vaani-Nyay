import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import VoiceInput from './VoiceInput';
import VoterIdPreview from './VoterIdPreview';
import { useLanguage } from '@/contexts/LanguageContext';

interface FormData {
  assemblyConstituencyNo: string;
  assemblyConstituencyName: string;
  parliamentaryConstituencyNo: string;
  parliamentaryConstituencyName: string;
  applicantName: string;
  epicNo: string;
  aadhaarNumber: string;
  noAadhaar: boolean;
  mobileNoSelf: string;
  mobileNoRelative: string;
  emailSelf: string;
  emailRelative: string;
  applicationType: string;
  shiftingReason: string;
  presentAddress: {
    houseNo: string;
    streetArea: string;
    ordinary: string;
    townVillage: string;
    postOffice: string;
    residence: string;
    pinCode: string;
    tehsilTaluka: string;
    district: string;
    stateUt: string;
  };
  documentsAvailable: string[];
  otherDocument: string;
  uploadedFiles: File[];

  // Additional sections
  enableCorrectionSection: boolean;
  enableReplacementSection: boolean;
  enableDisabilitySection: boolean;

  correctionFields: {
    name: boolean;
    gender: boolean;
    dobAge: boolean;
    relationType: boolean;
    relationName: boolean;
    address: boolean;
    mobileNumber: boolean;
    photo: boolean;
  };
  correctParticulars: string;
  documentName: string;

  replacementReason: string;
  oldEpicStatus: string;
  epicCondition: {
    lost: boolean;
    destroyed: boolean;
    mutilated: boolean;
  };
  mutilatedDetails: string;

  disabilityCategory: string;
  disabilityType: {
    locomotive: boolean;
    visual: boolean;
    deafDumb: boolean;
    other: boolean;
  };
  otherDisability: string;
  disabilityPercentage: string;
  certificateAttached: boolean;

  // Declaration
  declarationDate: string;
  declarationPlace: string;
  acknowledgeNumber: string;
  acknowledgeDate: string;
}

const VoterIdForm = () => {
  const navigate = useNavigate();
  const { translate } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    assemblyConstituencyNo: '',
    assemblyConstituencyName: '',
    parliamentaryConstituencyNo: '',
    parliamentaryConstituencyName: '',
    applicantName: '',
    epicNo: '',
    aadhaarNumber: '',
    noAadhaar: false,
    mobileNoSelf: '',
    mobileNoRelative: '',
    emailSelf: '',
    emailRelative: '',
    applicationType: '',
    shiftingReason: '',
    presentAddress: {
      houseNo: '',
      streetArea: '',
      ordinary: '',
      townVillage: '',
      postOffice: '',
      residence: '',
      pinCode: '',
      tehsilTaluka: '',
      district: '',
      stateUt: ''
    },
    documentsAvailable: [],
    otherDocument: '',
    uploadedFiles: [],

    enableCorrectionSection: false,
    enableReplacementSection: false,
    enableDisabilitySection: false,

    correctionFields: {
      name: false,
      gender: false,
      dobAge: false,
      relationType: false,
      relationName: false,
      address: false,
      mobileNumber: false,
      photo: false,
    },
    correctParticulars: '',
    documentName: '',

    replacementReason: '',
    oldEpicStatus: '',
    epicCondition: {
      lost: false,
      destroyed: false,
      mutilated: false,
    },
    mutilatedDetails: '',

    disabilityCategory: '',
    disabilityType: {
      locomotive: false,
      visual: false,
      deafDumb: false,
      other: false,
    },
    otherDisability: '',
    disabilityPercentage: '',
    certificateAttached: false,

    declarationDate: '',
    declarationPlace: '',
    acknowledgeNumber: '',
    acknowledgeDate: '',
  });

  // Base form fields with proper labels
  const baseFormFields = [
    { key: 'assemblyConstituencyNo', label: 'Assembly Constituency Number', type: 'text', section: 'constituency' },
    { key: 'assemblyConstituencyName', label: 'Assembly Constituency Name', type: 'text', section: 'constituency' },
    { key: 'parliamentaryConstituencyNo', label: 'Parliamentary Constituency Number', type: 'text', section: 'constituency' },
    { key: 'parliamentaryConstituencyName', label: 'Parliamentary Constituency Name', type: 'text', section: 'constituency' },
    { key: 'applicantName', label: 'Name of the Applicant', type: 'text', section: 'personal' },
    { key: 'epicNo', label: 'EPIC Number', type: 'text', section: 'personal' },
    { key: 'aadhaarNumber', label: 'Aadhaar Number', type: 'text', section: 'personal' },
    { key: 'mobileNoSelf', label: 'Mobile Number of Self', type: 'text', section: 'contact' },
    { key: 'mobileNoRelative', label: 'Mobile Number of Father/Mother/Any other relative', type: 'text', section: 'contact' },
    { key: 'emailSelf', label: 'Email ID of Self', type: 'email', section: 'contact' },
    { key: 'emailRelative', label: 'Email ID of Father/Mother/Any other relative', type: 'email', section: 'contact' },
    {
      key: 'applicationType',
      label: 'I submit application for (Tick any one of the following)',
      type: 'radio',
      section: 'application',
      options: [
        'Shifting of Residence',
        'Correction of Entries in Existing Electoral Roll',
        'Issue of Replacement EPIC without correction',
        'Request for marking as Person with Disability'
      ]
    },
    { key: 'shiftingReason', label: 'Application for Shifting of Residence - Reason', type: 'textarea', section: 'application' },

    // Address fields with proper labels
    { key: 'presentAddress.houseNo', label: 'House/Building/Apartment Number', type: 'text', section: 'address' },
    { key: 'presentAddress.streetArea', label: 'Street/Area/Locality/Mohalla/Road', type: 'text', section: 'address' },
    { key: 'presentAddress.townVillage', label: 'Town/Village', type: 'text', section: 'address' },
    { key: 'presentAddress.postOffice', label: 'Post Office', type: 'text', section: 'address' },
    { key: 'presentAddress.pinCode', label: 'PIN Code', type: 'text', section: 'address' },
    { key: 'presentAddress.tehsilTaluka', label: 'Tehsil/Taluka/Mandal', type: 'text', section: 'address' },
    { key: 'presentAddress.district', label: 'District', type: 'text', section: 'address' },
    { key: 'presentAddress.stateUt', label: 'State/UT', type: 'text', section: 'address' },

    // Documents
    {
      key: 'documentsAvailable',
      label: 'Self-attested copy of address proof (Tick relevant documents)',
      type: 'checkbox',
      section: 'documents',
      options: [
        'Water/Electricity/Gas connection Bill for that address (atleast 1 year)',
        'Current passbook of Nationalised/Scheduled Bank/Post Office',
        'Revenue Department\'s Land Owning records including Kisan Bahi',
        'Registered Rent Lease Deed (In case of tenant)',
        'Aadhaar Card',
        'Indian Passport',
        'Registered Sale Deed (In case of own house)'
      ]
    },
    { key: 'otherDocument', label: 'Any Other Document (Please Specify)', type: 'text', section: 'documents' },
    { key: 'uploadedFiles', label: 'Upload Supporting Documents', type: 'file', section: 'documents' },

    // Additional sections enablement
    { key: 'enableCorrectionSection', label: 'Do you want to fill the Correction of Entries section?', type: 'radio', section: 'additional', options: ['Yes', 'No'] },
    { key: 'enableReplacementSection', label: 'Do you want to fill the Replacement EPIC section?', type: 'radio', section: 'additional', options: ['Yes', 'No'] },
    { key: 'enableDisabilitySection', label: 'Do you want to fill the Disability Marking section?', type: 'radio', section: 'additional', options: ['Yes', 'No'] },
  ];

  // Conditional fields based on enabled sections
  const conditionalFields = [
    // Correction fields (only if enabled)
    ...(formData.enableCorrectionSection ? [
      {
        key: 'correctionFields',
        label: 'Please correct my following details in Electoral Roll/EPIC (Maximum of 4 entries/particulars can be corrected)',
        type: 'checkbox',
        section: 'correction',
        options: ['Name', 'Gender', 'DoB/Age', 'Relation Type', 'Relation Name', 'Address', 'Mobile Number', 'Photo']
      },
      { key: 'correctParticulars', label: 'The correct particulars in the entry to be corrected are as under', type: 'textarea', section: 'correction' },
      { key: 'documentName', label: 'Name of Document in support of above claim attached', type: 'text', section: 'correction' },
    ] : []),

    // Replacement fields (only if enabled)
    ...(formData.enableReplacementSection ? [
      { key: 'replacementReason', label: 'I request that a replacement EPIC may be issued to me due to change in my personal details', type: 'textarea', section: 'replacement' },
      { key: 'oldEpicStatus', label: 'I hereby return my old EPIC', type: 'text', section: 'replacement' },
      {
        key: 'epicCondition',
        label: 'Condition of old EPIC',
        type: 'checkbox',
        section: 'replacement',
        options: ['Lost', 'Destroyed due to reason beyond control like floods, fire, other natural disaster etc.', 'Mutilated']
      },
      { key: 'mutilatedDetails', label: 'If mutilated, provide details', type: 'textarea', section: 'replacement' },
    ] : []),

    // Disability fields (only if enabled)
    ...(formData.enableDisabilitySection ? [
      { key: 'disabilityCategory', label: 'Category of disability (Tick the appropriate box for category of disability)', type: 'text', section: 'disability' },
      {
        key: 'disabilityType',
        label: 'Type of disability',
        type: 'checkbox',
        section: 'disability',
        options: ['Locomotive', 'Visual', 'Deaf & Dumb', 'If any other (Give description)']
      },
      { key: 'otherDisability', label: 'Other disability description', type: 'text', section: 'disability' },
      { key: 'disabilityPercentage', label: 'Percentage of disability %', type: 'text', section: 'disability' },
      {
        key: 'certificateAttached',
        label: 'Certificate attached (Tick the appropriate box)',
        type: 'radio',
        section: 'disability',
        options: ['Yes', 'No']
      },
    ] : []),

    // Declaration fields
    { key: 'declarationDate', label: 'Declaration Date', type: 'text', section: 'declaration' },
    { key: 'declarationPlace', label: 'Declaration Place', type: 'text', section: 'declaration' },
  ];

  const formFields = [...baseFormFields, ...conditionalFields];

  const handleInputChange = (key: string, value: string | boolean | string[] | File[]) => {
    if (key.includes('.')) {
      const [parent, child] = key.split('.');
      if (parent === 'correctionFields' || parent === 'epicCondition' || parent === 'disabilityType') {
        setFormData(prev => ({
          ...prev,
          [parent]: {
            ...prev[parent as keyof FormData] as any,
            [child]: value
          }
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [parent]: {
            ...prev[parent as keyof FormData] as any,
            [child]: value
          }
        }));
      }
    } else {
      // Handle boolean conversion for enable fields
      if (key.startsWith('enable') && typeof value === 'string') {
        value = value === 'Yes';
      }
      if (key === 'certificateAttached' && typeof value === 'string') {
        value = value === 'Yes';
      }
      setFormData(prev => ({ ...prev, [key]: value }));
    }
  };

  const getCurrentValue = (key: string) => {
    if (key.includes('.')) {
      const [parent, child] = key.split('.');
      return (formData[parent as keyof FormData] as any)?.[child] || '';
    }
    return formData[key as keyof FormData] as string || '';
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

  const handleFileUpload = (files: FileList | null) => {
    if (files) {
      const fileArray = Array.from(files);
      handleInputChange('uploadedFiles', [...formData.uploadedFiles, ...fileArray]);
    }
  };

  const currentField = formFields[currentStep];

  if (showPreview) {
    return (
      <VoterIdPreview
        formData={formData}
        onBack={prevStep}
        onEdit={handleEdit}
      />
    );
  }

  // For voice input fields, use full screen
  if (!['radio', 'checkbox', 'file'].includes(currentField.type)) {
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

  // For radio, checkbox, and file fields, use the regular form layout
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
              {translate('button.back') || 'Back to Forms'}
            </Button>
            {/* Home button removed */}
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
              {translate('software.name')} - {translate('forms.voterId')}
            </CardTitle>
            <p className="text-center text-sm">{translate('form.subtitle')}</p>
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
                    <label key={option} className="flex items-center">
                      <input
                        type="radio"
                        name={currentField.key}
                        value={option}
                        checked={getCurrentValue(currentField.key) === option}
                        onChange={(e) => handleInputChange(currentField.key, e.target.value)}
                        className="w-4 h-4"
                      />
                      <span className="ml-2">{option}</span>
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
                        value={option}
                        checked={
                          currentField.key === 'documentsAvailable'
                            ? (formData.documentsAvailable || []).includes(option)
                            : currentField.key === 'correctionFields'
                              ? (formData.correctionFields as any)[option.toLowerCase().replace(/[^a-z]/g, '')]
                              : currentField.key === 'epicCondition'
                                ? (formData.epicCondition as any)[option.toLowerCase().split(' ')[0]]
                                : currentField.key === 'disabilityType'
                                  ? (formData.disabilityType as any)[option.toLowerCase().replace(/[^a-z]/g, '')]
                                  : false
                        }
                        onChange={(e) => {
                          if (currentField.key === 'documentsAvailable') {
                            const currentDocs = formData.documentsAvailable || [];
                            if (e.target.checked) {
                              handleInputChange('documentsAvailable', [...currentDocs, option]);
                            } else {
                              handleInputChange('documentsAvailable', currentDocs.filter(doc => doc !== option));
                            }
                          } else if (currentField.key === 'correctionFields') {
                            const fieldKey = option.toLowerCase().replace(/[^a-z]/g, '');
                            handleInputChange(`correctionFields.${fieldKey}`, e.target.checked);
                          } else if (currentField.key === 'epicCondition') {
                            const conditionKey = option.toLowerCase().split(' ')[0];
                            handleInputChange(`epicCondition.${conditionKey}`, e.target.checked);
                          } else if (currentField.key === 'disabilityType') {
                            const typeKey = option.toLowerCase().replace(/[^a-z]/g, '');
                            handleInputChange(`disabilityType.${typeKey}`, e.target.checked);
                          }
                        }}
                        className="w-4 h-4 text-[#33FEBF] mt-1"
                      />
                      <span className="text-[#141E28] text-sm">{option}</span>
                    </label>
                  ))}
                </div>
              )}

              {currentField.type === 'file' && (
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-[#33FEBF] rounded-lg p-8 text-center">
                    <Upload className="w-12 h-12 text-[#33FEBF] mx-auto mb-4" />
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      onChange={(e) => handleFileUpload(e.target.files)}
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer text-[#33FEBF] hover:underline"
                    >
                      {translate('button.uploadFile')} (PDF, Images, Documents)
                    </label>
                  </div>

                  {formData.uploadedFiles.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-medium text-[#141E28] mb-2">Uploaded Files:</h4>
                      <ul className="space-y-1">
                        {formData.uploadedFiles.map((file, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-center justify-between">
                            <span>{file.name}</span>
                            <button
                              onClick={() => {
                                const newFiles = formData.uploadedFiles.filter((_, i) => i !== index);
                                handleInputChange('uploadedFiles', newFiles);
                              }}
                              className="text-red-500 text-xs hover:underline"
                            >
                              Remove
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
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

export default VoterIdForm;
