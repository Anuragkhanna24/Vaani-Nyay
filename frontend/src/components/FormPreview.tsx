import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Download, Send } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import CharacterBoxes from './CharacterBoxes';

interface FormData {
  branchName: string;
  branchCode: string;
  customerId: string;
  accountNo: string;
  ckyc: string;
  applicationType: string;
  name: string;
  maidenName: string;
  dateOfBirth: string;
  gender: string;
  maritalStatus: string;
  dependents: string;
  fatherName: string;
  motherName: string;
  spouseName: string;
  guardianName: string;
  guardianRelation: string;
  nationality: string;
  citizenship: string;
}

interface FormPreviewProps {
  formData: FormData;
  onBack: () => void;
  onEdit: (field: string) => void;
}

const FormPreview = ({ formData, onBack, onEdit }: FormPreviewProps) => {
  const handleSubmit = () => {
    toast({
      title: "Form Submitted Successfully!",
      description: "Your bank account opening form has been submitted for processing.",
    });
  };

  const handleDownload = () => {
    toast({
      title: "Download Started",
      description: "Your form is being downloaded as PDF.",
    });
  };

  return (
    <div className="min-h-screen bg-[#141E28] p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={onBack}
            className="mb-4 border-[#33FEBF] text-[#33FEBF] hover:bg-[#33FEBF] hover:text-[#141E28]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Form
          </Button>
        </div>

        <Card className="shadow-lg border border-[#33FEBF] bg-white">
          <CardHeader className="bg-[#33FEBF] text-[#141E28]">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <img
                  src="/lovable-uploads/d3aeee09-31ae-4fd2-b005-ed8ee73cb35a.png"
                  alt="SBI Logo"
                  className="h-12 w-12 bg-white rounded p-1"
                />
                <div>
                  <CardTitle className="text-xl">
                    ACCOUNT OPENING FORM FOR RESIDENT INDIVIDUAL (PART - I)
                  </CardTitle>
                  <p className="text-[#141E28]/80 text-sm">
                    (Must accompanied with Terms and Conditions)
                  </p>
                  <p className="text-[#141E28]/80 text-sm">
                    CUSTOMER INFORMATION SHEET (CIF Creation/Amendment)
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm">Date:</p>
                <div className="grid grid-cols-3 gap-1 mt-1">
                  {Array.from({ length: 9 }, (_, i) => (
                    <div key={i} className="w-6 h-6 border border-[#141E28] bg-white/20"></div>
                  ))}
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-8 space-y-6 bg-white">
            {/* Header Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b pb-6">
              <div>
                <h3 className="font-semibold text-[#141E28] mb-3">Branch Information</h3>
                <div className="space-y-4">
                  <div>
                    <span className="block text-sm font-medium mb-2">Branch Name:</span>
                    <CharacterBoxes
                      text={formData.branchName || ''}
                      maxLength={25}
                      onEdit={() => onEdit('branchName')}
                    />
                  </div>
                  <div>
                    <span className="block text-sm font-medium mb-2">Branch Code:</span>
                    <CharacterBoxes
                      text={formData.branchCode || ''}
                      maxLength={10}
                      onEdit={() => onEdit('branchCode')}
                    />
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-[#141E28] mb-3">Application Details</h3>
                <div className="space-y-4">
                  <div>
                    <span className="block text-sm font-medium mb-2">Customer ID:</span>
                    <CharacterBoxes
                      text={formData.customerId || ''}
                      maxLength={15}
                      onEdit={() => onEdit('customerId')}
                    />
                  </div>
                  <div>
                    <span className="block text-sm font-medium mb-2">CKYC No:</span>
                    <CharacterBoxes
                      text={formData.ckyc || ''}
                      maxLength={14}
                      onEdit={() => onEdit('ckyc')}
                    />
                  </div>
                  <div>
                    <span className="block text-sm font-medium mb-2">Application Type:</span>
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          checked={formData.applicationType === 'New'}
                          readOnly
                          className="text-[#33FEBF]"
                        />
                        <span className="text-sm">New</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          checked={formData.applicationType === 'Amendment'}
                          readOnly
                          className="text-[#33FEBF]"
                        />
                        <span className="text-sm">Amendment</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Personal Details */}
            <div>
              <h3 className="font-semibold text-[#141E28] mb-4 text-lg bg-[#33FEBF]/20 p-3 rounded">
                A Personal Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <span className="block text-sm font-medium text-[#141E28] mb-2">1. Name:</span>
                    <CharacterBoxes
                      text={formData.name || ''}
                      maxLength={30}
                      onEdit={() => onEdit('name')}
                    />
                  </div>
                  <div>
                    <span className="block text-sm font-medium text-[#141E28] mb-2">2. Maiden Name:</span>
                    <CharacterBoxes
                      text={formData.maidenName || ''}
                      maxLength={25}
                      onEdit={() => onEdit('maidenName')}
                    />
                  </div>
                  <div>
                    <span className="block text-sm font-medium text-[#141E28] mb-2">3. Date of Birth:</span>
                    <CharacterBoxes
                      text={formData.dateOfBirth || ''}
                      maxLength={10}
                      onEdit={() => onEdit('dateOfBirth')}
                    />
                  </div>
                  <div>
                    <span className="block text-sm font-medium text-[#141E28] mb-2">4. Gender:</span>
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="preview-gender"
                          value="Male"
                          checked={formData.gender === 'Male'}
                          readOnly
                          className="w-4 h-4"
                        />
                        <span className="ml-2">Male</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="preview-gender"
                          value="Female"
                          checked={formData.gender === 'Female'}
                          readOnly
                          className="w-4 h-4"
                        />
                        <span className="ml-2">Female</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          checked={formData.gender === 'Third Gender'}
                          readOnly
                          className="text-[#33FEBF]"
                        />
                        <span className="text-sm">Third Gender</span>
                      </label>
                    </div>
                  </div>
                  <div>
                    <span className="block text-sm font-medium text-[#141E28] mb-2">5. Marital Status:</span>
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          checked={formData.maritalStatus === 'Married'}
                          readOnly
                          className="text-[#33FEBF]"
                        />
                        <span className="text-sm">Married</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          checked={formData.maritalStatus === 'Unmarried'}
                          readOnly
                          className="text-[#33FEBF]"
                        />
                        <span className="text-sm">Unmarried</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <span className="block text-sm font-medium text-[#141E28] mb-2">6. No of Dependents:</span>
                    <CharacterBoxes
                      text={formData.dependents || ''}
                      maxLength={2}
                      onEdit={() => onEdit('dependents')}
                    />
                  </div>
                  <div>
                    <span className="block text-sm font-medium text-[#141E28] mb-2">7. Father's Name:</span>
                    <CharacterBoxes
                      text={formData.fatherName || ''}
                      maxLength={30}
                      onEdit={() => onEdit('fatherName')}
                    />
                  </div>
                  <div>
                    <span className="block text-sm font-medium text-[#141E28] mb-2">8. Mother's Name:</span>
                    <CharacterBoxes
                      text={formData.motherName || ''}
                      maxLength={30}
                      onEdit={() => onEdit('motherName')}
                    />
                  </div>
                  <div>
                    <span className="block text-sm font-medium text-[#141E28] mb-2">9. Spouse Name:</span>
                    <CharacterBoxes
                      text={formData.spouseName || ''}
                      maxLength={30}
                      onEdit={() => onEdit('spouseName')}
                    />
                  </div>
                  <div>
                    <span className="block text-sm font-medium text-[#141E28] mb-2">10. Nationality:</span>
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          checked={formData.nationality === 'In-Indian'}
                          readOnly
                          className="text-[#33FEBF]"
                        />
                        <span className="text-sm">In-Indian</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          checked={formData.nationality === 'Others'}
                          readOnly
                          className="text-[#33FEBF]"
                        />
                        <span className="text-sm">Others</span>
                      </label>
                    </div>
                  </div>
                  <div>
                    <span className="block text-sm font-medium text-[#141E28] mb-2">11. Citizenship:</span>
                    <CharacterBoxes
                      text={formData.citizenship || ''}
                      maxLength={20}
                      onEdit={() => onEdit('citizenship')}
                    />
                  </div>
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
                Download PDF
              </Button>
              <Button
                onClick={handleSubmit}
                className="bg-[#33FEBF] hover:bg-[#33FEBF]/90 text-[#141E28]"
              >
                <Send className="w-4 h-4 mr-2" />
                Submit Form
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FormPreview;
