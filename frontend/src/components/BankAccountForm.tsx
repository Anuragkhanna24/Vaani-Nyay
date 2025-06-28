import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

const formSchema = z.object({
  accountHolderName: z.string().min(2, {
    message: "Account holder name must be at least 2 characters.",
  }),
  bankName: z.string().min(2, {
    message: "Bank name must be at least 2 characters.",
  }),
  accountNumber: z.string().regex(/^[0-9]+$/, {
    message: "Account number must contain only numbers."
  }).min(9, {
    message: "Account number must be at least 9 numbers."
  }),
  ifscCode: z.string().regex(/^[A-Za-z]{4}[0-9]{7}$/, {
    message: "IFSC code must be in a valid format."
  }),
  branchName: z.string().min(2, {
    message: "Branch name must be at least 2 characters.",
  }),
  hasJointAccount: z.boolean().default(false),
})

interface FormData {
  accountHolderName: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  branchName: string;
  hasJointAccount: boolean;
}

const BankAccountForm = () => {
  const [formData, setFormData] = useState<FormData>({
    accountHolderName: '',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    branchName: '',
    hasJointAccount: false,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      accountHolderName: "",
      bankName: "",
      accountNumber: "",
      ifscCode: "",
      branchName: "",
      hasJointAccount: false,
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (field: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [field]: checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(JSON.stringify(formData, null, 2));
  };

  return (
    <div className="min-h-screen bg-[#141E28] p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#33FEBF] mb-2">Bank Account Details Form</h1>
          <p className="text-gray-300">Please fill in the details below to submit your bank account information.</p>
        </div>

        <Card className="shadow-lg border border-[#33FEBF] bg-white">
          <CardHeader className="bg-[#33FEBF] text-[#141E28]">
            <CardTitle className="text-xl text-center">Enter Your Bank Account Details</CardTitle>
          </CardHeader>

          <CardContent className="p-8 bg-white">
            <form onSubmit={handleSubmit} className="space-y-6">
              <FormItem>
                <FormLabel className="text-[#141E28]">Account Holder Name</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    name="accountHolderName"
                    value={formData.accountHolderName}
                    onChange={handleInputChange}
                    placeholder="Enter account holder name"
                    className="border-2 border-[#33FEBF] focus:border-[#33FEBF] focus:ring-[#33FEBF] rounded-md"
                  />
                </FormControl>
              </FormItem>

              <FormItem>
                <FormLabel className="text-[#141E28]">Bank Name</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    name="bankName"
                    value={formData.bankName}
                    onChange={handleInputChange}
                    placeholder="Enter bank name"
                    className="border-2 border-[#33FEBF] focus:border-[#33FEBF] focus:ring-[#33FEBF] rounded-md"
                  />
                </FormControl>
              </FormItem>

              <FormItem>
                <FormLabel className="text-[#141E28]">Account Number</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    name="accountNumber"
                    value={formData.accountNumber}
                    onChange={handleInputChange}
                    placeholder="Enter account number"
                    className="border-2 border-[#33FEBF] focus:border-[#33FEBF] focus:ring-[#33FEBF] rounded-md"
                  />
                </FormControl>
              </FormItem>

              <FormItem>
                <FormLabel className="text-[#141E28]">IFSC Code</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    name="ifscCode"
                    value={formData.ifscCode}
                    onChange={handleInputChange}
                    placeholder="Enter IFSC code"
                    className="border-2 border-[#33FEBF] focus:border-[#33FEBF] focus:ring-[#33FEBF] rounded-md"
                  />
                </FormControl>
              </FormItem>

              <FormItem>
                <FormLabel className="text-[#141E28]">Branch Name</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    name="branchName"
                    value={formData.branchName}
                    onChange={handleInputChange}
                    placeholder="Enter branch name"
                    className="border-2 border-[#33FEBF] focus:border-[#33FEBF] focus:ring-[#33FEBF] rounded-md"
                  />
                </FormControl>
              </FormItem>

              <FormItem>
                <FormLabel className="text-[#141E28]">Do you have a joint account?</FormLabel>
                <FormControl>
                  <Checkbox
                    checked={formData.hasJointAccount}
                    onCheckedChange={(checked) => handleCheckboxChange('hasJointAccount', checked as boolean)}
                    className="border-[#33FEBF] data-[state=checked]:bg-[#33FEBF] data-[state=checked]:border-[#33FEBF]"
                  />
                </FormControl>
              </FormItem>

              <Button type="submit" className="bg-[#33FEBF] hover:bg-[#33FEBF]/90 text-[#141E28] font-bold py-2 px-4 rounded">
                Submit
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BankAccountForm;
