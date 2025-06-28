
import { useParams } from 'react-router-dom';
import BankAccountForm from '@/components/BankAccountForm';
import VoterIdForm from '@/components/VoterIdForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Construction } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PanCardForm from '@/components/PanCardForm';
import RTIForm from '@/components/RTIForm';
import ConsumerForm from '@/components/ConsumerForm';


const FormPage = () => {
  const { formId } = useParams();
  const navigate = useNavigate();

  if (formId === 'bank-account') {
    return <BankAccountForm />;
  }

  if (formId === 'voter-id') {
    return <VoterIdForm />;
  }
  if (formId === 'pan-card') {
    return <PanCardForm />;
  }
   if(formId === 'rti'){
    return <RTIForm />;
  }
  if(formId === 'consumer'){
    return <ConsumerForm />;
  }

  // Placeholder for other forms
  return (
    <div className="min-h-screen bg-[#141E28] p-6">
      <div className="max-w-2xl mx-auto">
        <Button
          variant="outline"
          onClick={() => navigate('/')}
          className="mb-6 border-[#33FEBF] text-[#33FEBF] hover:bg-[#33FEBF] hover:text-[#141E28]"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Forms
        </Button>

        <Card className="text-center py-12 border border-[#33FEBF] bg-white">
          <CardHeader>
            <Construction className="w-16 h-16 mx-auto mb-4 text-[#33FEBF]" />
            <CardTitle className="text-2xl text-[#141E28]">Form Coming Soon</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-6">
              This form is currently under development. We're working hard to bring you the best form-filling experience.
            </p>
            <p className="text-sm text-gray-500">
              Form ID: {formId}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FormPage;
