import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import VoiceInput from './VoiceInput';
import PanCardPreview from './PanCardPreview';
import { useLanguage } from '@/contexts/LanguageContext';

interface FormData {
  // Personal Details
  title: string;
  lastName: string;
  firstName: string;
  middleName: string;
  nameToAppear: string;
  fatherTitle: string;
  fatherLastName: string;
  fatherFirstName: string;
  fatherMiddleName: string;
  motherTitle: string;
  motherLastName: string;
  motherFirstName: string;
  motherMiddleName: string;
  dateOfBirth: string;
  gender: string;

  // Address Details
  residentialAddress: {
    flatNo: string;
    buildingName: string;
    roadStreet: string;
    area: string;
    townCity: string;
    state: string;
    pinCode: string;
    country: string;
    phone: string;
  };

  communicationAddress: {
    sameAsResidential: boolean;
    flatNo: string;
    buildingName: string;
    roadStreet: string;
    area: string;
    townCity: string;
    state: string;
    pinCode: string;
    country: string;
    phone: string;
  };

  // Contact Details
  email: string;
  mobile: string;

  // Identity and Address Proof
  identityProof: string;
  addressProof: string;
  dateOfBirthProof: string;

  // Application Details
  applicantStatus: string;
  sourceOfIncome: string[];
  representativeAssessee: string;

  // For Minors/Representatives
  representativeName: string;
  representativeCapacity: string;
  representativePan: string;

  // Declaration
  declarationPlace: string;
  declarationDate: string;

  // File uploads
  uploadedFiles: File[];

  // Example functionality
  useExample: boolean;
}

const PanCardForm = () => {
  const navigate = useNavigate();
  const { translate } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    // Personal Details
    title: '',
    lastName: '',
    firstName: '',
    middleName: '',
    nameToAppear: '',
    fatherTitle: '',
    fatherLastName: '',
    fatherFirstName: '',
    fatherMiddleName: '',
    motherTitle: '',
    motherLastName: '',
    motherFirstName: '',
    motherMiddleName: '',
    dateOfBirth: '',
    gender: '',

    // Address Details
    residentialAddress: {
      flatNo: '',
      buildingName: '',
      roadStreet: '',
      area: '',
      townCity: '',
      state: '',
      pinCode: '',
      country: 'India',
      phone: '',
    },

    communicationAddress: {
      sameAsResidential: false,
      flatNo: '',
      buildingName: '',
      roadStreet: '',
      area: '',
      townCity: '',
      state: '',
      pinCode: '',
      country: 'India',
      phone: '',
    },

    // Contact Details
    email: '',
    mobile: '',

    // Identity and Address Proof
    identityProof: '',
    addressProof: '',
    dateOfBirthProof: '',

    // Application Details
    applicantStatus: '',
    sourceOfIncome: [],
    representativeAssessee: '',

    // For Minors/Representatives
    representativeName: '',
    representativeCapacity: '',
    representativePan: '',

    // Declaration
    declarationPlace: '',
    declarationDate: '',

    // File uploads
    uploadedFiles: [],

    // Example functionality
    useExample: false,
  });

  // Example data for demonstration
  const exampleData: Partial<FormData> = {
    title: 'Mr',
    lastName: 'Sharma',
    firstName: 'Rajesh',
    middleName: 'Kumar',
    nameToAppear: 'RAJESH KUMAR SHARMA',
    fatherTitle: 'Mr',
    fatherLastName: 'Sharma',
    fatherFirstName: 'Ramesh',
    fatherMiddleName: 'Chandra',
    motherTitle: 'Mrs',
    motherLastName: 'Sharma',
    motherFirstName: 'Sunita',
    motherMiddleName: 'Devi',
    dateOfBirth: '15/07/1985',
    gender: 'Male',
    residentialAddress: {
      flatNo: '123',
      buildingName: 'Shree Apartment',
      roadStreet: 'MG Road',
      area: 'Central Delhi',
      townCity: 'New Delhi',
      state: 'Delhi',
      pinCode: '110001',
      country: 'India',
      phone: '011-25123456',
    },
    email: 'rajesh.sharma@email.com',
    mobile: '9876543210',
    applicantStatus: 'Individual',
    sourceOfIncome: ['Salary', 'Other Sources'],
    identityProof: 'Aadhaar Card',
    addressProof: 'Electricity Bill',
    dateOfBirthProof: 'Birth Certificate',
    declarationPlace: 'New Delhi',
    declarationDate: new Date().toLocaleDateString('en-GB'),
  };

  // Form field definitions
  const formFields = [
    // Example option
    {
      key: 'useExample',
      label: 'Would you like to use example data to see how the form works?',
      type: 'radio',
      section: 'example',
      options: ['Yes', 'No']
    },

    // Personal Details
    {
      key: 'title',
      label: 'Title (Mr/Mrs/Ms)',
      type: 'radio',
      section: 'personal',
      options: ['Mr', 'Mrs', 'Ms', 'Dr']
    },
    { key: 'lastName', label: 'Last Name/Surname', type: 'text', section: 'personal' },
    { key: 'firstName', label: 'First Name', type: 'text', section: 'personal' },
    { key: 'middleName', label: 'Middle Name', type: 'text', section: 'personal' },
    { key: 'nameToAppear', label: 'Name as you want it to appear on PAN card (in CAPITAL LETTERS)', type: 'text', section: 'personal' },

    // Father's Details
    {
      key: 'fatherTitle',
      label: 'Father\'s Title',
      type: 'radio',
      section: 'family',
      options: ['Mr', 'Late Mr', 'Dr', 'Late Dr']
    },
    { key: 'fatherLastName', label: 'Father\'s Last Name/Surname', type: 'text', section: 'family' },
    { key: 'fatherFirstName', label: 'Father\'s First Name', type: 'text', section: 'family' },
    { key: 'fatherMiddleName', label: 'Father\'s Middle Name', type: 'text', section: 'family' },

    // Mother's Details
    {
      key: 'motherTitle',
      label: 'Mother\'s Title',
      type: 'radio',
      section: 'family',
      options: ['Mrs', 'Late Mrs', 'Ms', 'Late Ms', 'Dr', 'Late Dr']
    },
    { key: 'motherLastName', label: 'Mother\'s Last Name/Surname', type: 'text', section: 'family' },
    { key: 'motherFirstName', label: 'Mother\'s First Name', type: 'text', section: 'family' },
    { key: 'motherMiddleName', label: 'Mother\'s Middle Name', type: 'text', section: 'family' },

    // Birth Details
    { key: 'dateOfBirth', label: 'Date of Birth (DD/MM/YYYY)', type: 'text', section: 'personal' },
    {
      key: 'gender',
      label: 'Gender',
      type: 'radio',
      section: 'personal',
      options: ['Male', 'Female', 'Transgender']
    },

    // Residential Address
    { key: 'residentialAddress.flatNo', label: 'Flat/Door/Block No.', type: 'text', section: 'address' },
    { key: 'residentialAddress.buildingName', label: 'Name of Premises/Building/Village', type: 'text', section: 'address' },
    { key: 'residentialAddress.roadStreet', label: 'Road/Street/Lane/Post Office', type: 'text', section: 'address' },
    { key: 'residentialAddress.area', label: 'Area/Locality/Taluka/Sub-Division', type: 'text', section: 'address' },
    { key: 'residentialAddress.townCity', label: 'Town/City/District', type: 'text', section: 'address' },
    { key: 'residentialAddress.state', label: 'State/Union Territory', type: 'text', section: 'address' },
    { key: 'residentialAddress.pinCode', label: 'PIN Code', type: 'text', section: 'address' },
    { key: 'residentialAddress.country', label: 'Country', type: 'text', section: 'address' },
    { key: 'residentialAddress.phone', label: 'Residential Phone Number', type: 'text', section: 'address' },

    // Communication Address
    {
      key: 'communicationAddress.sameAsResidential',
      label: 'Is communication address same as residential address?',
      type: 'radio',
      section: 'address',
      options: ['Yes', 'No']
    },

    // Communication Address fields (conditional)
    { key: 'communicationAddress.flatNo', label: 'Communication Address - Flat/Door/Block No.', type: 'text', section: 'address' },
    { key: 'communicationAddress.buildingName', label: 'Communication Address - Name of Premises/Building/Village', type: 'text', section: 'address' },
    { key: 'communicationAddress.roadStreet', label: 'Communication Address - Road/Street/Lane/Post Office', type: 'text', section: 'address' },
    { key: 'communicationAddress.area', label: 'Communication Address - Area/Locality/Taluka/Sub-Division', type: 'text', section: 'address' },
    { key: 'communicationAddress.townCity', label: 'Communication Address - Town/City/District', type: 'text', section: 'address' },
    { key: 'communicationAddress.state', label: 'Communication Address - State/Union Territory', type: 'text', section: 'address' },
    { key: 'communicationAddress.pinCode', label: 'Communication Address - PIN Code', type: 'text', section: 'address' },
    { key: 'communicationAddress.country', label: 'Communication Address - Country', type: 'text', section: 'address' },
    { key: 'communicationAddress.phone', label: 'Communication Address - Phone Number', type: 'text', section: 'address' },

    // Contact Details
    { key: 'email', label: 'Email Address', type: 'email', section: 'contact' },
    { key: 'mobile', label: 'Mobile Number', type: 'text', section: 'contact' },

    // Application Details
    {
      key: 'applicantStatus',
      label: 'Status of Applicant',
      type: 'radio',
      section: 'application',
      options: ['Individual', 'Company', 'HUF (Hindu Undivided Family)', 'Partnership Firm', 'Trust', 'Others']
    },

    {
      key: 'sourceOfIncome',
      label: 'Source of Income (Tick all applicable)',
      type: 'checkbox',
      section: 'application',
      options: [
        'Salary',
        'House Property',
        'Business/Profession',
        'Capital Gains',
        'Other Sources',
        'Income from abroad',
        'No Income'
      ]
    },

    // Document Proofs
    {
      key: 'identityProof',
      label: 'Identity Proof',
      type: 'radio',
      section: 'documents',
      options: [
        'Aadhaar Card',
        'Voter ID Card',
        'Driving License',
        'Passport',
        'Bank Account Statement',
        'Credit Card Statement',
        'Demat Account Statement'
      ]
    },

    {
      key: 'addressProof',
      label: 'Address Proof',
      type: 'radio',
      section: 'documents',
      options: [
        'Aadhaar Card',
        'Electricity Bill',
        'Telephone Bill',
        'Bank Statement',
        'Passport',
        'Voter ID Card',
        'Driving License',
        'Ration Card'
      ]
    },

    {
      key: 'dateOfBirthProof',
      label: 'Date of Birth Proof',
      type: 'radio',
      section: 'documents',
      options: [
        'Birth Certificate',
        'SSLC/Matriculation Certificate',
        'Passport',
        'Aadhaar Card',
        'Driving License'
      ]
    },

    // File Upload
    { key: 'uploadedFiles', label: 'Upload Supporting Documents', type: 'file', section: 'documents' },

    // Declaration
    { key: 'declarationPlace', label: 'Place of Declaration', type: 'text', section: 'declaration' },
    { key: 'declarationDate', label: 'Date of Declaration (DD/MM/YYYY)', type: 'text', section: 'declaration' },
  ];

  // Filter fields based on conditions
  const getVisibleFields = () => {
    let visibleFields = [...formFields];

    // If communication address is same as residential, hide communication address fields
    if (formData.communicationAddress.sameAsResidential) {
      visibleFields = visibleFields.filter(field =>
        !field.key.startsWith('communicationAddress.') ||
        field.key === 'communicationAddress.sameAsResidential'
      );
    }

    return visibleFields;
  };

  const visibleFields = getVisibleFields();

  const handleInputChange = (key: string, value: string | boolean | string[] | File[]) => {
    if (key.includes('.')) {
      const [parent, child] = key.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof FormData] as any,
          [child]: value
        }
      }));
    } else {
      // Handle boolean conversion for communication address
      if (key === 'communicationAddress.sameAsResidential' && typeof value === 'string') {
        const boolValue = value === 'Yes';
        setFormData(prev => ({
          ...prev,
          communicationAddress: {
            ...prev.communicationAddress,
            sameAsResidential: boolValue,
            // Copy residential address if same
            ...(boolValue ? {
              flatNo: prev.residentialAddress.flatNo,
              buildingName: prev.residentialAddress.buildingName,
              roadStreet: prev.residentialAddress.roadStreet,
              area: prev.residentialAddress.area,
              townCity: prev.residentialAddress.townCity,
              state: prev.residentialAddress.state,
              pinCode: prev.residentialAddress.pinCode,
              country: prev.residentialAddress.country,
              phone: prev.residentialAddress.phone,
            } : {})
          }
        }));
        return;
      }

      // Handle useExample
      if (key === 'useExample' && typeof value === 'string') {
        const useEx = value === 'Yes';
        setFormData(prev => ({
          ...prev,
          useExample: useEx,
          ...(useEx ? exampleData : {
            // Reset all fields to empty if "No" is selected
            title: '',
            lastName: '',
            firstName: '',
            middleName: '',
            nameToAppear: '',
            fatherTitle: '',
            fatherLastName: '',
            fatherFirstName: '',
            fatherMiddleName: '',
            motherTitle: '',
            motherLastName: '',
            motherFirstName: '',
            motherMiddleName: '',
            dateOfBirth: '',
            gender: '',
            residentialAddress: {
              flatNo: '',
              buildingName: '',
              roadStreet: '',
              area: '',
              townCity: '',
              state: '',
              pinCode: '',
              country: 'India',
              phone: '',
            },
            communicationAddress: {
              sameAsResidential: false,
              flatNo: '',
              buildingName: '',
              roadStreet: '',
              area: '',
              townCity: '',
              state: '',
              pinCode: '',
              country: 'India',
              phone: '',
            },
            email: '',
            mobile: '',
            identityProof: '',
            addressProof: '',
            dateOfBirthProof: '',
            applicantStatus: '',
            sourceOfIncome: [],
            representativeAssessee: '',
            representativeName: '',
            representativeCapacity: '',
            representativePan: '',
            declarationPlace: '',
            declarationDate: '',
            uploadedFiles: [],
          })
        }));
        return;
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

  const handleFileUpload = (files: FileList | null) => {
    if (files) {
      const fileArray = Array.from(files);
      handleInputChange('uploadedFiles', [...formData.uploadedFiles, ...fileArray]);
    }
  };

  const currentField = visibleFields[currentStep];

  if (showPreview) {
    return (
      <PanCardPreview
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
              {translate('software.name')} - PAN Card Application
            </CardTitle>
            <p className="text-center text-sm">Form 49A - Application for Allotment of Permanent Account Number (PAN)</p>
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
                        className="w-4 h-4 text-[#33FEBF]"
                      />
                      <span className="ml-2 text-[#141E28]">{option}</span>
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
                        checked={(formData.sourceOfIncome || []).includes(option)}
                        onChange={(e) => {
                          const currentSources = formData.sourceOfIncome || [];
                          if (e.target.checked) {
                            handleInputChange('sourceOfIncome', [...currentSources, option]);
                          } else {
                            handleInputChange('sourceOfIncome', currentSources.filter(s => s !== option));
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

export default PanCardForm;