import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Download, Send } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { generateConsumerPDF } from '@/services/pdfService';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import CharacterBoxes from './CharacterBoxes';

interface ConsumerFormData {
  caseNumber: string;
  forumType: 'district' | 'state' | 'national';
  forumName: string;
  complaintNumber: string;
  matter: string;
  complainantName: string;
  complainantAddress: string;
  oppositePartyName: string;
  oppositePartyAddress: string;
  complaintText: string;
  refundAmount: string;
  compensationAmount: string;
  litigationCost: boolean;
  verificationPlace: string;
  verificationDate: string;
  annexures: string[];
}

interface ConsumerPreviewProps {
  formData: ConsumerFormData;
  onBack: () => void;
  onEdit: (field: string) => void;
}

const ConsumerPreview = ({ formData, onBack, onEdit }: ConsumerPreviewProps) => {
  const { translate, selectedLanguage } = useLanguage();
  const navigate = useNavigate();

  const handleDownload = async () => {
    try {
      await generateConsumerPDF(formData, selectedLanguage);
      toast({
        title: translate('toast.downloadStarted') || "Download Started",
        description: translate('toast.downloadDescription') || "Your consumer complaint form is being downloaded as PDF.",
      });
    } catch (error) {
      toast({
        title: translate('toast.downloadFailed') || "Download Failed", 
        description: translate('toast.downloadError') || "There was an error generating the PDF. Please try again.",
        variant: "destructive",
      });
    }
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
                  <img src="/consumer-forum-logo.png" alt="Consumer Forum Logo" className="w-12 h-12" />
                </div>
                <div className="flex-1 text-center">
                  <CardTitle className="text-lg font-bold">
                    FORM FOR COMPLAINT UNDER THE CONSUMER PROTECTION ACT, 1986
                  </CardTitle>
                </div>
                <div className="text-right">
                  <p className="text-sm">Complaint No.</p>
                  <div className="border border-black w-20 h-8 mt-1"></div>
                  <p className="text-xs mt-1">(For official use only)</p>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-6 bg-white">
            {/* Case Details Section */}
            <div className="border border-black">
              <div className="bg-gray-100 p-2 text-sm font-medium">CASE DETAILS</div>
              <div className="p-4 space-y-4">
                <div>
                  <span className="text-sm font-medium">In the complaint case no.</span>
                  <div className="mt-2">
                    <CharacterBoxes text={formData.caseNumber} maxLength={50} onEdit={() => onEdit('caseNumber')} />
                  </div>
                </div>

                <div>
                  <span className="text-sm font-medium">Before the Hon'ble</span>
                  <div className="mt-2 space-x-4">
                    <label className="inline-flex items-center">
                      <input type="radio" checked={formData.forumType === 'district'} readOnly className="mr-1" />
                      <span className="text-sm">District Forum</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input type="radio" checked={formData.forumType === 'state'} readOnly className="mr-1" />
                      <span className="text-sm">State Commission</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input type="radio" checked={formData.forumType === 'national'} readOnly className="mr-1" />
                      <span className="text-sm">National Commission</span>
                    </label>
                  </div>
                </div>

                <div>
                  <span className="text-sm font-medium">Forum Name</span>
                  <div className="mt-2">
                    <CharacterBoxes text={formData.forumName} maxLength={50} onEdit={() => onEdit('forumName')} />
                  </div>
                </div>

                <div>
                  <span className="text-sm font-medium">Complaint No.</span>
                  <div className="mt-2">
                    <CharacterBoxes text={formData.complaintNumber} maxLength={20} onEdit={() => onEdit('complaintNumber')} />
                  </div>
                </div>

                <div>
                  <span className="text-sm font-medium">In the matter of</span>
                  <div className="mt-2">
                    <CharacterBoxes text={formData.matter} maxLength={100} onEdit={() => onEdit('matter')} />
                  </div>
                </div>
              </div>
            </div>

            {/* Complainant Details Section */}
            <div className="border border-black">
              <div className="bg-gray-100 p-2 text-sm font-medium">COMPLAINANT DETAILS</div>
              <div className="p-4 space-y-4">
                <div>
                  <span className="text-sm font-medium">Name & address of complainant</span>
                  <div className="mt-2">
                    <CharacterBoxes text={formData.complainantName} maxLength={200} onEdit={() => onEdit('complainantName')} />
                  </div>
                </div>
              </div>
            </div>

            {/* Opposite Party Details Section */}
            <div className="border border-black">
              <div className="bg-gray-100 p-2 text-sm font-medium">OPPOSITE PARTY DETAILS</div>
              <div className="p-4 space-y-4">
                <div>
                  <span className="text-sm font-medium">Name & address of opposite party</span>
                  <div className="mt-2">
                    <CharacterBoxes text={formData.oppositePartyName} maxLength={200} onEdit={() => onEdit('oppositePartyName')} />
                  </div>
                </div>
              </div>
            </div>

            {/* Complaint Details Section */}
            <div className="border border-black">
              <div className="bg-gray-100 p-2 text-sm font-medium">COMPLAINT DETAILS</div>
              <div className="p-4 space-y-4">
                <div>
                  <span className="text-sm font-medium">Complaint text</span>
                  <div className="mt-2">
                    <CharacterBoxes text={formData.complaintText} maxLength={500} onEdit={() => onEdit('complaintText')} />
                  </div>
                </div>
              </div>
            </div>

            {/* Prayer Details Section */}
            <div className="border border-black">
              <div className="bg-gray-100 p-2 text-sm font-medium">PRAYER DETAILS</div>
              <div className="p-4 space-y-4">
                <div>
                  <span className="text-sm font-medium">Refund amount (Rs.)</span>
                  <div className="mt-2">
                    <CharacterBoxes text={formData.refundAmount} maxLength={20} onEdit={() => onEdit('refundAmount')} />
                  </div>
                </div>

                <div>
                  <span className="text-sm font-medium">Compensation amount (Rs.)</span>
                  <div className="mt-2">
                    <CharacterBoxes text={formData.compensationAmount} maxLength={20} onEdit={() => onEdit('compensationAmount')} />
                  </div>
                </div>

                <div>
                  <span className="text-sm font-medium">Cost of litigation</span>
                  <div className="mt-2 space-x-4">
                    <label className="inline-flex items-center">
                      <input type="radio" checked={formData.litigationCost} readOnly className="mr-1" />
                      <span className="text-sm">Yes</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input type="radio" checked={!formData.litigationCost} readOnly className="mr-1" />
                      <span className="text-sm">No</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Verification Section */}
            <div className="border border-black">
              <div className="bg-gray-100 p-2 text-sm font-medium">VERIFICATION</div>
              <div className="p-4 space-y-4">
                <div>
                  <span className="text-sm font-medium">Place</span>
                  <div className="mt-2">
                    <CharacterBoxes text={formData.verificationPlace} maxLength={50} onEdit={() => onEdit('verificationPlace')} />
                  </div>
                </div>

                <div>
                  <span className="text-sm font-medium">Date</span>
                  <div className="mt-2">
                    <CharacterBoxes text={formData.verificationDate} maxLength={20} onEdit={() => onEdit('verificationDate')} />
                  </div>
                </div>
              </div>
            </div>

            {/* Annexures Section */}
            <div className="border border-black">
              <div className="bg-gray-100 p-2 text-sm font-medium">ANNEXURES</div>
              <div className="p-4 space-y-4">
                {formData.annexures.map((annexure, index) => (
                  <div key={index}>
                    <span className="text-sm font-medium">Annexure {index + 1}</span>
                    <div className="mt-2">
                      <CharacterBoxes text={annexure} maxLength={100} onEdit={() => onEdit(`annexures.${index}`)} />
                    </div>
                  </div>
                ))}
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
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ConsumerPreview;