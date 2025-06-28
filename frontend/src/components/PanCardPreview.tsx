import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Download, Send } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import CharacterBoxes from './CharacterBoxes';
import { generatePanCardPDF } from '@/services/pdfService';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';

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

interface PanCardPreviewProps {
  formData: FormData;
  onBack: () => void;
  onEdit: (field: string) => void;
}

const PanCardPreview = ({ formData, onBack, onEdit }: PanCardPreviewProps) => {
  const { translate, selectedLanguage } = useLanguage();
  const navigate = useNavigate();

  const handleAadhaarESign = () => {
    navigate('/aadhaar-esign');
  };

  const handleDownload = async () => {
    try {
      await generatePanCardPDF(formData, selectedLanguage);
      toast({
        title: translate('toast.downloadStarted') || "Download Started",
        description: translate('toast.downloadDescription') || "Your PAN card application form is being downloaded as PDF.",
      });
    } catch (error) {
      toast({
        title: translate('toast.downloadFailed') || "Download Failed",
        description: translate('toast.downloadError') || "There was an error generating the PDF. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getFullAddress = (address: any) => {
    return [
      address.flatNo,
      address.buildingName,
      address.roadStreet,
      address.area,
      address.townCity,
      address.state,
      address.pinCode,
      address.country
    ].filter(Boolean).join(', ');
  };

  return (
    <div className="min-h-screen bg-[#141E28] p-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={onBack}
            className="mb-4 border-[#33FEBF] text-[#33FEBF] hover:bg-[#33FEBF] hover:text-[#141E28]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {translate('button.back')}
          </Button>
        </div>

        <Card className="shadow-lg border border-[#33FEBF] bg-white">
          <CardHeader className="bg-white border-b border-black">
            <div className="text-center space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-16 h-16 border border-black bg-white flex items-center justify-center">
                  <img src="/lovable-uploads/482dfa6a-6a70-440d-94e0-ce7e8009abda.png" alt="Income Tax Department Logo" className="w-12 h-12" />
                </div>
                <div className="flex-1 text-center">
                  <CardTitle className="text-lg font-bold">
                    APPLICATION FOR ALLOTMENT OF PERMANENT ACCOUNT NUMBER (PAN)
                  </CardTitle>
                  <p className="text-sm font-medium">Form 49A</p>
                  <p className="text-xs">[Under section 139A of the Income Tax Act, 1961 and Rule 114 of the Income Tax Rules, 1962]</p>
                </div>
                <div className="text-right">
                  <p className="text-sm">Application No.</p>
                  <div className="border border-black w-20 h-8 mt-1"></div>
                  <p className="text-xs mt-1">(For official use only)</p>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-6 bg-white">
            {/* Personal Details Section */}
            <div className="border border-black">
              <div className="bg-gray-100 p-2 text-sm font-medium">1. APPLICANT DETAILS</div>
              <div className="p-4 space-y-4">
                <div>
                  <span className="text-sm font-medium">Name of the Applicant</span>
                  <div className="grid grid-cols-4 gap-4 mt-2">
                    <div>
                      <span className="text-xs">Title</span>
                      <CharacterBoxes text={formData.title} maxLength={4} onEdit={() => onEdit('title')} />
                    </div>
                    <div>
                      <span className="text-xs">Last Name/Surname</span>
                      <CharacterBoxes text={formData.lastName} maxLength={20} onEdit={() => onEdit('lastName')} />
                    </div>
                    <div>
                      <span className="text-xs">First Name</span>
                      <CharacterBoxes text={formData.firstName} maxLength={20} onEdit={() => onEdit('firstName')} />
                    </div>
                    <div>
                      <span className="text-xs">Middle Name</span>
                      <CharacterBoxes text={formData.middleName} maxLength={20} onEdit={() => onEdit('middleName')} />
                    </div>
                  </div>
                </div>

                <div>
                  <span className="text-sm font-medium">Name as you want it to appear on PAN card</span>
                  <div className="mt-2">
                    <CharacterBoxes text={formData.nameToAppear} maxLength={50} onEdit={() => onEdit('nameToAppear')} />
                  </div>
                </div>

                <div>
                  <span className="text-sm font-medium">Father's Name</span>
                  <div className="grid grid-cols-4 gap-4 mt-2">
                    <div>
                      <span className="text-xs">Title</span>
                      <CharacterBoxes text={formData.fatherTitle} maxLength={8} onEdit={() => onEdit('fatherTitle')} />
                    </div>
                    <div>
                      <span className="text-xs">Last Name/Surname</span>
                      <CharacterBoxes text={formData.fatherLastName} maxLength={20} onEdit={() => onEdit('fatherLastName')} />
                    </div>
                    <div>
                      <span className="text-xs">First Name</span>
                      <CharacterBoxes text={formData.fatherFirstName} maxLength={20} onEdit={() => onEdit('fatherFirstName')} />
                    </div>
                    <div>
                      <span className="text-xs">Middle Name</span>
                      <CharacterBoxes text={formData.fatherMiddleName} maxLength={20} onEdit={() => onEdit('fatherMiddleName')} />
                    </div>
                  </div>
                </div>

                <div>
                  <span className="text-sm font-medium">Mother's Name</span>
                  <div className="grid grid-cols-4 gap-4 mt-2">
                    <div>
                      <span className="text-xs">Title</span>
                      <CharacterBoxes text={formData.motherTitle} maxLength={8} onEdit={() => onEdit('motherTitle')} />
                    </div>
                    <div>
                      <span className="text-xs">Last Name/Surname</span>
                      <CharacterBoxes text={formData.motherLastName} maxLength={20} onEdit={() => onEdit('motherLastName')} />
                    </div>
                    <div>
                      <span className="text-xs">First Name</span>
                      <CharacterBoxes text={formData.motherFirstName} maxLength={20} onEdit={() => onEdit('motherFirstName')} />
                    </div>
                    <div>
                      <span className="text-xs">Middle Name</span>
                      <CharacterBoxes text={formData.motherMiddleName} maxLength={20} onEdit={() => onEdit('motherMiddleName')} />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium">Date of Birth</span>
                    <div className="mt-2">
                      <CharacterBoxes text={formData.dateOfBirth} maxLength={10} onEdit={() => onEdit('dateOfBirth')} />
                    </div>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Gender</span>
                    <div className="mt-2 space-x-4">
                      <label className="inline-flex items-center">
                        <input type="radio" checked={formData.gender === 'Male'} readOnly className="mr-1" />
                        <span className="text-sm">Male</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input type="radio" checked={formData.gender === 'Female'} readOnly className="mr-1" />
                        <span className="text-sm">Female</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input type="radio" checked={formData.gender === 'Transgender'} readOnly className="mr-1" />
                        <span className="text-sm">Transgender</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Address Section */}
            <div className="border border-black">
              <div className="bg-gray-100 p-2 text-sm font-medium">2. ADDRESS DETAILS</div>
              <div className="p-4 space-y-4">
                <div>
                  <span className="text-sm font-medium">Residential Address</span>
                  <div className="mt-2 space-y-2">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-xs">Flat/Door/Block No.</span>
                        <CharacterBoxes text={formData.residentialAddress.flatNo} maxLength={15} onEdit={() => onEdit('residentialAddress.flatNo')} />
                      </div>
                      <div>
                        <span className="text-xs">Name of Premises/Building/Village</span>
                        <CharacterBoxes text={formData.residentialAddress.buildingName} maxLength={25} onEdit={() => onEdit('residentialAddress.buildingName')} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-xs">Road/Street/Lane/Post Office</span>
                        <CharacterBoxes text={formData.residentialAddress.roadStreet} maxLength={25} onEdit={() => onEdit('residentialAddress.roadStreet')} />
                      </div>
                      <div>
                        <span className="text-xs">Area/Locality/Taluka/Sub-Division</span>
                        <CharacterBoxes text={formData.residentialAddress.area} maxLength={25} onEdit={() => onEdit('residentialAddress.area')} />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <span className="text-xs">Town/City/District</span>
                        <CharacterBoxes text={formData.residentialAddress.townCity} maxLength={20} onEdit={() => onEdit('residentialAddress.townCity')} />
                      </div>
                      <div>
                        <span className="text-xs">State/Union Territory</span>
                        <CharacterBoxes text={formData.residentialAddress.state} maxLength={20} onEdit={() => onEdit('residentialAddress.state')} />
                      </div>
                      <div>
                        <span className="text-xs">PIN Code</span>
                        <CharacterBoxes text={formData.residentialAddress.pinCode} maxLength={6} onEdit={() => onEdit('residentialAddress.pinCode')} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-xs">Country</span>
                        <CharacterBoxes text={formData.residentialAddress.country} maxLength={15} onEdit={() => onEdit('residentialAddress.country')} />
                      </div>
                      <div>
                        <span className="text-xs">Phone Number</span>
                        <CharacterBoxes text={formData.residentialAddress.phone} maxLength={15} onEdit={() => onEdit('residentialAddress.phone')} />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <input
                      type="checkbox"
                      checked={formData.communicationAddress.sameAsResidential}
                      readOnly
                    />
                    <span className="text-sm">Communication address same as residential address</span>
                  </div>

                  {!formData.communicationAddress.sameAsResidential && (
                    <div>
                      <span className="text-sm font-medium">Communication Address</span>
                      <div className="mt-2 text-sm">
                        <div className="border-b border-gray-300 pb-1">
                          {getFullAddress(formData.communicationAddress)}
                          <button onClick={() => onEdit('communicationAddress.flatNo')} className="ml-2 text-[#33FEBF] text-xs underline">
                            Edit
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Details Section */}
            <div className="border border-black">
              <div className="bg-gray-100 p-2 text-sm font-medium">3. CONTACT DETAILS</div>
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium">Email Address</span>
                    <div className="mt-1 border-b border-black pb-1">
                      <span className="text-sm">{formData.email}</span>
                      {formData.email && (
                        <button onClick={() => onEdit('email')} className="ml-2 text-[#33FEBF] text-xs underline">
                          Edit
                        </button>
                      )}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Mobile Number</span>
                    <div className="mt-2">
                      <CharacterBoxes text={formData.mobile} maxLength={10} onEdit={() => onEdit('mobile')} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Application Details Section */}
            <div className="border border-black">
              <div className="bg-gray-100 p-2 text-sm font-medium">4. APPLICATION DETAILS</div>
              <div className="p-4 space-y-4">
                <div>
                  <span className="text-sm font-medium">Status of Applicant: </span>
                  <span className="text-sm">{formData.applicantStatus}</span>
                  <button onClick={() => onEdit('applicantStatus')} className="ml-2 text-[#33FEBF] text-xs underline">
                    Edit
                  </button>
                </div>

                <div>
                  <span className="text-sm font-medium">Source of Income:</span>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {[
                      'Salary',
                      'House Property',
                      'Business/Profession',
                      'Capital Gains',
                      'Other Sources',
                      'Income from abroad',
                      'No Income'
                    ].map((source) => (
                      <label key={source} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formData.sourceOfIncome?.includes(source)}
                          readOnly
                        />
                        <span className="text-xs">{source}</span>
                      </label>
                    ))}
                  </div>
                  <button onClick={() => onEdit('sourceOfIncome')} className="mt-2 text-[#33FEBF] text-xs underline">
                    Edit
                  </button>
                </div>
              </div>
            </div>

            {/* Document Proofs Section */}
            <div className="border border-black">
              <div className="bg-gray-100 p-2 text-sm font-medium">5. DOCUMENT PROOFS</div>
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <span className="text-sm font-medium">Identity Proof</span>
                    <div className="mt-1 text-sm">{formData.identityProof}</div>
                    <button onClick={() => onEdit('identityProof')} className="text-[#33FEBF] text-xs underline">
                      Edit
                    </button>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Address Proof</span>
                    <div className="mt-1 text-sm">{formData.addressProof}</div>
                    <button onClick={() => onEdit('addressProof')} className="text-[#33FEBF] text-xs underline">
                      Edit
                    </button>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Date of Birth Proof</span>
                    <div className="mt-1 text-sm">{formData.dateOfBirthProof}</div>
                    <button onClick={() => onEdit('dateOfBirthProof')} className="text-[#33FEBF] text-xs underline">
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Uploaded Files Section */}
            {formData.uploadedFiles && formData.uploadedFiles.length > 0 && (
              <div className="border border-black">
                <div className="bg-gray-100 p-2 text-sm font-medium">6. UPLOADED DOCUMENTS</div>
                <div className="p-4">
                  <div className="space-y-2">
                    {formData.uploadedFiles.map((file, index) => (
                      <div key={index} className="text-sm text-gray-600 flex items-center justify-between bg-gray-50 p-2 rounded">
                        <span>{file.name}</span>
                        <span className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Declaration Section */}
            <div className="border border-black">
              <div className="bg-gray-100 p-2 text-sm font-medium">7. DECLARATION</div>
              <div className="p-4">
                <div className="text-sm mb-4">
                  I, the applicant, declare that what is stated above is true to the best of my knowledge and belief.
                  I understand that if any information given in this application is found to be false,
                  I may be prosecuted under the Income Tax Act, 1961.
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-sm">Place: </span>
                    <span className="text-sm">{formData.declarationPlace || '_______'}</span>
                    {formData.declarationPlace && (
                      <button onClick={() => onEdit('declarationPlace')} className="ml-2 text-[#33FEBF] text-xs underline">
                        Edit
                      </button>
                    )}
                  </div>
                  <div>
                    <span className="text-sm">Date: </span>
                    <span className="text-sm">{formData.declarationDate || '_______'}</span>
                    {formData.declarationDate && (
                      <button onClick={() => onEdit('declarationDate')} className="ml-2 text-[#33FEBF] text-xs underline">
                        Edit
                      </button>
                    )}
                  </div>
                  <div className="text-sm">Signature of Applicant</div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4 pt-6 border-t">
              <Button
                variant="outline"
                onClick={handleDownload}
                className="border-[#33FEBF] text-[#33FEBF] hover:bg-[#33FEBF] hover:text-[#141E28]"
              >
                <Download className="w-4 h-4 mr-2" />
                {translate('button.download')}
              </Button>
              <Button
                onClick={handleAadhaarESign}
                className="bg-[#33FEBF] hover:bg-[#33FEBF]/90 text-[#141E28]"
              >
                <Send className="w-4 h-4 mr-2" />
                {translate('button.aadhaarESign') !== 'button.aadhaarESign'
                  ? translate('button.aadhaarESign')
                  : 'Aadhaar e-Sign'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PanCardPreview;