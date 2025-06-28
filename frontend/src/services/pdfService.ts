{/*import jsPDF from 'jspdf';
import { translateFormData } from './translationService';

interface VoterFormData {
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
  uploadedFiles?: File[];
  
  enableCorrectionSection?: boolean;
  enableReplacementSection?: boolean;
  enableDisabilitySection?: boolean;

  disabilityType?: {
    locomotive?: boolean;
    visual?: boolean;
    deafDumb?: boolean;
    other?: boolean;
  };
  disabilityPercentage?: string;
  
  correctionFields?: {
    name: boolean;
    gender: boolean;
    dobAge: boolean;
    relationType: boolean;
    relationName: boolean;
    address: boolean;
    mobileNumber: boolean;
    photo: boolean;
  };
  correctParticulars?: string;
  documentName?: string;
  
  declarationDate?: string;
  declarationPlace?: string;
  certificateAttached?: boolean;

  epicCondition?: {
    lost?: boolean;
    destroyed?: boolean;
    mutilated?: boolean;
  };
}

interface PanFormData {
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

export const generateVoterIdPDF = async (formData: VoterFormData, language: string = 'en'): Promise<void> => {
  // Translate form data to English for PDF
  const translatedData = await translateFormData(formData, language);
  
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 10;
  const contentWidth = pageWidth - (2 * margin);
  
  // Set font
  pdf.setFont('helvetica', 'normal');
  
  // Main border
  pdf.rect(margin, margin, contentWidth, pageHeight - 20);
  
  // Header section
  pdf.setFontSize(8);
  pdf.text('Date of Notification:', pageWidth - 55, 18);
  
  // ECI Logo box
  const logoX = margin + 5;
  const logoY = 15;
  pdf.rect(logoX, logoY, 20, 20);
  
  // Add Indian flag colors for ECI logo
  try {
    pdf.setFillColor(255, 165, 0); // Orange
    pdf.rect(logoX + 2, logoY + 2, 16, 5, 'F');
    pdf.setFillColor(255, 255, 255); // White
    pdf.rect(logoX + 2, logoY + 7, 16, 5, 'F');
    pdf.setFillColor(0, 128, 0); // Green
    pdf.rect(logoX + 2, logoY + 12, 16, 5, 'F');
    
    // Add Ashoka Chakra in center
    pdf.setFillColor(0, 0, 255); // Blue
    pdf.circle(logoX + 10, logoY + 9.5, 2, 'F');
    pdf.setFillColor(0, 0, 0); // Reset to black
  } catch (error) {
    console.log('Logo rendering failed, using placeholder');
  }
  
  // Title section
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('ELECTION COMMISSION OF INDIA', pageWidth / 2, 25, { align: 'center' });
  
  pdf.setFontSize(10);
  pdf.text('Form-8', pageWidth / 2, 32, { align: 'center' });
  
  // Form number box
  pdf.setFontSize(8);
  pdf.text('FORM No.', pageWidth - 40, 25);
  pdf.text('(To be filled by office)', pageWidth - 50, 30);
  pdf.rect(pageWidth - 35, 18, 25, 8);
  
  // Subtitle
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  const subtitle = 'Voter Application Form for Shifting of Residence/Correction of Entries in Existing Electoral';
  const subtitle2 = 'Roll/Replacement of EPIC/Marking of PwD';
  pdf.text(subtitle, pageWidth / 2, 40, { align: 'center' });
  pdf.text(subtitle2, pageWidth / 2, 46, { align: 'center' });
  
  pdf.setFontSize(7);
  pdf.text('(See Rules 13(3) and (26) of the Registration of Electors Rules, 1960)', pageWidth / 2, 52, { align: 'center' });
  
  let yPos = 60;
  
  // To section
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'normal');
  pdf.text('To,', margin + 5, yPos);
  yPos += 4;
  pdf.text('The Electoral Registration Officer,', margin + 5, yPos);
  yPos += 4;
  pdf.text('No. & Name of Assembly Constituency', margin + 5, yPos);
  yPos += 8;
  
  // Assembly constituency
  pdf.text('No.', margin + 5, yPos);
  drawSmallBoxes(pdf, margin + 15, yPos - 3, translatedData.assemblyConstituencyNo, 3);
  pdf.text('Name', margin + 35, yPos);
  drawLongBoxes(pdf, margin + 50, yPos - 3, translatedData.assemblyConstituencyName, 30);
  yPos += 8;
  
  pdf.text('Or No. & Name of Parliamentary Constituency@', margin + 5, yPos);
  pdf.text('No.', margin + 5, yPos + 5);
  drawSmallBoxes(pdf, margin + 15, yPos + 2, translatedData.parliamentaryConstituencyNo, 3);
  pdf.text('Name', margin + 35, yPos + 5);
  drawLongBoxes(pdf, margin + 50, yPos + 2, translatedData.parliamentaryConstituencyName, 30);
  yPos += 10;
  
  pdf.setFontSize(7);
  pdf.text('(@ only for Union Territories not having Legislative Assembly)', margin + 5, yPos);
  yPos += 10;
  
  // Name section
  pdf.setFontSize(8);
  pdf.text('(i) Name of the applicant', margin + 5, yPos);
  yPos += 5;
  drawLongBoxes(pdf, margin + 5, yPos, translatedData.applicantName, 50);
  yPos += 10;
  
  // EPIC section
  pdf.text('EPIC No.', margin + 5, yPos);
  yPos += 5;
  drawMediumBoxes(pdf, margin + 5, yPos, translatedData.epicNo, 10);
  yPos += 10;
  
  // Aadhaar section
  pdf.text('Aadhaar Details :- (Please tick the appropriate box)', margin + 5, yPos);
  yPos += 5;
  
  pdf.text('(a)', margin + 5, yPos);
  drawCheckbox(pdf, margin + 13, yPos - 2, !!translatedData.aadhaarNumber);
  pdf.text('Aadhaar Number', margin + 20, yPos);
  if (translatedData.aadhaarNumber) {
    drawMediumBoxes(pdf, margin + 55, yPos - 2, translatedData.aadhaarNumber, 12);
  } else {
    drawMediumBoxes(pdf, margin + 55, yPos - 2, '', 12);
  }
  pdf.text('or', contentWidth - 15, yPos);
  yPos += 5;
  
  pdf.text('(b)', margin + 5, yPos);
  drawCheckbox(pdf, margin + 13, yPos - 2, translatedData.noAadhaar);
  pdf.text('I am not able to furnish my Aadhaar Number because I don\'t have Aadhaar Number.', margin + 20, yPos);
  yPos += 10;
  
  // Mobile numbers
  pdf.text('Mobile No. of Self (or)', margin + 5, yPos);
  yPos += 5;
  drawMobileBoxes(pdf, margin + 5, yPos, translatedData.mobileNoSelf);
  yPos += 8;
  
  pdf.text('Mobile No. of Father/Mother/Any other relative (if available)', margin + 5, yPos);
  yPos += 5;
  drawMobileBoxes(pdf, margin + 5, yPos, translatedData.mobileNoRelative);
  yPos += 10;
  
  // Email sections
  pdf.text('Email Id of Self (or)', margin + 5, yPos);
  yPos += 2;
  pdf.line(margin + 5, yPos + 2, contentWidth - 60, yPos + 2);
  if (translatedData.emailSelf) {
    const emailText = pdf.splitTextToSize(translatedData.emailSelf, contentWidth - 70);
    pdf.text(emailText[0], margin + 5, yPos + 1);
  }
  yPos += 8;
  
  pdf.text('Email Id of Father/Mother/Any other relative (if available)', margin + 5, yPos);
  yPos += 2;
  pdf.line(margin + 5, yPos + 2, contentWidth - 60, yPos + 2);
  if (translatedData.emailRelative) {
    const emailText = pdf.splitTextToSize(translatedData.emailRelative, contentWidth - 70);
    pdf.text(emailText[0], margin + 5, yPos + 1);
  }
  yPos += 12;
  
  // Application type
  pdf.text('(ii) I submit application for    (Tick any one of the following)', margin + 5, yPos);
  yPos += 6;
  
  const appTypes = [
    'Shifting of Residence (or)',
    'Correction of Entries in Existing Electoral Roll (or)',
    'Issue of Replacement EPIC without correction (or)',
    'Request for marking as Person with Disability'
  ];
  
  appTypes.forEach((type, index) => {
    const isChecked = translatedData.applicationType === type.replace(' (or)', '') || 
                      translatedData.applicationType.includes(type.split(' ')[0]);
    pdf.text(`${index + 1}.`, margin + 5, yPos);
    drawCheckbox(pdf, margin + 13, yPos - 2, isChecked);
    pdf.text(type, margin + 20, yPos);
    yPos += 5;
  });
  
  yPos += 5;
  
  // Check if we need a new page
  if (yPos > 220) {
    pdf.addPage();
    yPos = 20;
    pdf.rect(margin, margin, contentWidth, pageHeight - 20);
  }
  
  // Section 1: Shifting of Residence
  pdf.setFont('helvetica', 'bold');
  pdf.text('1. Application for Shifting of Residence', margin + 5, yPos);
  yPos += 5;
  
  pdf.setFont('helvetica', 'normal');
  pdf.text('My name shall not be deleted from the previous address and shifted to the current', margin + 5, yPos);
  yPos += 4;
  pdf.text('address mentioned below. I request that my replacement EPIC may be issued to me to reflect', margin + 5, yPos);
  yPos += 4;
  pdf.text('my old EPIC.', margin + 5, yPos);
  yPos += 8;
  
  // Address section with proper layout
  pdf.text('Present', margin + 5, yPos);
  pdf.text('House/Building/Apartment No.', margin + 25, yPos);
  drawAddressBoxes(pdf, margin + 25, yPos + 3, translatedData.presentAddress.houseNo, 15);
  
  pdf.text('Street/Area/Locality/ Mohalla/Road', margin + 105, yPos);
  drawAddressBoxes(pdf, margin + 105, yPos + 3, translatedData.presentAddress.streetArea, 20);
  yPos += 12;
  
  pdf.text('Ordinary', margin + 5, yPos);
  pdf.text('Town/Village', margin + 25, yPos);
  drawAddressBoxes(pdf, margin + 25, yPos + 3, translatedData.presentAddress.townVillage, 15);
  
  pdf.text('Post Office', margin + 105, yPos);
  drawAddressBoxes(pdf, margin + 105, yPos + 3, translatedData.presentAddress.postOffice, 20);
  yPos += 12;
  
  pdf.text('Residence', margin + 5, yPos);
  pdf.text('PIN Code', margin + 25, yPos);
  drawAddressBoxes(pdf, margin + 25, yPos + 3, translatedData.presentAddress.pinCode, 6);
  
  pdf.text('Tehsil/Taluka/Mandal', margin + 105, yPos);
  drawAddressBoxes(pdf, margin + 105, yPos + 3, translatedData.presentAddress.tehsilTaluka, 15);
  yPos += 12;
  
  pdf.text('(Full Address)', margin + 5, yPos);
  pdf.text('District', margin + 25, yPos);
  drawAddressBoxes(pdf, margin + 25, yPos + 3, translatedData.presentAddress.district, 15);
  
  pdf.text('State/UT', margin + 105, yPos);
  drawAddressBoxes(pdf, margin + 105, yPos + 3, translatedData.presentAddress.stateUt, 15);
  yPos += 15;
  
  // Documents section
  const docText = 'Self-attested copy of address proof either in the name of applicant or anyone of the parents/spouse/adult child,';
  const docText2 = 'if already enrolled with as elector at the same address (Attach any one of the documents mentioned below *):-';
  pdf.text(docText, margin + 5, yPos);
  pdf.text(docText2, margin + 5, yPos + 4);
  yPos += 12;
  
  const documents = [
    'Water/Electricity/Gas connection Bill for that address (atleast 1 year)',
    'Current passbook of Nationalised/Scheduled Bank/Post Office',
    'Revenue Department\'s Land Owning records including Kisan Bahi',
    'Registered Rent Lease Deed (In case of tenant)',
    'Aadhaar Card',
    'Indian Passport',
    'Registered Sale Deed (In case of own house)'
  ];
  
  // Two column layout for documents
  documents.forEach((doc, index) => {
    const col = index % 2;
    const row = Math.floor(index / 2);
    const x = col === 0 ? margin + 5 : margin + (contentWidth / 2);
    const y = yPos + (row * 6);
    
    pdf.text(`${index + 1}.`, x, y);
    drawCheckbox(pdf, x + 8, y - 2, translatedData.documentsAvailable?.includes(doc) || false);
    
    const maxWidth = (contentWidth / 2) - 20;
    const wrappedText = pdf.splitTextToSize(doc, maxWidth);
    pdf.text(wrappedText[0], x + 15, y);
    if (wrappedText.length > 1) {
      pdf.text(wrappedText[1], x + 15, y + 3);
    }
  });
  
  yPos += 25;
  
  if (translatedData.otherDocument) {
    pdf.text('Any Other:- (Pl. Specify)', margin + 5, yPos);
    yPos += 3;
    pdf.line(margin + 50, yPos + 2, contentWidth - 5, yPos + 2);
    const otherDoc = pdf.splitTextToSize(translatedData.otherDocument, contentWidth - 60);
    pdf.text(otherDoc[0], margin + 52, yPos + 1);
    yPos += 8;
  }
  
  // Check if we need a new page for the next sections
  if (yPos > 200) {
    pdf.addPage();
    yPos = 20;
    pdf.rect(margin, margin, contentWidth, pageHeight - 20);
  }

  // Section 2: Correction of Entries
  pdf.setFont('helvetica', 'bold');
  pdf.text('2. Application for Correction of Entries in Existing Electoral Roll', margin + 5, yPos);
  yPos += 6;
  
  pdf.setFont('helvetica', 'normal');
  pdf.text('Please correct my following details in Electoral Roll/EPIC:', margin + 5, yPos);
  yPos += 4;
  pdf.text('(Maximum of 4 entries/particulars can be corrected)', margin + 5, yPos);
  yPos += 4;
  pdf.text('(Put a tick ☑ in appropriate box below.)', margin + 5, yPos);
  yPos += 4;
  pdf.text('Copy of self-attested Documentary Proof in support of claim to be attached.', margin + 5, yPos);
  yPos += 8;

  // Photo space on the right side
  pdf.rect(contentWidth - 50, yPos - 25, 45, 20);
  pdf.setFontSize(6);
  pdf.text('SPACE FOR PASTING ONE', contentWidth - 48, yPos - 20);
  pdf.text('RECENT PASSPORT SIZE', contentWidth - 48, yPos - 17);
  pdf.text('UNSIGNED COLOR', contentWidth - 48, yPos - 14);
  pdf.text('PHOTOGRAPH (4.5 CM X', contentWidth - 48, yPos - 11);
  pdf.text('3.5 CM) SHOWING', contentWidth - 48, yPos - 8);
  pdf.text('FRONTAL VIEW OF FULL', contentWidth - 48, yPos - 5);
  pdf.text('FACE WITH WHITE', contentWidth - 48, yPos - 2);
  pdf.text('BACKGROUND ONLY IF', contentWidth - 48, yPos + 1);
  pdf.text('PHOTO IS TO BE CHANGED)', contentWidth - 48, yPos + 4);
  pdf.setFontSize(8);

  // Correction fields grid (2x4 layout)
  const correctionFields = [
    { key: 'name', label: 'Name', num: '1.' },
    { key: 'gender', label: 'Gender', num: '2.' },
    { key: 'dobAge', label: 'DoB/Age', num: '3.' },
    { key: 'relationType', label: 'Relation Type', num: '4.' },
    { key: 'relationName', label: 'Relation Name', num: '5.' },
    { key: 'address', label: 'Address', num: '6.' },
    { key: 'mobileNumber', label: 'Mobile Number', num: '7.' },
    { key: 'photo', label: 'Photo', num: '8.' }
  ];

  // Draw correction fields in 2 columns
  correctionFields.forEach((field, index) => {
    const col = index % 2;
    const row = Math.floor(index / 2);
    const x = col === 0 ? margin + 5 : margin + (contentWidth / 2) - 60;
    const y = yPos + (row * 6);
    
    pdf.text(field.num, x, y);
    const isChecked = formData.enableCorrectionSection && 
                     formData.correctionFields?.[field.key as keyof typeof formData.correctionFields];
    drawCheckbox(pdf, x + 10, y - 2, isChecked || false);
    pdf.text(field.label, x + 18, y);
  });
  yPos += 30;

  pdf.text('The correct particulars in the entry to be corrected are as under:-', margin + 5, yPos);
  yPos += 6;

  // Correction particulars box
  pdf.rect(margin + 5, yPos, contentWidth - 60, 15);
  if (formData.enableCorrectionSection && formData.correctParticulars) {
    const correctedText = pdf.splitTextToSize(formData.correctParticulars, contentWidth - 70);
    correctedText.forEach((line: string, index: number) => {
      if (index < 3) { // Limit to 3 lines
        pdf.text(line, margin + 7, yPos + 4 + (index * 4));
      }
    });
  }
  yPos += 20;

  pdf.text('Name of Document in support of above claim attached', margin + 5, yPos);
  yPos += 6;
  pdf.rect(margin + 5, yPos, contentWidth - 10, 8);
  if (formData.enableCorrectionSection && formData.documentName) {
    const docNameText = pdf.splitTextToSize(formData.documentName, contentWidth - 20);
    pdf.text(docNameText[0], margin + 7, yPos + 4);
  }
  yPos += 15;

  // Section 3: Replacement EPIC
  pdf.setFont('helvetica', 'bold');
  pdf.text('3. Application for Issue of Replacement EPIC without correction', margin + 5, yPos);
  yPos += 6;
  
  pdf.setFont('helvetica', 'normal');
  pdf.text('I request that a replacement EPIC may be issued to me as my original EPIC is-', margin + 5, yPos);
  yPos += 4;
  pdf.text('(Put a tick in appropriate box.)', margin + 5, yPos);
  yPos += 8;

  // EPIC condition checkboxes
  const epicConditions = [
    { key: 'lost', label: 'Lost' },
    { key: 'destroyed', label: 'Destroyed due to reason beyond control like floods, fire, other natural disaster etc.' },
    { key: 'mutilated', label: 'Mutilated' }
  ];

  epicConditions.forEach((condition, index) => {
    const isChecked = formData.enableReplacementSection && 
                     formData.epicCondition?.[condition.key as keyof typeof formData.epicCondition];
    drawCheckbox(pdf, margin + 5, yPos - 2, isChecked || false);
    const conditionText = pdf.splitTextToSize(condition.label, contentWidth - 20);
    pdf.text(conditionText[0], margin + 13, yPos);
    if (conditionText.length > 1) {
      pdf.text(conditionText[1], margin + 13, yPos + 3);
      yPos += 3;
    }
    yPos += 5;
  });
  
  pdf.text('I hereby return my mutilated/ old EPIC (OR) I have attached copy of FIR/Police report for lost EPIC & I undertake to return', margin + 5, yPos);
  pdf.text('the earlier EPIC issued to me if the same is recovered at a later stage.', margin + 5, yPos + 4);
  yPos += 15;

  // Check if we need a new page
  if (yPos > 200) {
    pdf.addPage();
    yPos = 20;
    pdf.rect(margin, margin, contentWidth, pageHeight - 20);
  }

  // Section 4: Disability
  pdf.setFont('helvetica', 'bold');
  pdf.text('4. Application for Marking Person with Disability', margin + 5, yPos);
  yPos += 6;
  
  pdf.setFont('helvetica', 'normal');
  pdf.text('Category of disability (Tick the appropriate box for category of disability)', margin + 5, yPos);
  yPos += 8;

  const disabilityTypes = [
    { key: 'locomotive', label: 'Locomotive' },
    { key: 'visual', label: 'Visual' },
    { key: 'deafDumb', label: 'Deaf & Dumb' },
    { key: 'other', label: 'If any other (Give description)' }
  ];

  disabilityTypes.forEach((type, index) => {
    const col = index % 2;
    const row = Math.floor(index / 2);
    const x = col === 0 ? margin + 5 : margin + (contentWidth / 2);
    const y = yPos + (row * 6);
    
    const isChecked = formData.enableDisabilitySection && 
                     formData.disabilityType?.[type.key as keyof typeof formData.disabilityType];
    drawCheckbox(pdf, x, y - 2, isChecked || false);
    pdf.text(type.label, x + 10, y);
  });
  yPos += 15;

  pdf.text('Percentage of disability', margin + 5, yPos);
  const percentage = formData.enableDisabilitySection ? (formData.disabilityPercentage || '') : '';
  drawSmallBoxes(pdf, margin + 60, yPos - 3, percentage, 3);
  pdf.text('%, Certificate attached (Tick the appropriate box)', margin + 75, yPos);
  
  const certYes = formData.enableDisabilitySection && formData.certificateAttached;
  const certNo = formData.enableDisabilitySection && !formData.certificateAttached;
  drawCheckbox(pdf, margin + 160, yPos - 2, certYes);
  pdf.text('Yes', margin + 168, yPos);
  drawCheckbox(pdf, margin + 185, yPos - 2, certNo);
  pdf.text('No', margin + 193, yPos);
  yPos += 15;

  // Complete Declaration section
  pdf.setFont('helvetica', 'bold');
  pdf.text('DECLARATION', pageWidth / 2, yPos, { align: 'center' });
  yPos += 8;
  
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(7);
  
  // Full declaration text from the image
  const declarationText = [
    'I HEREBY DECLARE that to the best of my knowledge and belief that I am a citizen of India and that I am not',
    'disqualified from registration in the electoral roll for the time being in force under the Representation of the People',
    'Act,1950 (43 of 1950) for the above mentioned part of the constituency. I am ordinarily resident at the above mentioned',
    'address. The information given above is true. I am aware that making any statement or declaration which is false and',
    'which I know or believe to be false or do not believe to be true, is punishable under Section 31 of Representation of',
    'the People Act,1950 (43 of 1950) with imprisonment for a term which may extend to one year or with fine or with both.'
  ];
  
  declarationText.forEach((line, index) => {
    pdf.text(line, margin + 5, yPos + (index * 3));
  });
  yPos += declarationText.length * 3 + 10;
  
  // Date, place and signature
  pdf.setFontSize(8);
  pdf.text('Date:', margin + 5, yPos);
  pdf.line(margin + 20, yPos + 2, margin + 60, yPos + 2);
  if (formData.declarationDate) {
    pdf.text(formData.declarationDate, margin + 22, yPos + 1);
  }
  
  pdf.text('Place:', margin + 70, yPos);
  pdf.line(margin + 85, yPos + 2, margin + 130, yPos + 2);
  if (formData.declarationPlace) {
    pdf.text(formData.declarationPlace, margin + 87, yPos + 1);
  }
  
  pdf.text('Signature of Applicant/Thumb Impression', contentWidth - 70, yPos);
  yPos += 15;
  
  // Accessibility instructions
  pdf.setFontSize(6);
  pdf.text('Accessibility Instructions:- In the light of provisions of Rights of Persons with Disabilities Act 2016 and Rights of Persons with', margin + 5, yPos);
  pdf.text('Disabilities Rules, 2017. In case of person with intellectual disability, autism, cerebral palsy and multiple disabilities the', margin + 5, yPos + 3);
  pdf.text('signature or left hand thumb impression of person with disability, or signature or left hand thumb impression of his/her', margin + 5, yPos + 6);
  pdf.text('legal guardian will be required.', margin + 5, yPos + 9);
  yPos += 15;
  
  pdf.text('* Submission of self-attested copy of mentioned documents will ensure speedy delivery of services.', margin + 5, yPos);
  yPos += 8;
  
  // Office use section
  pdf.setFontSize(8);
  pdf.rect(margin + 5, yPos, contentWidth - 10, 35);
  pdf.text('For office use:-', margin + 10, yPos + 5);
  pdf.text('Acknowledgment/Receipt for application', margin + 10, yPos + 10);
  pdf.line(contentWidth - 30, yPos + 12, contentWidth - 5, yPos + 12);
  
  pdf.text('Acknowledgment Number', margin + 10, yPos + 17);
  pdf.line(margin + 60, yPos + 19, margin + 120, yPos + 19);
  pdf.text('Date', margin + 130, yPos + 17);
  pdf.line(margin + 145, yPos + 19, contentWidth - 10, yPos + 19);
  
  pdf.text('Received the application in Form 8 of Shri/Smt./Ms.', margin + 10, yPos + 24);
  pdf.line(margin + 90, yPos + 26, contentWidth - 10, yPos + 26);
  
  pdf.text('Name/Signature of ERO/AERO/BLO', pageWidth / 2, yPos + 32, { align: 'center' });

  // Save the PDF
  pdf.save('voter-id-application.pdf');
};

export const generatePanCardPDF = async (formData: PanFormData, language: string = 'en'): Promise<void> => {
  // Translate form data to English for PDF
  const translatedData = await translateFormData(formData, language);
  
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 10;
  const contentWidth = pageWidth - (2 * margin);
  
  // Set font
  pdf.setFont('helvetica', 'normal');
  
  // Main border
  pdf.rect(margin, margin, contentWidth, pageHeight - 20);
  
  // Header section
  pdf.setFontSize(8);
  pdf.text('Application No:', pageWidth - 55, 18);
  pdf.rect(pageWidth - 40, 15, 30, 8);
  pdf.text('(For office use only)', pageWidth - 60, 30);
  
  // Income Tax Department Logo box
  const logoX = margin + 5;
  const logoY = 15;
  pdf.rect(logoX, logoY, 20, 20);
  
  // Add simple logo representation
  pdf.setFillColor(100, 100, 100);
  pdf.circle(logoX + 10, logoY + 10, 8, 'F');
  pdf.setFillColor(255, 255, 255);
  pdf.circle(logoX + 10, logoY + 10, 6, 'F');
  pdf.setFillColor(0, 0, 0);
  
  // Title section
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('APPLICATION FOR ALLOTMENT OF PERMANENT ACCOUNT NUMBER (PAN)', pageWidth / 2, 22, { align: 'center' });
  
  pdf.setFontSize(10);
  pdf.text('Form 49A', pageWidth / 2, 28, { align: 'center' });
  
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'normal');
  pdf.text('[Under section 139A of the Income Tax Act, 1961 and Rule 114 of the Income Tax Rules, 1962]', pageWidth / 2, 34, { align: 'center' });
  
  let yPos = 45;
  
  // Applicant Details Section
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'bold');
  pdf.text('1. APPLICANT DETAILS', margin + 5, yPos);
  yPos += 6;
  
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8);
  
  // Name section
  pdf.text('Name of the Applicant:', margin + 5, yPos);
  yPos += 5;
  
  // Title, Last name, First name, Middle name
  pdf.text('Title', margin + 5, yPos);
  drawPanBoxes(pdf, margin + 20, yPos - 3, translatedData.title, 4);
  
  pdf.text('Last Name/Surname', margin + 50, yPos);
  drawPanBoxes(pdf, margin + 90, yPos - 3, translatedData.lastName, 20);
  yPos += 8;
  
  pdf.text('First Name', margin + 5, yPos);
  drawPanBoxes(pdf, margin + 30, yPos - 3, translatedData.firstName, 20);
  
  pdf.text('Middle Name', margin + 100, yPos);
  drawPanBoxes(pdf, margin + 130, yPos - 3, translatedData.middleName, 20);
  yPos += 10;
  
  // Name to appear on PAN
  pdf.text('Name as you want it to appear on PAN card:', margin + 5, yPos);
  yPos += 5;
  drawPanBoxes(pdf, margin + 5, yPos - 3, translatedData.nameToAppear, 40);
  yPos += 10;
  
  // Father's Details
  pdf.text('Father\'s Name:', margin + 5, yPos);
  yPos += 5;
  
  pdf.text('Title', margin + 5, yPos);
  drawPanBoxes(pdf, margin + 20, yPos - 3, translatedData.fatherTitle, 8);
  
  pdf.text('Last Name/Surname', margin + 60, yPos);
  drawPanBoxes(pdf, margin + 100, yPos - 3, translatedData.fatherLastName, 20);
  yPos += 8;
  
  pdf.text('First Name', margin + 5, yPos);
  drawPanBoxes(pdf, margin + 30, yPos - 3, translatedData.fatherFirstName, 20);
  
  pdf.text('Middle Name', margin + 100, yPos);
  drawPanBoxes(pdf, margin + 130, yPos - 3, translatedData.fatherMiddleName, 20);
  yPos += 10;
  
  // Mother's Details
  pdf.text('Mother\'s Name:', margin + 5, yPos);
  yPos += 5;
  
  pdf.text('Title', margin + 5, yPos);
  drawPanBoxes(pdf, margin + 20, yPos - 3, translatedData.motherTitle, 8);
  
  pdf.text('Last Name/Surname', margin + 60, yPos);
  drawPanBoxes(pdf, margin + 100, yPos - 3, translatedData.motherLastName, 20);
  yPos += 8;
  
  pdf.text('First Name', margin + 5, yPos);
  drawPanBoxes(pdf, margin + 30, yPos - 3, translatedData.motherFirstName, 20);
  
  pdf.text('Middle Name', margin + 100, yPos);
  drawPanBoxes(pdf, margin + 130, yPos - 3, translatedData.motherMiddleName, 20);
  yPos += 10;
  
  // Date of Birth and Gender
  pdf.text('Date of Birth (DD/MM/YYYY):', margin + 5, yPos);
  drawPanBoxes(pdf, margin + 65, yPos - 3, translatedData.dateOfBirth, 10);
  
  pdf.text('Gender:', margin + 120, yPos);
  drawCheckbox(pdf, margin + 140, yPos - 2, translatedData.gender === 'Male');
  pdf.text('M', margin + 148, yPos);
  drawCheckbox(pdf, margin + 155, yPos - 2, translatedData.gender === 'Female');
  pdf.text('F', margin + 163, yPos);
  drawCheckbox(pdf, margin + 170, yPos - 2, translatedData.gender === 'Transgender');
  pdf.text('T', margin + 178, yPos);
  yPos += 15;
  
  // Check if we need a new page
  if (yPos > 200) {
    pdf.addPage();
    yPos = 20;
    pdf.rect(margin, margin, contentWidth, pageHeight - 20);
  }
  
  // Address Details Section
  pdf.setFont('helvetica', 'bold');
  pdf.text('2. ADDRESS DETAILS', margin + 5, yPos);
  yPos += 6;
  
  pdf.setFont('helvetica', 'normal');
  pdf.text('Residential Address:', margin + 5, yPos);
  yPos += 5;
  
  // Residential address fields
  pdf.text('Flat/Door/Block No.', margin + 5, yPos);
  drawPanBoxes(pdf, margin + 45, yPos - 3, translatedData.residentialAddress.flatNo, 15);
  
  pdf.text('Name of Premises/Building/Village', margin + 100, yPos);
  drawPanBoxes(pdf, margin + 160, yPos - 3, translatedData.residentialAddress.buildingName, 15);
  yPos += 8;
  
  pdf.text('Road/Street/Lane/Post Office', margin + 5, yPos);
  drawPanBoxes(pdf, margin + 60, yPos - 3, translatedData.residentialAddress.roadStreet, 25);
  yPos += 8;
  
  pdf.text('Area/Locality/Taluka/Sub-Division', margin + 5, yPos);
  drawPanBoxes(pdf, margin + 65, yPos - 3, translatedData.residentialAddress.area, 25);
  yPos += 8;
  
  pdf.text('Town/City/District', margin + 5, yPos);
  drawPanBoxes(pdf, margin + 45, yPos - 3, translatedData.residentialAddress.townCity, 20);
  
  pdf.text('State/UT', margin + 120, yPos);
  drawPanBoxes(pdf, margin + 140, yPos - 3, translatedData.residentialAddress.state, 15);
  yPos += 8;
  
  pdf.text('PIN Code', margin + 5, yPos);
  drawPanBoxes(pdf, margin + 25, yPos - 3, translatedData.residentialAddress.pinCode, 6);
  
  pdf.text('Country', margin + 60, yPos);
  drawPanBoxes(pdf, margin + 80, yPos - 3, translatedData.residentialAddress.country, 15);
  
  pdf.text('Phone', margin + 130, yPos);
  drawPanBoxes(pdf, margin + 150, yPos - 3, translatedData.residentialAddress.phone, 15);
  yPos += 12;
  
  // Communication Address
  drawCheckbox(pdf, margin + 5, yPos - 2, translatedData.communicationAddress.sameAsResidential);
  pdf.text('Communication address same as residential address', margin + 15, yPos);
  yPos += 8;
  
  if (!translatedData.communicationAddress.sameAsResidential) {
    pdf.text('Communication Address:', margin + 5, yPos);
    yPos += 5;
    
    // Communication address fields (similar to residential)
    pdf.text('Flat/Door/Block No.', margin + 5, yPos);
    drawPanBoxes(pdf, margin + 45, yPos - 3, translatedData.communicationAddress.flatNo, 15);
    
    pdf.text('Name of Premises/Building/Village', margin + 100, yPos);
    drawPanBoxes(pdf, margin + 160, yPos - 3, translatedData.communicationAddress.buildingName, 15);
    yPos += 8;
    
    // Add other communication address fields similarly
    yPos += 25; // Space for other fields
  }
  
  // Contact Details Section
  pdf.setFont('helvetica', 'bold');
  pdf.text('3. CONTACT DETAILS', margin + 5, yPos);
  yPos += 6;
  
  pdf.setFont('helvetica', 'normal');
  pdf.text('Email:', margin + 5, yPos);
  pdf.line(margin + 20, yPos + 2, margin + 100, yPos + 2);
  if (translatedData.email) {
    pdf.text(translatedData.email, margin + 22, yPos + 1);
  }
  
  pdf.text('Mobile:', margin + 110, yPos);
  drawMobileBoxes(pdf, margin + 130, yPos - 2, translatedData.mobile);
  yPos += 12;
  
  // Application Details Section
  pdf.setFont('helvetica', 'bold');
  pdf.text('4. APPLICATION DETAILS', margin + 5, yPos);
  yPos += 6;
  
  pdf.setFont('helvetica', 'normal');
  pdf.text('Status of Applicant:', margin + 5, yPos);
  yPos += 4;
  
  const statuses = ['Individual', 'Company', 'HUF (Hindu Undivided Family)', 'Partnership Firm', 'Trust', 'Others'];
  statuses.forEach((status, index) => {
    const col = index % 2;
    const row = Math.floor(index / 2);
    const x = col === 0 ? margin + 5 : margin + (contentWidth / 2);
    const y = yPos + (row * 5);
    
    drawCheckbox(pdf, x, y - 2, translatedData.applicantStatus === status);
    pdf.text(status, x + 10, y);
  });
  yPos += 20;
  
  // Source of Income
  pdf.text('Source of Income (Tick all applicable):', margin + 5, yPos);
  yPos += 5;
  
  const incomeTypes = [
    'Salary',
    'House Property', 
    'Business/Profession',
    'Capital Gains',
    'Other Sources',
    'Income from abroad',
    'No Income'
  ];
  
  incomeTypes.forEach((income, index) => {
    const col = index % 2;
    const row = Math.floor(index / 2);
    const x = col === 0 ? margin + 5 : margin + (contentWidth / 2);
    const y = yPos + (row * 5);
    
    drawCheckbox(pdf, x, y - 2, translatedData.sourceOfIncome?.includes(income) || false);
    pdf.text(income, x + 10, y);
  });
  yPos += 25;
  
  // Document Proofs Section
  pdf.setFont('helvetica', 'bold');
  pdf.text('5. DOCUMENT PROOFS', margin + 5, yPos);
  yPos += 6;
  
  pdf.setFont('helvetica', 'normal');
  pdf.text('Identity Proof: ' + translatedData.identityProof, margin + 5, yPos);
  yPos += 5;
  pdf.text('Address Proof: ' + translatedData.addressProof, margin + 5, yPos);
  yPos += 5;
  pdf.text('Date of Birth Proof: ' + translatedData.dateOfBirthProof, margin + 5, yPos);
  yPos += 15;
  
  // Check if we need a new page
  if (yPos > 200) {
    pdf.addPage();
    yPos = 20;
    pdf.rect(margin, margin, contentWidth, pageHeight - 20);
  }
  
  // Declaration Section
  pdf.setFont('helvetica', 'bold');
  pdf.text('DECLARATION', pageWidth / 2, yPos, { align: 'center' });
  yPos += 8;
  
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(7);
  
  const declarationText = [
    'I declare that the information given in this application is true and complete to the best of my knowledge and belief.',
    'I understand that if any information given in this application is found to be false, I may be prosecuted under the Income Tax Act, 1961.',
    'I also understand that my PAN will be allotted on the basis of the information provided in this application.',
    'I undertake to inform any change in the particulars of information given in this application.'
  ];
  
  declarationText.forEach((line, index) => {
    pdf.text(line, margin + 5, yPos + (index * 4));
  });
  yPos += declarationText.length * 4 + 10;
  
  // Date, place and signature
  pdf.setFontSize(8);
  pdf.text('Place:', margin + 5, yPos);
  pdf.line(margin + 20, yPos + 2, margin + 70, yPos + 2);
  if (translatedData.declarationPlace) {
    pdf.text(translatedData.declarationPlace, margin + 22, yPos + 1);
  }
  
  pdf.text('Date:', margin + 80, yPos);
  pdf.line(margin + 95, yPos + 2, margin + 130, yPos + 2);
  if (translatedData.declarationDate) {
    pdf.text(translatedData.declarationDate, margin + 97, yPos + 1);
  }
  
  pdf.text('Signature of Applicant', contentWidth - 50, yPos);
  yPos += 15;
  
  // For office use section
  pdf.setFontSize(8);
  pdf.rect(margin + 5, yPos, contentWidth - 10, 25);
  pdf.text('For Office Use Only:', margin + 10, yPos + 5);
  pdf.text('Receipt Number: ________________', margin + 10, yPos + 12);
  pdf.text('Date: ________________', margin + 10, yPos + 18);

  // Save the PDF
  pdf.save('pan-card-application.pdf');
};

// Helper functions for different box types
const drawSmallBoxes = (pdf: jsPDF, x: number, y: number, text: string, count: number) => {
  const boxSize = 4;
  for (let i = 0; i < count; i++) {
    const boxX = x + (i * (boxSize + 1));
    pdf.rect(boxX, y, boxSize, boxSize);
    if (i < text.length) {
      pdf.setFontSize(8);
      pdf.text(text[i].toUpperCase(), boxX + 1.5, y + 2.5);
    }
  }
};

const drawMediumBoxes = (pdf: jsPDF, x: number, y: number, text: string, count: number) => {
  const boxSize = 4;
  for (let i = 0; i < count; i++) {
    const boxX = x + (i * (boxSize + 0.5));
    pdf.rect(boxX, y, boxSize, boxSize);
    if (i < text.length) {
      pdf.setFontSize(8);
      pdf.text(text[i].toUpperCase(), boxX + 1.5, y + 2.5);
    }
  }
};

const drawLongBoxes = (pdf: jsPDF, x: number, y: number, text: string, count: number) => {
  const boxSize = 3.5;
  for (let i = 0; i < count; i++) {
    const boxX = x + (i * (boxSize + 0.3));
    pdf.rect(boxX, y, boxSize, boxSize);
    if (i < text.length) {
      pdf.setFontSize(7);
      pdf.text(text[i].toUpperCase(), boxX + 1, y + 2.5);
    }
  }
};

const drawMobileBoxes = (pdf: jsPDF, x: number, y: number, text: string) => {
  const boxSize = 4;
  for (let i = 0; i < 10; i++) {
    const boxX = x + (i * (boxSize + 0.5));
    pdf.rect(boxX, y, boxSize, boxSize);
    if (i < text.length) {
      pdf.setFontSize(8);
      pdf.text(text[i], boxX + 1.5, y + 2.5);
    }
  }
};

const drawAddressBoxes = (pdf: jsPDF, x: number, y: number, text: string, count: number) => {
  const boxSize = 3;
  for (let i = 0; i < count; i++) {
    const boxX = x + (i * (boxSize + 0.2));
    pdf.rect(boxX, y, boxSize, boxSize);
    if (i < text.length) {
      pdf.setFontSize(6);
      pdf.text(text[i].toUpperCase(), boxX + 0.8, y + 2.2);
    }
  }
};

const drawPanBoxes = (pdf: jsPDF, x: number, y: number, text: string, count: number) => {
  const boxSize = 3.5;
  for (let i = 0; i < count; i++) {
    const boxX = x + (i * (boxSize + 0.3));
    pdf.rect(boxX, y, boxSize, boxSize);
    if (i < text.length) {
      pdf.setFontSize(7);
      pdf.text(text[i].toUpperCase(), boxX + 0.8, y + 2.5);
    }
  }
};

// Enhanced checkbox with better tick marks
const drawCheckbox = (pdf: jsPDF, x: number, y: number, checked: boolean) => {
  pdf.rect(x, y, 3, 3);
  if (checked) {
    // Draw a clear tick mark
    pdf.setLineWidth(0.5);
    pdf.line(x + 0.5, y + 1.5, x + 1.2, y + 2.2);
    pdf.line(x + 1.2, y + 2.2, x + 2.5, y + 0.8);
    pdf.setLineWidth(0.2); // Reset line width
  }
};

// Simple translation mapping for common terms to English
const translationMap: Record<string, string> = {
  // Hindi to English
  'राज कुमार शर्मा': 'Raj Kumar Sharma',
  'दिल्ली': 'Delhi',
  'मुंबई': 'Mumbai',
  'गांधी नगर': 'Gandhi Nagar',
  'केंद्रीय दिल्ली': 'Central Delhi',
  'नई दिल्ली': 'New Delhi',
  'महाराष्ट्र': 'Maharashtra',
  'मुख्य सड़क': 'Main Street',
  'केंद्रीय डाकघर': 'Central Post Office',
  'नौकरी का स्थानांतरण': 'Job transfer',
  'विवाह': 'Marriage',
  
  // Bengali to English
  'কলকাতা': 'Kolkata',
  'ঢাকা': 'Dhaka',
  'চট্টগ্রাম': 'Chittagong',
  
  // Add more mappings as needed
};

export const translateToEnglish = async (text: string, sourceLang: string = 'auto'): Promise<string> => {
  if (!text || sourceLang === 'en') return text;
  
  // First check our local mapping
  if (translationMap[text]) {
    return translationMap[text];
  }
  
  // For numbers and basic alphanumeric, return as is
  if (/^[a-zA-Z0-9\s\-.,@]+$/.test(text)) {
    return text;
  }
  
  try {
    // For now, return the original text with a note that translation would happen here
    // In a real implementation, you would use Google Translate API or similar
    console.log(`Translation needed for: ${text} from ${sourceLang} to English`);
    return text; // Return original text for now
  } catch (error) {
    console.error('Translation failed:', error);
    return text; // Fallback to original text
  }
};*/}
import jsPDF from 'jspdf';
import { translateFormData } from './translationService';

export const generateRTIPDF = async (formData: RTIFormData, language: string = 'en'): Promise<void> => {
  // Translate form data to English for PDF
  const translatedData = await translateFormData(formData, language);
  
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 10;
  const contentWidth = pageWidth - (2 * margin);
  
  // Set font
  pdf.setFont('helvetica', 'normal');
  
  // Main border
  pdf.rect(margin, margin, contentWidth, pageHeight - 20);
  
  // Header section
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('APPLICATION UNDER RIGHT TO INFORMATION ACT, 2005', pageWidth / 2, 20, { align: 'center' });
  
  pdf.setFontSize(10);
  pdf.text('Form 1', pageWidth / 2, 26, { align: 'center' });
  
  pdf.setFontSize(8);
  pdf.text('Application No:', pageWidth - 55, 18);
  pdf.rect(pageWidth - 40, 15, 30, 8);
  pdf.text('(For office use only)', pageWidth - 60, 30);
  
  let yPos = 40;
  
  // Contact Details Section
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'bold');
  pdf.text('A. CONTACT DETAILS', margin + 5, yPos);
  yPos += 6;
  
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8);
  
  // Applicant Name
  pdf.text('1. Name of the Applicant:', margin + 5, yPos);
  yPos += 5;
  pdf.text(translatedData.applicantName, margin + 5, yPos);
  yPos += 6;
  
  // Mailing Address
  pdf.text('2. a) Mailing Address:', margin + 5, yPos);
  yPos += 5;
  const addressLines = pdf.splitTextToSize(translatedData.mailingAddress, contentWidth - 10);
  addressLines.forEach((line: string) => {
    pdf.text(line, margin + 5, yPos);
    yPos += 5;
  });
  
  // Telephone
  pdf.text('b) Telephone Number:', margin + 5, yPos);
  yPos += 5;
  pdf.text(translatedData.telephone, margin + 5, yPos);
  yPos += 6;
  
  // Email
  pdf.text('c) Email Address:', margin + 5, yPos);
  yPos += 5;
  pdf.text(translatedData.email, margin + 5, yPos);
  yPos += 6;
  
  // Indian Citizen
  pdf.text('3. Whether a citizen of India:', margin + 5, yPos);
  pdf.text(translatedData.isIndianCitizen ? 'Yes' : 'No', margin + 60, yPos);
  yPos += 10;
  
  // Information Sought Section
  pdf.setFont('helvetica', 'bold');
  pdf.text('B. DETAILS OF INFORMATION SOUGHT', margin + 5, yPos);
  yPos += 6;
  
  pdf.setFont('helvetica', 'normal');
  
  // Nature of information
  pdf.text('1. Nature of information sought:', margin + 5, yPos);
  pdf.text(translatedData.informationNature === 'lifeLiberty' ? 
    'Life & liberty of the person' : 'Other than life & liberty', margin + 60, yPos);
  yPos += 6;
  
  // Type of information
  pdf.text('2. Type of information required:', margin + 5, yPos);
  yPos += 5;
  const infoTypes = [];
  if (translatedData.informationType.copyDocuments) infoTypes.push('Copy of documents');
  if (translatedData.informationType.inspectRecords) infoTypes.push('Inspection of records');
  if (translatedData.informationType.sampleMaterial) infoTypes.push('Sample of material');
  if (translatedData.informationType.otherInfo) infoTypes.push('Other information');
  
  infoTypes.forEach((type, index) => {
    pdf.text(`${index + 1}. ${type}`, margin + 10, yPos);
    yPos += 5;
  });
  
  if (translatedData.informationType.otherInfo) {
    pdf.text('Description:', margin + 5, yPos);
    yPos += 5;
    const descLines = pdf.splitTextToSize(translatedData.otherInfoDescription, contentWidth - 10);
    descLines.forEach((line: string) => {
      pdf.text(line, margin + 10, yPos);
      yPos += 5;
    });
  }
  
  // Third Party Info
  pdf.text('3. a) Whether information sought relates to third party?', margin + 5, yPos);
  pdf.text(translatedData.relatesToThirdParty ? 'Yes' : 'No', margin + 100, yPos);
  yPos += 6;
  
  if (translatedData.relatesToThirdParty) {
    pdf.text('b) Third party name:', margin + 5, yPos);
    pdf.text(translatedData.thirdPartyName, margin + 40, yPos);
    yPos += 6;
    
    pdf.text('c) Third party address:', margin + 5, yPos);
    yPos += 5;
    const thirdPartyAddressLines = pdf.splitTextToSize(translatedData.thirdPartyAddress, contentWidth - 10);
    thirdPartyAddressLines.forEach((line: string) => {
      pdf.text(line, margin + 10, yPos);
      yPos += 5;
    });
  }
  
  // Particulars
  pdf.text('4. Specify the particulars of information required:', margin + 5, yPos);
  yPos += 6;
  translatedData.particulars.forEach((particular, index) => {
    if (particular) {
      pdf.text(`${index + 1}. ${particular}`, margin + 10, yPos);
      yPos += 5;
    }
  });
  
  // Time Period
  pdf.text('5. Time period for which information is required:', margin + 5, yPos);
  pdf.text(translatedData.timePeriod, margin + 80, yPos);
  yPos += 10;
  
  // BPL Category
  pdf.text('6. Whether applicant belongs to BPL category:', margin + 5, yPos);
  pdf.text(translatedData.isBPL ? 'Yes' : 'No', margin + 80, yPos);
  yPos += 6;
  
  if (translatedData.isBPL) {
    pdf.text('Proof of BPL attached:', margin + 5, yPos);
    pdf.text(translatedData.bplProofAttached ? 'Yes' : 'No', margin + 50, yPos);
    yPos += 6;
  }
  
  // Fee Paid
  pdf.text('7. Details of fee paid (Rs.):', margin + 5, yPos);
  pdf.text(translatedData.feePaid, margin + 60, yPos);
  yPos += 10;
  
  // Declaration
  pdf.setFont('helvetica', 'bold');
  pdf.text('DECLARATION', pageWidth / 2, yPos, { align: 'center' });
  yPos += 8;
  
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(7);
  
  const declarationText = [
    'I hereby declare that the information given in this application is true to the best of my knowledge and belief.',
    'I understand that if any information given in this application is found to be false, I may be liable for penalty under the RTI Act.'
  ];
  
  declarationText.forEach((line, index) => {
    pdf.text(line, margin + 5, yPos + (index * 4));
  });
  yPos += declarationText.length * 4 + 10;
  
  // Signature
  pdf.setFontSize(8);
  pdf.text('Signature of Applicant', contentWidth - 50, yPos);
  yPos += 15;
  
  // For office use section
  pdf.setFontSize(8);
  pdf.rect(margin + 5, yPos, contentWidth - 10, 25);
  pdf.text('For Office Use Only:', margin + 10, yPos + 5);
  pdf.text('Receipt Number: ________________', margin + 10, yPos + 12);
  pdf.text('Date: ________________', margin + 10, yPos + 18);

  // Save the PDF
  pdf.save('rti-application.pdf');
};

export const generateConsumerPDF = async (formData: ConsumerFormData, language: string = 'en'): Promise<void> => {
  // Translate form data to English for PDF
  const translatedData = await translateFormData(formData, language);
  
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 10;
  const contentWidth = pageWidth - (2 * margin);
  
  // Set font
  pdf.setFont('helvetica', 'normal');
  
  // Main border
  pdf.rect(margin, margin, contentWidth, pageHeight - 20);
  
  // Header section
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('FORM FOR COMPLAINT UNDER THE CONSUMER PROTECTION ACT, 1986', pageWidth / 2, 20, { align: 'center' });
  
  pdf.setFontSize(8);
  pdf.text('Complaint No:', pageWidth - 55, 18);
  pdf.rect(pageWidth - 40, 15, 30, 8);
  pdf.text('(For office use only)', pageWidth - 60, 30);
  
  let yPos = 40;
  
  // Case Details Section
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'bold');
  pdf.text('CASE DETAILS', margin + 5, yPos);
  yPos += 6;
  
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8);
  
  // Case Number
  pdf.text('In the complaint case no.', margin + 5, yPos);
  pdf.text(translatedData.caseNumber, margin + 50, yPos);
  yPos += 6;
  
  // Forum Type
  pdf.text('Before the Hon\'ble', margin + 5, yPos);
  const forumType = translatedData.forumType === 'district' ? 'District Forum' : 
                   translatedData.forumType === 'state' ? 'State Commission' : 'National Commission';
  pdf.text(forumType, margin + 40, yPos);
  yPos += 6;
  
  // Forum Name
  pdf.text('Forum Name:', margin + 5, yPos);
  pdf.text(translatedData.forumName, margin + 40, yPos);
  yPos += 6;
  
  // Complaint Number
  pdf.text('Complaint No.', margin + 5, yPos);
  pdf.text(translatedData.complaintNumber, margin + 40, yPos);
  yPos += 6;
  
  // Matter
  pdf.text('In the matter of', margin + 5, yPos);
  yPos += 5;
  const matterLines = pdf.splitTextToSize(translatedData.matter, contentWidth - 10);
  matterLines.forEach((line: string) => {
    pdf.text(line, margin + 5, yPos);
    yPos += 5;
  });
  yPos += 5;
  
  // Complainant Details Section
  pdf.setFont('helvetica', 'bold');
  pdf.text('COMPLAINANT DETAILS', margin + 5, yPos);
  yPos += 6;
  
  pdf.setFont('helvetica', 'normal');
  
  // Complainant Name & Address
  pdf.text('Name & address of complainant', margin + 5, yPos);
  yPos += 5;
  const complainantLines = pdf.splitTextToSize(translatedData.complainantName, contentWidth - 10);
  complainantLines.forEach((line: string) => {
    pdf.text(line, margin + 5, yPos);
    yPos += 5;
  });
  yPos += 5;
  
  // Opposite Party Details Section
  pdf.setFont('helvetica', 'bold');
  pdf.text('OPPOSITE PARTY DETAILS', margin + 5, yPos);
  yPos += 6;
  
  pdf.setFont('helvetica', 'normal');
  
  // Opposite Party Name & Address
  pdf.text('Name & address of opposite party', margin + 5, yPos);
  yPos += 5;
  const oppositePartyLines = pdf.splitTextToSize(translatedData.oppositePartyName, contentWidth - 10);
  oppositePartyLines.forEach((line: string) => {
    pdf.text(line, margin + 5, yPos);
    yPos += 5;
  });
  yPos += 5;
  
  // Complaint Details Section
  pdf.setFont('helvetica', 'bold');
  pdf.text('COMPLAINT DETAILS', margin + 5, yPos);
  yPos += 6;
  
  pdf.setFont('helvetica', 'normal');
  
  // Complaint Text
  pdf.text('Complaint text:', margin + 5, yPos);
  yPos += 5;
  const complaintLines = pdf.splitTextToSize(translatedData.complaintText, contentWidth - 10);
  complaintLines.forEach((line: string) => {
    pdf.text(line, margin + 5, yPos);
    yPos += 5;
  });
  yPos += 5;
  
  // Prayer Details Section
  pdf.setFont('helvetica', 'bold');
  pdf.text('PRAYER DETAILS', margin + 5, yPos);
  yPos += 6;
  
  pdf.setFont('helvetica', 'normal');
  
  // Refund Amount
  pdf.text('Refund amount (Rs.):', margin + 5, yPos);
  pdf.text(translatedData.refundAmount, margin + 50, yPos);
  yPos += 6;
  
  // Compensation Amount
  pdf.text('Compensation amount (Rs.):', margin + 5, yPos);
  pdf.text(translatedData.compensationAmount, margin + 60, yPos);
  yPos += 6;
  
  // Litigation Cost
  pdf.text('Cost of litigation:', margin + 5, yPos);
  pdf.text(translatedData.litigationCost ? 'Yes' : 'No', margin + 40, yPos);
  yPos += 10;
  
  // Verification Section
  pdf.setFont('helvetica', 'bold');
  pdf.text('VERIFICATION', margin + 5, yPos);
  yPos += 6;
  
  pdf.setFont('helvetica', 'normal');
  
  // Place
  pdf.text('Place:', margin + 5, yPos);
  pdf.text(translatedData.verificationPlace, margin + 25, yPos);
  yPos += 6;
  
  // Date
  pdf.text('Date:', margin + 5, yPos);
  pdf.text(translatedData.verificationDate, margin + 25, yPos);
  yPos += 10;
  
  // Annexures Section
  pdf.setFont('helvetica', 'bold');
  pdf.text('ANNEXURES', margin + 5, yPos);
  yPos += 6;
  
  pdf.setFont('helvetica', 'normal');
  
  translatedData.annexures.forEach((annexure, index) => {
    if (annexure) {
      pdf.text(`Annexure ${index + 1}: ${annexure}`, margin + 5, yPos);
      yPos += 6;
    }
  });
  yPos += 10;
  
  // Signature
  pdf.setFontSize(8);
  pdf.text('Signature of Complainant', contentWidth - 60, yPos);
  yPos += 15;
  
  // For office use section
  pdf.setFontSize(8);
  pdf.rect(margin + 5, yPos, contentWidth - 10, 25);
  pdf.text('For Office Use Only:', margin + 10, yPos + 5);
  pdf.text('Receipt Number: ________________', margin + 10, yPos + 12);
  pdf.text('Date: ________________', margin + 10, yPos + 18);

  // Save the PDF
  pdf.save('consumer-complaint.pdf');
};

// Add to the translateFormData function in pdfService.ts
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



interface VoterFormData {
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
  uploadedFiles?: File[];
  
  enableCorrectionSection?: boolean;
  enableReplacementSection?: boolean;
  enableDisabilitySection?: boolean;
  
  correctionFields?: {
    name: boolean;
    gender: boolean;
    dobAge: boolean;
    relationType: boolean;
    relationName: boolean;
    address: boolean;
    mobileNumber: boolean;
    photo: boolean;
  };
  correctParticulars?: string;
  documentName?: string;
  
  declarationDate?: string;
  declarationPlace?: string;
}

interface PanFormData {
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

export const generateVoterIdPDF = async (formData: VoterFormData, language: string = 'en'): Promise<void> => {
  // Translate form data to English for PDF
  const translatedData = await translateFormData(formData, language);
  
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 10;
  const contentWidth = pageWidth - (2 * margin);
  
  // Set font
  pdf.setFont('helvetica', 'normal');
  
  // Main border
  pdf.rect(margin, margin, contentWidth, pageHeight - 20);
  
  // Header section
  pdf.setFontSize(8);
  pdf.text('Date of Notification:', pageWidth - 55, 18);
  
  // ECI Logo box
  const logoX = margin + 5;
  const logoY = 15;
  pdf.rect(logoX, logoY, 20, 20);
  
  // Add Indian flag colors for ECI logo
  try {
    pdf.setFillColor(255, 165, 0); // Orange
    pdf.rect(logoX + 2, logoY + 2, 16, 5, 'F');
    pdf.setFillColor(255, 255, 255); // White
    pdf.rect(logoX + 2, logoY + 7, 16, 5, 'F');
    pdf.setFillColor(0, 128, 0); // Green
    pdf.rect(logoX + 2, logoY + 12, 16, 5, 'F');
    
    // Add Ashoka Chakra in center
    pdf.setFillColor(0, 0, 255); // Blue
    pdf.circle(logoX + 10, logoY + 9.5, 2, 'F');
    pdf.setFillColor(0, 0, 0); // Reset to black
  } catch (error) {
    console.log('Logo rendering failed, using placeholder');
  }
  
  // Title section
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('ELECTION COMMISSION OF INDIA', pageWidth / 2, 25, { align: 'center' });
  
  pdf.setFontSize(10);
  pdf.text('Form-8', pageWidth / 2, 32, { align: 'center' });
  
  // Form number box
  pdf.setFontSize(8);
  pdf.text('FORM No.', pageWidth - 40, 25);
  pdf.text('(To be filled by office)', pageWidth - 50, 30);
  pdf.rect(pageWidth - 35, 18, 25, 8);
  
  // Subtitle
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  const subtitle = 'Voter Application Form for Shifting of Residence/Correction of Entries in Existing Electoral';
  const subtitle2 = 'Roll/Replacement of EPIC/Marking of PwD';
  pdf.text(subtitle, pageWidth / 2, 40, { align: 'center' });
  pdf.text(subtitle2, pageWidth / 2, 46, { align: 'center' });
  
  pdf.setFontSize(7);
  pdf.text('(See Rules 13(3) and (26) of the Registration of Electors Rules, 1960)', pageWidth / 2, 52, { align: 'center' });
  
  let yPos = 60;
  
  // To section
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'normal');
  pdf.text('To,', margin + 5, yPos);
  yPos += 4;
  pdf.text('The Electoral Registration Officer,', margin + 5, yPos);
  yPos += 4;
  pdf.text('No. & Name of Assembly Constituency', margin + 5, yPos);
  yPos += 8;
  
  // Assembly constituency
  pdf.text('No.', margin + 5, yPos);
  drawSmallBoxes(pdf, margin + 15, yPos - 3, translatedData.assemblyConstituencyNo, 3);
  pdf.text('Name', margin + 35, yPos);
  drawLongBoxes(pdf, margin + 50, yPos - 3, translatedData.assemblyConstituencyName, 30);
  yPos += 8;
  
  pdf.text('Or No. & Name of Parliamentary Constituency@', margin + 5, yPos);
  pdf.text('No.', margin + 5, yPos + 5);
  drawSmallBoxes(pdf, margin + 15, yPos + 2, translatedData.parliamentaryConstituencyNo, 3);
  pdf.text('Name', margin + 35, yPos + 5);
  drawLongBoxes(pdf, margin + 50, yPos + 2, translatedData.parliamentaryConstituencyName, 30);
  yPos += 10;
  
  pdf.setFontSize(7);
  pdf.text('(@ only for Union Territories not having Legislative Assembly)', margin + 5, yPos);
  yPos += 10;
  
  // Name section
  pdf.setFontSize(8);
  pdf.text('(i) Name of the applicant', margin + 5, yPos);
  yPos += 5;
  drawLongBoxes(pdf, margin + 5, yPos, translatedData.applicantName, 50);
  yPos += 10;
  
  // EPIC section
  pdf.text('EPIC No.', margin + 5, yPos);
  yPos += 5;
  drawMediumBoxes(pdf, margin + 5, yPos, translatedData.epicNo, 10);
  yPos += 10;
  
  // Aadhaar section
  pdf.text('Aadhaar Details :- (Please tick the appropriate box)', margin + 5, yPos);
  yPos += 5;
  
  pdf.text('(a)', margin + 5, yPos);
  drawCheckbox(pdf, margin + 13, yPos - 2, !!translatedData.aadhaarNumber);
  pdf.text('Aadhaar Number', margin + 20, yPos);
  if (translatedData.aadhaarNumber) {
    drawMediumBoxes(pdf, margin + 55, yPos - 2, translatedData.aadhaarNumber, 12);
  } else {
    drawMediumBoxes(pdf, margin + 55, yPos - 2, '', 12);
  }
  pdf.text('or', contentWidth - 15, yPos);
  yPos += 5;
  
  pdf.text('(b)', margin + 5, yPos);
  drawCheckbox(pdf, margin + 13, yPos - 2, translatedData.noAadhaar);
  pdf.text('I am not able to furnish my Aadhaar Number because I don\'t have Aadhaar Number.', margin + 20, yPos);
  yPos += 10;
  
  // Mobile numbers
  pdf.text('Mobile No. of Self (or)', margin + 5, yPos);
  yPos += 5;
  drawMobileBoxes(pdf, margin + 5, yPos, translatedData.mobileNoSelf);
  yPos += 8;
  
  pdf.text('Mobile No. of Father/Mother/Any other relative (if available)', margin + 5, yPos);
  yPos += 5;
  drawMobileBoxes(pdf, margin + 5, yPos, translatedData.mobileNoRelative);
  yPos += 10;
  
  // Email sections
  pdf.text('Email Id of Self (or)', margin + 5, yPos);
  yPos += 2;
  pdf.line(margin + 5, yPos + 2, contentWidth - 60, yPos + 2);
  if (translatedData.emailSelf) {
    const emailText = pdf.splitTextToSize(translatedData.emailSelf, contentWidth - 70);
    pdf.text(emailText[0], margin + 5, yPos + 1);
  }
  yPos += 8;
  
  pdf.text('Email Id of Father/Mother/Any other relative (if available)', margin + 5, yPos);
  yPos += 2;
  pdf.line(margin + 5, yPos + 2, contentWidth - 60, yPos + 2);
  if (translatedData.emailRelative) {
    const emailText = pdf.splitTextToSize(translatedData.emailRelative, contentWidth - 70);
    pdf.text(emailText[0], margin + 5, yPos + 1);
  }
  yPos += 12;
  
  // Application type
  pdf.text('(ii) I submit application for    (Tick any one of the following)', margin + 5, yPos);
  yPos += 6;
  
  const appTypes = [
    'Shifting of Residence (or)',
    'Correction of Entries in Existing Electoral Roll (or)',
    'Issue of Replacement EPIC without correction (or)',
    'Request for marking as Person with Disability'
  ];
  
  appTypes.forEach((type, index) => {
    const isChecked = translatedData.applicationType === type.replace(' (or)', '') || 
                      translatedData.applicationType.includes(type.split(' ')[0]);
    pdf.text(`${index + 1}.`, margin + 5, yPos);
    drawCheckbox(pdf, margin + 13, yPos - 2, isChecked);
    pdf.text(type, margin + 20, yPos);
    yPos += 5;
  });
  
  yPos += 5;
  
  // Check if we need a new page
  if (yPos > 220) {
    pdf.addPage();
    yPos = 20;
    pdf.rect(margin, margin, contentWidth, pageHeight - 20);
  }
  
  // Section 1: Shifting of Residence
  pdf.setFont('helvetica', 'bold');
  pdf.text('1. Application for Shifting of Residence', margin + 5, yPos);
  yPos += 5;
  
  pdf.setFont('helvetica', 'normal');
  pdf.text('My name shall not be deleted from the previous address and shifted to the current', margin + 5, yPos);
  yPos += 4;
  pdf.text('address mentioned below. I request that my replacement EPIC may be issued to me to reflect', margin + 5, yPos);
  yPos += 4;
  pdf.text('my old EPIC.', margin + 5, yPos);
  yPos += 8;
  
  // Address section with proper layout
  pdf.text('Present', margin + 5, yPos);
  pdf.text('House/Building/Apartment No.', margin + 25, yPos);
  drawAddressBoxes(pdf, margin + 25, yPos + 3, translatedData.presentAddress.houseNo, 15);
  
  pdf.text('Street/Area/Locality/ Mohalla/Road', margin + 105, yPos);
  drawAddressBoxes(pdf, margin + 105, yPos + 3, translatedData.presentAddress.streetArea, 20);
  yPos += 12;
  
  pdf.text('Ordinary', margin + 5, yPos);
  pdf.text('Town/Village', margin + 25, yPos);
  drawAddressBoxes(pdf, margin + 25, yPos + 3, translatedData.presentAddress.townVillage, 15);
  
  pdf.text('Post Office', margin + 105, yPos);
  drawAddressBoxes(pdf, margin + 105, yPos + 3, translatedData.presentAddress.postOffice, 20);
  yPos += 12;
  
  pdf.text('Residence', margin + 5, yPos);
  pdf.text('PIN Code', margin + 25, yPos);
  drawAddressBoxes(pdf, margin + 25, yPos + 3, translatedData.presentAddress.pinCode, 6);
  
  pdf.text('Tehsil/Taluka/Mandal', margin + 105, yPos);
  drawAddressBoxes(pdf, margin + 105, yPos + 3, translatedData.presentAddress.tehsilTaluka, 15);
  yPos += 12;
  
  pdf.text('(Full Address)', margin + 5, yPos);
  pdf.text('District', margin + 25, yPos);
  drawAddressBoxes(pdf, margin + 25, yPos + 3, translatedData.presentAddress.district, 15);
  
  pdf.text('State/UT', margin + 105, yPos);
  drawAddressBoxes(pdf, margin + 105, yPos + 3, translatedData.presentAddress.stateUt, 15);
  yPos += 15;
  
  // Documents section
  const docText = 'Self-attested copy of address proof either in the name of applicant or anyone of the parents/spouse/adult child,';
  const docText2 = 'if already enrolled with as elector at the same address (Attach any one of the documents mentioned below *):-';
  pdf.text(docText, margin + 5, yPos);
  pdf.text(docText2, margin + 5, yPos + 4);
  yPos += 12;
  
  const documents = [
    'Water/Electricity/Gas connection Bill for that address (atleast 1 year)',
    'Current passbook of Nationalised/Scheduled Bank/Post Office',
    'Revenue Department\'s Land Owning records including Kisan Bahi',
    'Registered Rent Lease Deed (In case of tenant)',
    'Aadhaar Card',
    'Indian Passport',
    'Registered Sale Deed (In case of own house)'
  ];
  
  // Two column layout for documents
  documents.forEach((doc, index) => {
    const col = index % 2;
    const row = Math.floor(index / 2);
    const x = col === 0 ? margin + 5 : margin + (contentWidth / 2);
    const y = yPos + (row * 6);
    
    pdf.text(`${index + 1}.`, x, y);
    drawCheckbox(pdf, x + 8, y - 2, translatedData.documentsAvailable?.includes(doc) || false);
    
    const maxWidth = (contentWidth / 2) - 20;
    const wrappedText = pdf.splitTextToSize(doc, maxWidth);
    pdf.text(wrappedText[0], x + 15, y);
    if (wrappedText.length > 1) {
      pdf.text(wrappedText[1], x + 15, y + 3);
    }
  });
  
  yPos += 25;
  
  if (translatedData.otherDocument) {
    pdf.text('Any Other:- (Pl. Specify)', margin + 5, yPos);
    yPos += 3;
    pdf.line(margin + 50, yPos + 2, contentWidth - 5, yPos + 2);
    const otherDoc = pdf.splitTextToSize(translatedData.otherDocument, contentWidth - 60);
    pdf.text(otherDoc[0], margin + 52, yPos + 1);
    yPos += 8;
  }
  
  // Check if we need a new page for the next sections
  if (yPos > 200) {
    pdf.addPage();
    yPos = 20;
    pdf.rect(margin, margin, contentWidth, pageHeight - 20);
  }

  // Section 2: Correction of Entries
  pdf.setFont('helvetica', 'bold');
  pdf.text('2. Application for Correction of Entries in Existing Electoral Roll', margin + 5, yPos);
  yPos += 6;
  
  pdf.setFont('helvetica', 'normal');
  pdf.text('Please correct my following details in Electoral Roll/EPIC:', margin + 5, yPos);
  yPos += 4;
  pdf.text('(Maximum of 4 entries/particulars can be corrected)', margin + 5, yPos);
  yPos += 4;
  pdf.text('(Put a tick ☑ in appropriate box below.)', margin + 5, yPos);
  yPos += 4;
  pdf.text('Copy of self-attested Documentary Proof in support of claim to be attached.', margin + 5, yPos);
  yPos += 8;

  // Photo space on the right side
  pdf.rect(contentWidth - 50, yPos - 25, 45, 20);
  pdf.setFontSize(6);
  pdf.text('SPACE FOR PASTING ONE', contentWidth - 48, yPos - 20);
  pdf.text('RECENT PASSPORT SIZE', contentWidth - 48, yPos - 17);
  pdf.text('UNSIGNED COLOR', contentWidth - 48, yPos - 14);
  pdf.text('PHOTOGRAPH (4.5 CM X', contentWidth - 48, yPos - 11);
  pdf.text('3.5 CM) SHOWING', contentWidth - 48, yPos - 8);
  pdf.text('FRONTAL VIEW OF FULL', contentWidth - 48, yPos - 5);
  pdf.text('FACE WITH WHITE', contentWidth - 48, yPos - 2);
  pdf.text('BACKGROUND ONLY IF', contentWidth - 48, yPos + 1);
  pdf.text('PHOTO IS TO BE CHANGED)', contentWidth - 48, yPos + 4);
  pdf.setFontSize(8);

  // Correction fields grid (2x4 layout)
  const correctionFields = [
    { key: 'name', label: 'Name', num: '1.' },
    { key: 'gender', label: 'Gender', num: '2.' },
    { key: 'dobAge', label: 'DoB/Age', num: '3.' },
    { key: 'relationType', label: 'Relation Type', num: '4.' },
    { key: 'relationName', label: 'Relation Name', num: '5.' },
    { key: 'address', label: 'Address', num: '6.' },
    { key: 'mobileNumber', label: 'Mobile Number', num: '7.' },
    { key: 'photo', label: 'Photo', num: '8.' }
  ];

  // Draw correction fields in 2 columns
  correctionFields.forEach((field, index) => {
    const col = index % 2;
    const row = Math.floor(index / 2);
    const x = col === 0 ? margin + 5 : margin + (contentWidth / 2) - 60;
    const y = yPos + (row * 6);
    
    pdf.text(field.num, x, y);
    const isChecked = formData.enableCorrectionSection && 
                     formData.correctionFields?.[field.key as keyof typeof formData.correctionFields];
    drawCheckbox(pdf, x + 10, y - 2, isChecked || false);
    pdf.text(field.label, x + 18, y);
  });
  yPos += 30;

  pdf.text('The correct particulars in the entry to be corrected are as under:-', margin + 5, yPos);
  yPos += 6;

  // Correction particulars box
  pdf.rect(margin + 5, yPos, contentWidth - 60, 15);
  if (formData.enableCorrectionSection && formData.correctParticulars) {
    const correctedText = pdf.splitTextToSize(formData.correctParticulars, contentWidth - 70);
    correctedText.forEach((line: string, index: number) => {
      if (index < 3) { // Limit to 3 lines
        pdf.text(line, margin + 7, yPos + 4 + (index * 4));
      }
    });
  }
  yPos += 20;

  pdf.text('Name of Document in support of above claim attached', margin + 5, yPos);
  yPos += 6;
  pdf.rect(margin + 5, yPos, contentWidth - 10, 8);
  if (formData.enableCorrectionSection && formData.documentName) {
    const docNameText = pdf.splitTextToSize(formData.documentName, contentWidth - 20);
    pdf.text(docNameText[0], margin + 7, yPos + 4);
  }
  yPos += 15;

  // Section 3: Replacement EPIC
  pdf.setFont('helvetica', 'bold');
  pdf.text('3. Application for Issue of Replacement EPIC without correction', margin + 5, yPos);
  yPos += 6;
  
  pdf.setFont('helvetica', 'normal');
  pdf.text('I request that a replacement EPIC may be issued to me as my original EPIC is-', margin + 5, yPos);
  yPos += 4;
  pdf.text('(Put a tick in appropriate box.)', margin + 5, yPos);
  yPos += 8;

  // EPIC condition checkboxes
  const epicConditions = [
    { key: 'lost', label: 'Lost' },
    { key: 'destroyed', label: 'Destroyed due to reason beyond control like floods, fire, other natural disaster etc.' },
    { key: 'mutilated', label: 'Mutilated' }
  ];

  epicConditions.forEach((condition, index) => {
    const isChecked = formData.enableReplacementSection && 
                     formData.epicCondition?.[condition.key as keyof typeof formData.epicCondition];
    drawCheckbox(pdf, margin + 5, yPos - 2, isChecked || false);
    const conditionText = pdf.splitTextToSize(condition.label, contentWidth - 20);
    pdf.text(conditionText[0], margin + 13, yPos);
    if (conditionText.length > 1) {
      pdf.text(conditionText[1], margin + 13, yPos + 3);
      yPos += 3;
    }
    yPos += 5;
  });
  
  pdf.text('I hereby return my mutilated/ old EPIC (OR) I have attached copy of FIR/Police report for lost EPIC & I undertake to return', margin + 5, yPos);
  pdf.text('the earlier EPIC issued to me if the same is recovered at a later stage.', margin + 5, yPos + 4);
  yPos += 15;

  // Check if we need a new page
  if (yPos > 200) {
    pdf.addPage();
    yPos = 20;
    pdf.rect(margin, margin, contentWidth, pageHeight - 20);
  }

  // Section 4: Disability
  pdf.setFont('helvetica', 'bold');
  pdf.text('4. Application for Marking Person with Disability', margin + 5, yPos);
  yPos += 6;
  
  pdf.setFont('helvetica', 'normal');
  pdf.text('Category of disability (Tick the appropriate box for category of disability)', margin + 5, yPos);
  yPos += 8;

  const disabilityTypes = [
    { key: 'locomotive', label: 'Locomotive' },
    { key: 'visual', label: 'Visual' },
    { key: 'deafDumb', label: 'Deaf & Dumb' },
    { key: 'other', label: 'If any other (Give description)' }
  ];

  disabilityTypes.forEach((type, index) => {
    const col = index % 2;
    const row = Math.floor(index / 2);
    const x = col === 0 ? margin + 5 : margin + (contentWidth / 2);
    const y = yPos + (row * 6);
    
    const isChecked = formData.enableDisabilitySection && 
                     formData.disabilityType?.[type.key as keyof typeof formData.disabilityType];
    drawCheckbox(pdf, x, y - 2, isChecked || false);
    pdf.text(type.label, x + 10, y);
  });
  yPos += 15;

  pdf.text('Percentage of disability', margin + 5, yPos);
  const percentage = formData.enableDisabilitySection ? (formData.disabilityPercentage || '') : '';
  drawSmallBoxes(pdf, margin + 60, yPos - 3, percentage, 3);
  pdf.text('%, Certificate attached (Tick the appropriate box)', margin + 75, yPos);
  
  const certYes = formData.enableDisabilitySection && formData.certificateAttached;
  const certNo = formData.enableDisabilitySection && !formData.certificateAttached;
  drawCheckbox(pdf, margin + 160, yPos - 2, certYes);
  pdf.text('Yes', margin + 168, yPos);
  drawCheckbox(pdf, margin + 185, yPos - 2, certNo);
  pdf.text('No', margin + 193, yPos);
  yPos += 15;

  // Complete Declaration section
  pdf.setFont('helvetica', 'bold');
  pdf.text('DECLARATION', pageWidth / 2, yPos, { align: 'center' });
  yPos += 8;
  
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(7);
  
  // Full declaration text from the image
  const declarationText = [
    'I HEREBY DECLARE that to the best of my knowledge and belief that I am a citizen of India and that I am not',
    'disqualified from registration in the electoral roll for the time being in force under the Representation of the People',
    'Act,1950 (43 of 1950) for the above mentioned part of the constituency. I am ordinarily resident at the above mentioned',
    'address. The information given above is true. I am aware that making any statement or declaration which is false and',
    'which I know or believe to be false or do not believe to be true, is punishable under Section 31 of Representation of',
    'the People Act,1950 (43 of 1950) with imprisonment for a term which may extend to one year or with fine or with both.'
  ];
  
  declarationText.forEach((line, index) => {
    pdf.text(line, margin + 5, yPos + (index * 3));
  });
  yPos += declarationText.length * 3 + 10;
  
  // Date, place and signature
  pdf.setFontSize(8);
  pdf.text('Date:', margin + 5, yPos);
  pdf.line(margin + 20, yPos + 2, margin + 60, yPos + 2);
  if (formData.declarationDate) {
    pdf.text(formData.declarationDate, margin + 22, yPos + 1);
  }
  
  pdf.text('Place:', margin + 70, yPos);
  pdf.line(margin + 85, yPos + 2, margin + 130, yPos + 2);
  if (formData.declarationPlace) {
    pdf.text(formData.declarationPlace, margin + 87, yPos + 1);
  }
  
  pdf.text('Signature of Applicant/Thumb Impression', contentWidth - 70, yPos);
  yPos += 15;
  
  // Accessibility instructions
  pdf.setFontSize(6);
  pdf.text('Accessibility Instructions:- In the light of provisions of Rights of Persons with Disabilities Act 2016 and Rights of Persons with', margin + 5, yPos);
  pdf.text('Disabilities Rules, 2017. In case of person with intellectual disability, autism, cerebral palsy and multiple disabilities the', margin + 5, yPos + 3);
  pdf.text('signature or left hand thumb impression of person with disability, or signature or left hand thumb impression of his/her', margin + 5, yPos + 6);
  pdf.text('legal guardian will be required.', margin + 5, yPos + 9);
  yPos += 15;
  
  pdf.text('* Submission of self-attested copy of mentioned documents will ensure speedy delivery of services.', margin + 5, yPos);
  yPos += 8;
  
  // Office use section
  pdf.setFontSize(8);
  pdf.rect(margin + 5, yPos, contentWidth - 10, 35);
  pdf.text('For office use:-', margin + 10, yPos + 5);
  pdf.text('Acknowledgment/Receipt for application', margin + 10, yPos + 10);
  pdf.line(contentWidth - 30, yPos + 12, contentWidth - 5, yPos + 12);
  
  pdf.text('Acknowledgment Number', margin + 10, yPos + 17);
  pdf.line(margin + 60, yPos + 19, margin + 120, yPos + 19);
  pdf.text('Date', margin + 130, yPos + 17);
  pdf.line(margin + 145, yPos + 19, contentWidth - 10, yPos + 19);
  
  pdf.text('Received the application in Form 8 of Shri/Smt./Ms.', margin + 10, yPos + 24);
  pdf.line(margin + 90, yPos + 26, contentWidth - 10, yPos + 26);
  
  pdf.text('Name/Signature of ERO/AERO/BLO', pageWidth / 2, yPos + 32, { align: 'center' });

  // Save the PDF
  pdf.save('voter-id-application.pdf');
};

export const generatePanCardPDF = async (formData: PanFormData, language: string = 'en'): Promise<void> => {
  // Translate form data to English for PDF
  const translatedData = await translateFormData(formData, language);
  
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 10;
  const contentWidth = pageWidth - (2 * margin);
  
  // Set font
  pdf.setFont('helvetica', 'normal');
  
  // Main border
  pdf.rect(margin, margin, contentWidth, pageHeight - 20);
  
  // Header section
  pdf.setFontSize(8);
  pdf.text('Application No:', pageWidth - 55, 18);
  pdf.rect(pageWidth - 40, 15, 30, 8);
  pdf.text('(For office use only)', pageWidth - 60, 30);
  
  // Income Tax Department Logo box
  const logoX = margin + 5;
  const logoY = 15;
  pdf.rect(logoX, logoY, 20, 20);
  
  // Add simple logo representation
  pdf.setFillColor(100, 100, 100);
  pdf.circle(logoX + 10, logoY + 10, 8, 'F');
  pdf.setFillColor(255, 255, 255);
  pdf.circle(logoX + 10, logoY + 10, 6, 'F');
  pdf.setFillColor(0, 0, 0);
  
  // Title section
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('APPLICATION FOR ALLOTMENT OF PERMANENT ACCOUNT NUMBER (PAN)', pageWidth / 2, 22, { align: 'center' });
  
  pdf.setFontSize(10);
  pdf.text('Form 49A', pageWidth / 2, 28, { align: 'center' });
  
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'normal');
  pdf.text('[Under section 139A of the Income Tax Act, 1961 and Rule 114 of the Income Tax Rules, 1962]', pageWidth / 2, 34, { align: 'center' });
  
  let yPos = 45;
  
  // Applicant Details Section
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'bold');
  pdf.text('1. APPLICANT DETAILS', margin + 5, yPos);
  yPos += 6;
  
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8);
  
  // Name section
  pdf.text('Name of the Applicant:', margin + 5, yPos);
  yPos += 5;
  
  // Title, Last name, First name, Middle name
  pdf.text('Title', margin + 5, yPos);
  drawPanBoxes(pdf, margin + 20, yPos - 3, translatedData.title, 4);
  
  pdf.text('Last Name/Surname', margin + 50, yPos);
  drawPanBoxes(pdf, margin + 90, yPos - 3, translatedData.lastName, 20);
  yPos += 8;
  
  pdf.text('First Name', margin + 5, yPos);
  drawPanBoxes(pdf, margin + 30, yPos - 3, translatedData.firstName, 20);
  
  pdf.text('Middle Name', margin + 100, yPos);
  drawPanBoxes(pdf, margin + 130, yPos - 3, translatedData.middleName, 20);
  yPos += 10;
  
  // Name to appear on PAN
  pdf.text('Name as you want it to appear on PAN card:', margin + 5, yPos);
  yPos += 5;
  drawPanBoxes(pdf, margin + 5, yPos - 3, translatedData.nameToAppear, 40);
  yPos += 10;
  
  // Father's Details
  pdf.text('Father\'s Name:', margin + 5, yPos);
  yPos += 5;
  
  pdf.text('Title', margin + 5, yPos);
  drawPanBoxes(pdf, margin + 20, yPos - 3, translatedData.fatherTitle, 8);
  
  pdf.text('Last Name/Surname', margin + 60, yPos);
  drawPanBoxes(pdf, margin + 100, yPos - 3, translatedData.fatherLastName, 20);
  yPos += 8;
  
  pdf.text('First Name', margin + 5, yPos);
  drawPanBoxes(pdf, margin + 30, yPos - 3, translatedData.fatherFirstName, 20);
  
  pdf.text('Middle Name', margin + 100, yPos);
  drawPanBoxes(pdf, margin + 130, yPos - 3, translatedData.fatherMiddleName, 20);
  yPos += 10;
  
  // Mother's Details
  pdf.text('Mother\'s Name:', margin + 5, yPos);
  yPos += 5;
  
  pdf.text('Title', margin + 5, yPos);
  drawPanBoxes(pdf, margin + 20, yPos - 3, translatedData.motherTitle, 8);
  
  pdf.text('Last Name/Surname', margin + 60, yPos);
  drawPanBoxes(pdf, margin + 100, yPos - 3, translatedData.motherLastName, 20);
  yPos += 8;
  
  pdf.text('First Name', margin + 5, yPos);
  drawPanBoxes(pdf, margin + 30, yPos - 3, translatedData.motherFirstName, 20);
  
  pdf.text('Middle Name', margin + 100, yPos);
  drawPanBoxes(pdf, margin + 130, yPos - 3, translatedData.motherMiddleName, 20);
  yPos += 10;
  
  // Date of Birth and Gender
  pdf.text('Date of Birth (DD/MM/YYYY):', margin + 5, yPos);
  drawPanBoxes(pdf, margin + 65, yPos - 3, translatedData.dateOfBirth, 10);
  
  pdf.text('Gender:', margin + 120, yPos);
  drawCheckbox(pdf, margin + 140, yPos - 2, translatedData.gender === 'Male');
  pdf.text('M', margin + 148, yPos);
  drawCheckbox(pdf, margin + 155, yPos - 2, translatedData.gender === 'Female');
  pdf.text('F', margin + 163, yPos);
  drawCheckbox(pdf, margin + 170, yPos - 2, translatedData.gender === 'Transgender');
  pdf.text('T', margin + 178, yPos);
  yPos += 15;
  
  // Check if we need a new page
  if (yPos > 200) {
    pdf.addPage();
    yPos = 20;
    pdf.rect(margin, margin, contentWidth, pageHeight - 20);
  }
  
  // Address Details Section
  pdf.setFont('helvetica', 'bold');
  pdf.text('2. ADDRESS DETAILS', margin + 5, yPos);
  yPos += 6;
  
  pdf.setFont('helvetica', 'normal');
  pdf.text('Residential Address:', margin + 5, yPos);
  yPos += 5;
  
  // Residential address fields
  pdf.text('Flat/Door/Block No.', margin + 5, yPos);
  drawPanBoxes(pdf, margin + 45, yPos - 3, translatedData.residentialAddress.flatNo, 15);
  
  pdf.text('Name of Premises/Building/Village', margin + 100, yPos);
  drawPanBoxes(pdf, margin + 160, yPos - 3, translatedData.residentialAddress.buildingName, 15);
  yPos += 8;
  
  pdf.text('Road/Street/Lane/Post Office', margin + 5, yPos);
  drawPanBoxes(pdf, margin + 60, yPos - 3, translatedData.residentialAddress.roadStreet, 25);
  yPos += 8;
  
  pdf.text('Area/Locality/Taluka/Sub-Division', margin + 5, yPos);
  drawPanBoxes(pdf, margin + 65, yPos - 3, translatedData.residentialAddress.area, 25);
  yPos += 8;
  
  pdf.text('Town/City/District', margin + 5, yPos);
  drawPanBoxes(pdf, margin + 45, yPos - 3, translatedData.residentialAddress.townCity, 20);
  
  pdf.text('State/UT', margin + 120, yPos);
  drawPanBoxes(pdf, margin + 140, yPos - 3, translatedData.residentialAddress.state, 15);
  yPos += 8;
  
  pdf.text('PIN Code', margin + 5, yPos);
  drawPanBoxes(pdf, margin + 25, yPos - 3, translatedData.residentialAddress.pinCode, 6);
  
  pdf.text('Country', margin + 60, yPos);
  drawPanBoxes(pdf, margin + 80, yPos - 3, translatedData.residentialAddress.country, 15);
  
  pdf.text('Phone', margin + 130, yPos);
  drawPanBoxes(pdf, margin + 150, yPos - 3, translatedData.residentialAddress.phone, 15);
  yPos += 12;
  
  // Communication Address
  drawCheckbox(pdf, margin + 5, yPos - 2, translatedData.communicationAddress.sameAsResidential);
  pdf.text('Communication address same as residential address', margin + 15, yPos);
  yPos += 8;
  
  if (!translatedData.communicationAddress.sameAsResidential) {
    pdf.text('Communication Address:', margin + 5, yPos);
    yPos += 5;
    
    // Communication address fields (similar to residential)
    pdf.text('Flat/Door/Block No.', margin + 5, yPos);
    drawPanBoxes(pdf, margin + 45, yPos - 3, translatedData.communicationAddress.flatNo, 15);
    
    pdf.text('Name of Premises/Building/Village', margin + 100, yPos);
    drawPanBoxes(pdf, margin + 160, yPos - 3, translatedData.communicationAddress.buildingName, 15);
    yPos += 8;
    
    // Add other communication address fields similarly
    yPos += 25; // Space for other fields
  }
  
  // Contact Details Section
  pdf.setFont('helvetica', 'bold');
  pdf.text('3. CONTACT DETAILS', margin + 5, yPos);
  yPos += 6;
  
  pdf.setFont('helvetica', 'normal');
  pdf.text('Email:', margin + 5, yPos);
  pdf.line(margin + 20, yPos + 2, margin + 100, yPos + 2);
  if (translatedData.email) {
    pdf.text(translatedData.email, margin + 22, yPos + 1);
  }
  
  pdf.text('Mobile:', margin + 110, yPos);
  drawMobileBoxes(pdf, margin + 130, yPos - 2, translatedData.mobile);
  yPos += 12;
  
  // Application Details Section
  pdf.setFont('helvetica', 'bold');
  pdf.text('4. APPLICATION DETAILS', margin + 5, yPos);
  yPos += 6;
  
  pdf.setFont('helvetica', 'normal');
  pdf.text('Status of Applicant:', margin + 5, yPos);
  yPos += 4;
  
  const statuses = ['Individual', 'Company', 'HUF (Hindu Undivided Family)', 'Partnership Firm', 'Trust', 'Others'];
  statuses.forEach((status, index) => {
    const col = index % 2;
    const row = Math.floor(index / 2);
    const x = col === 0 ? margin + 5 : margin + (contentWidth / 2);
    const y = yPos + (row * 5);
    
    drawCheckbox(pdf, x, y - 2, translatedData.applicantStatus === status);
    pdf.text(status, x + 10, y);
  });
  yPos += 20;
  
  // Source of Income
  pdf.text('Source of Income (Tick all applicable):', margin + 5, yPos);
  yPos += 5;
  
  const incomeTypes = [
    'Salary',
    'House Property', 
    'Business/Profession',
    'Capital Gains',
    'Other Sources',
    'Income from abroad',
    'No Income'
  ];
  
  incomeTypes.forEach((income, index) => {
    const col = index % 2;
    const row = Math.floor(index / 2);
    const x = col === 0 ? margin + 5 : margin + (contentWidth / 2);
    const y = yPos + (row * 5);
    
    drawCheckbox(pdf, x, y - 2, translatedData.sourceOfIncome?.includes(income) || false);
    pdf.text(income, x + 10, y);
  });
  yPos += 25;
  
  // Document Proofs Section
  pdf.setFont('helvetica', 'bold');
  pdf.text('5. DOCUMENT PROOFS', margin + 5, yPos);
  yPos += 6;
  
  pdf.setFont('helvetica', 'normal');
  pdf.text('Identity Proof: ' + translatedData.identityProof, margin + 5, yPos);
  yPos += 5;
  pdf.text('Address Proof: ' + translatedData.addressProof, margin + 5, yPos);
  yPos += 5;
  pdf.text('Date of Birth Proof: ' + translatedData.dateOfBirthProof, margin + 5, yPos);
  yPos += 15;
  
  // Check if we need a new page
  if (yPos > 200) {
    pdf.addPage();
    yPos = 20;
    pdf.rect(margin, margin, contentWidth, pageHeight - 20);
  }
  
  // Declaration Section
  pdf.setFont('helvetica', 'bold');
  pdf.text('DECLARATION', pageWidth / 2, yPos, { align: 'center' });
  yPos += 8;
  
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(7);
  
  const declarationText = [
    'I declare that the information given in this application is true and complete to the best of my knowledge and belief.',
    'I understand that if any information given in this application is found to be false, I may be prosecuted under the Income Tax Act, 1961.',
    'I also understand that my PAN will be allotted on the basis of the information provided in this application.',
    'I undertake to inform any change in the particulars of information given in this application.'
  ];
  
  declarationText.forEach((line, index) => {
    pdf.text(line, margin + 5, yPos + (index * 4));
  });
  yPos += declarationText.length * 4 + 10;
  
  // Date, place and signature
  pdf.setFontSize(8);
  pdf.text('Place:', margin + 5, yPos);
  pdf.line(margin + 20, yPos + 2, margin + 70, yPos + 2);
  if (translatedData.declarationPlace) {
    pdf.text(translatedData.declarationPlace, margin + 22, yPos + 1);
  }
  
  pdf.text('Date:', margin + 80, yPos);
  pdf.line(margin + 95, yPos + 2, margin + 130, yPos + 2);
  if (translatedData.declarationDate) {
    pdf.text(translatedData.declarationDate, margin + 97, yPos + 1);
  }
  
  pdf.text('Signature of Applicant', contentWidth - 50, yPos);
  yPos += 15;
  
  // For office use section
  pdf.setFontSize(8);
  pdf.rect(margin + 5, yPos, contentWidth - 10, 25);
  pdf.text('For Office Use Only:', margin + 10, yPos + 5);
  pdf.text('Receipt Number: ________________', margin + 10, yPos + 12);
  pdf.text('Date: ________________', margin + 10, yPos + 18);

  // Save the PDF
  pdf.save('pan-card-application.pdf');
};

// Helper functions for different box types
const drawSmallBoxes = (pdf: jsPDF, x: number, y: number, text: string, count: number) => {
  const boxSize = 4;
  for (let i = 0; i < count; i++) {
    const boxX = x + (i * (boxSize + 1));
    pdf.rect(boxX, y, boxSize, boxSize);
    if (i < text.length) {
      pdf.setFontSize(8);
      pdf.text(text[i].toUpperCase(), boxX + 1.5, y + 2.5);
    }
  }
};

const drawMediumBoxes = (pdf: jsPDF, x: number, y: number, text: string, count: number) => {
  const boxSize = 4;
  for (let i = 0; i < count; i++) {
    const boxX = x + (i * (boxSize + 0.5));
    pdf.rect(boxX, y, boxSize, boxSize);
    if (i < text.length) {
      pdf.setFontSize(8);
      pdf.text(text[i].toUpperCase(), boxX + 1.5, y + 2.5);
    }
  }
};

const drawLongBoxes = (pdf: jsPDF, x: number, y: number, text: string, count: number) => {
  const boxSize = 3.5;
  for (let i = 0; i < count; i++) {
    const boxX = x + (i * (boxSize + 0.3));
    pdf.rect(boxX, y, boxSize, boxSize);
    if (i < text.length) {
      pdf.setFontSize(7);
      pdf.text(text[i].toUpperCase(), boxX + 1, y + 2.5);
    }
  }
};

const drawMobileBoxes = (pdf: jsPDF, x: number, y: number, text: string) => {
  const boxSize = 4;
  for (let i = 0; i < 10; i++) {
    const boxX = x + (i * (boxSize + 0.5));
    pdf.rect(boxX, y, boxSize, boxSize);
    if (i < text.length) {
      pdf.setFontSize(8);
      pdf.text(text[i], boxX + 1.5, y + 2.5);
    }
  }
};

const drawAddressBoxes = (pdf: jsPDF, x: number, y: number, text: string, count: number) => {
  const boxSize = 3;
  for (let i = 0; i < count; i++) {
    const boxX = x + (i * (boxSize + 0.2));
    pdf.rect(boxX, y, boxSize, boxSize);
    if (i < text.length) {
      pdf.setFontSize(6);
      pdf.text(text[i].toUpperCase(), boxX + 0.8, y + 2.2);
    }
  }
};

const drawPanBoxes = (pdf: jsPDF, x: number, y: number, text: string, count: number) => {
  const boxSize = 3.5;
  for (let i = 0; i < count; i++) {
    const boxX = x + (i * (boxSize + 0.3));
    pdf.rect(boxX, y, boxSize, boxSize);
    if (i < text.length) {
      pdf.setFontSize(7);
      pdf.text(text[i].toUpperCase(), boxX + 0.8, y + 2.5);
    }
  }
};

// Enhanced checkbox with better tick marks
const drawCheckbox = (pdf: jsPDF, x: number, y: number, checked: boolean) => {
  pdf.rect(x, y, 3, 3);
  if (checked) {
    // Draw a clear tick mark
    pdf.setLineWidth(0.5);
    pdf.line(x + 0.5, y + 1.5, x + 1.2, y + 2.2);
    pdf.line(x + 1.2, y + 2.2, x + 2.5, y + 0.8);
    pdf.setLineWidth(0.2); // Reset line width
  }
};

// Simple translation mapping for common terms to English
const translationMap: Record<string, string> = {
  // Hindi to English
  'राज कुमार शर्मा': 'Raj Kumar Sharma',
  'दिल्ली': 'Delhi',
  'मुंबई': 'Mumbai',
  'गांधी नगर': 'Gandhi Nagar',
  'केंद्रीय दिल्ली': 'Central Delhi',
  'नई दिल्ली': 'New Delhi',
  'महाराष्ट्र': 'Maharashtra',
  'मुख्य सड़क': 'Main Street',
  'केंद्रीय डाकघर': 'Central Post Office',
  'नौकरी का स्थानांतरण': 'Job transfer',
  'विवाह': 'Marriage',
  
  // Bengali to English
  'কলকাতা': 'Kolkata',
  'ঢাকা': 'Dhaka',
  'চট্টগ্রাম': 'Chittagong',
  
  // Add more mappings as needed
};

export const translateToEnglish = async (text: string, sourceLang: string = 'auto'): Promise<string> => {
  if (!text || sourceLang === 'en') return text;
  
  // First check our local mapping
  if (translationMap[text]) {
    return translationMap[text];
  }
  
  // For numbers and basic alphanumeric, return as is
  if (/^[a-zA-Z0-9\s\-.,@]+$/.test(text)) {
    return text;
  }
  
  try {
    // For now, return the original text with a note that translation would happen here
    // In a real implementation, you would use Google Translate API or similar
    console.log(`Translation needed for: ${text} from ${sourceLang} to English`);
    return text; // Return original text for now
  } catch (error) {
    console.error('Translation failed:', error);
    return text; // Fallback to original text
  }
};

