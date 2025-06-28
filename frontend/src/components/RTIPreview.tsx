import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Download, Send } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { generateRTIPDF } from '@/services/pdfService';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import CharacterBoxes from './CharacterBoxes';

interface RTIFormData {
  applicantName: string;
  mailingAddress: string;
  telephone: string;
  email: string;
  isIndianCitizen: boolean;
  informationNature: 'lifeLiberty' | 'other';
  informationType: {
    copyDocuments: boolean;
    inspectRecords: boolean;
    sampleMaterial: boolean;
    otherInfo: boolean;
  };
  otherInfoDescription: string;
  relatesToThirdParty: boolean;
  thirdPartyName: string;
  thirdPartyAddress: string;
  particulars: string[];
  timePeriod: string;
  isBPL: boolean;
  bplProofAttached: boolean;
  feePaid: string;
}

interface RTIPreviewProps {
  formData: RTIFormData;
  onBack: () => void;
  onEdit: (field: string) => void;
}

const RTIPreview = ({ formData, onBack, onEdit }: RTIPreviewProps) => {
  const { translate, selectedLanguage } = useLanguage();
  const navigate = useNavigate();

  const handleDownload = async () => {
    try {
      await generateRTIPDF(formData, selectedLanguage);
      toast({
        title: translate('toast.downloadStarted') || "Download Started",
        description: translate('toast.downloadDescription') || "Your RTI application form is being downloaded as PDF.",
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
                  <img src="/govt-logo.png" alt="Government Logo" className="w-12 h-12" />
                </div>
                <div className="flex-1 text-center">
                  <CardTitle className="text-lg font-bold">
                    APPLICATION UNDER RIGHT TO INFORMATION ACT, 2005
                  </CardTitle>
                  <p className="text-sm font-medium">Form 1</p>
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
            {/* Contact Details Section */}
            <div className="border border-black">
              <div className="bg-gray-100 p-2 text-sm font-medium">A. CONTACT DETAILS</div>
              <div className="p-4 space-y-4">
                <div>
                  <span className="text-sm font-medium">1. Name of the Applicant</span>
                  <div className="mt-2">
                    <CharacterBoxes text={formData.applicantName} maxLength={50} onEdit={() => onEdit('applicantName')} />
                  </div>
                </div>

                <div>
                  <span className="text-sm font-medium">2. a) Mailing Address</span>
                  <div className="mt-2">
                    <CharacterBoxes text={formData.mailingAddress} maxLength={100} onEdit={() => onEdit('mailingAddress')} />
                  </div>
                </div>

                <div>
                  <span className="text-sm font-medium">b) Telephone Number</span>
                  <div className="mt-2">
                    <CharacterBoxes text={formData.telephone} maxLength={15} onEdit={() => onEdit('telephone')} />
                  </div>
                </div>

                <div>
                  <span className="text-sm font-medium">c) Email Address</span>
                  <div className="mt-2">
                    <CharacterBoxes text={formData.email} maxLength={50} onEdit={() => onEdit('email')} />
                  </div>
                </div>

                <div>
                  <span className="text-sm font-medium">3. Whether a citizen of India</span>
                  <div className="mt-2 space-x-4">
                    <label className="inline-flex items-center">
                      <input type="radio" checked={formData.isIndianCitizen} readOnly className="mr-1" />
                      <span className="text-sm">Yes</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input type="radio" checked={!formData.isIndianCitizen} readOnly className="mr-1" />
                      <span className="text-sm">No</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Information Sought Section */}
            <div className="border border-black">
              <div className="bg-gray-100 p-2 text-sm font-medium">B. DETAILS OF INFORMATION SOUGHT</div>
              <div className="p-4 space-y-4">
                <div>
                  <span className="text-sm font-medium">1. Nature of information sought</span>
                  <div className="mt-2 space-x-4">
                    <label className="inline-flex items-center">
                      <input type="radio" checked={formData.informationNature === 'lifeLiberty'} readOnly className="mr-1" />
                      <span className="text-sm">Life & liberty of the person</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input type="radio" checked={formData.informationNature === 'other'} readOnly className="mr-1" />
                      <span className="text-sm">Other than life & liberty</span>
                    </label>
                  </div>
                </div>

                <div>
                  <span className="text-sm font-medium">2. Type of information required</span>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {[
                      'Copy of documents',
                      'Inspection of records',
                      'Sample of material',
                      'Other information'
                    ].map((type) => (
                      <label key={type} className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          checked={formData.informationType[type.toLowerCase().replace(/ /g, '') as keyof typeof formData.informationType]} 
                          readOnly 
                        />
                        <span className="text-xs">{type}</span>
                      </label>
                    ))}
                  </div>
                  <button onClick={() => onEdit('informationType')} className="mt-2 text-[#33FEBF] text-xs underline">
                    Edit
                  </button>
                </div>

                {formData.informationType.otherInfo && (
                  <div>
                    <span className="text-sm font-medium">Description of other information</span>
                    <div className="mt-2">
                      <CharacterBoxes text={formData.otherInfoDescription} maxLength={100} onEdit={() => onEdit('otherInfoDescription')} />
                    </div>
                  </div>
                )}

                <div>
                  <span className="text-sm font-medium">3. a) Whether information sought relates to third party?</span>
                  <div className="mt-2 space-x-4">
                    <label className="inline-flex items-center">
                      <input type="radio" checked={formData.relatesToThirdParty} readOnly className="mr-1" />
                      <span className="text-sm">Yes</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input type="radio" checked={!formData.relatesToThirdParty} readOnly className="mr-1" />
                      <span className="text-sm">No</span>
                    </label>
                  </div>
                </div>

                {formData.relatesToThirdParty && (
                  <>
                    <div>
                      <span className="text-sm font-medium">b) Third party name</span>
                      <div className="mt-2">
                        <CharacterBoxes text={formData.thirdPartyName} maxLength={50} onEdit={() => onEdit('thirdPartyName')} />
                      </div>
                    </div>
                    <div>
                      <span className="text-sm font-medium">c) Third party address</span>
                      <div className="mt-2">
                        <CharacterBoxes text={formData.thirdPartyAddress} maxLength={100} onEdit={() => onEdit('thirdPartyAddress')} />
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <span className="text-sm font-medium">4. Specify the particulars of information required</span>
                  <div className="mt-2 space-y-2">
                    {formData.particulars.map((particular, index) => (
                      <div key={index}>
                        <span className="text-xs">({index + 1})</span>
                        <CharacterBoxes text={particular} maxLength={100} onEdit={() => onEdit(`particulars.${index}`)} />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-sm font-medium">5. Time period for which information is required</span>
                  <div className="mt-2">
                    <CharacterBoxes text={formData.timePeriod} maxLength={50} onEdit={() => onEdit('timePeriod')} />
                  </div>
                </div>

                <div>
                  <span className="text-sm font-medium">6. Whether applicant belongs to BPL category</span>
                  <div className="mt-2 space-x-4">
                    <label className="inline-flex items-center">
                      <input type="radio" checked={formData.isBPL} readOnly className="mr-1" />
                      <span className="text-sm">Yes</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input type="radio" checked={!formData.isBPL} readOnly className="mr-1" />
                      <span className="text-sm">No</span>
                    </label>
                  </div>
                </div>

                {formData.isBPL && (
                  <div>
                    <span className="text-sm font-medium">Proof of BPL attached</span>
                    <div className="mt-2 space-x-4">
                      <label className="inline-flex items-center">
                        <input type="radio" checked={formData.bplProofAttached} readOnly className="mr-1" />
                        <span className="text-sm">Yes</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input type="radio" checked={!formData.bplProofAttached} readOnly className="mr-1" />
                        <span className="text-sm">No</span>
                      </label>
                    </div>
                  </div>
                )}

                <div>
                  <span className="text-sm font-medium">7. Details of fee paid (Rs.)</span>
                  <div className="mt-2">
                    <CharacterBoxes text={formData.feePaid} maxLength={10} onEdit={() => onEdit('feePaid')} />
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
                {translate('button.download')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RTIPreview;