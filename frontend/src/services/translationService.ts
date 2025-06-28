
{/*
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

export const translateFormData = async (formData: any, sourceLang: string): Promise<any> => {
  if (sourceLang === 'en') return formData;
  
  const translatedData = { ...formData };
  
  // Translate text fields
  const textFields = [
    'assemblyConstituencyName',
    'parliamentaryConstituencyName', 
    'applicantName',
    'shiftingReason',
    'otherDocument'
  ];
  
  for (const field of textFields) {
    if (translatedData[field]) {
      translatedData[field] = await translateToEnglish(translatedData[field], sourceLang);
    }
  }
  
  // Translate address fields
  if (translatedData.presentAddress) {
    const addressFields = [
      'houseNo',
      'streetArea', 
      'townVillage',
      'postOffice',
      'tehsilTaluka',
      'district',
      'stateUt'
    ];
    
    for (const field of addressFields) {
      if (translatedData.presentAddress[field]) {
        translatedData.presentAddress[field] = await translateToEnglish(
          translatedData.presentAddress[field], 
          sourceLang
        );
      }
    }
  }
  
  return translatedData;
};
*/}


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
    console.log(`Translation needed for: ${text} from ${sourceLang} to English`);
    return text; // Return original text for now
  } catch (error) {
    console.error('Translation failed:', error);
    return text; // Fallback to original text
  }
};

export const translateFormData = async (formData: any, sourceLang: string): Promise<any> => {
  if (sourceLang === 'en') return formData;

  const translatedData = { ...formData };

  // --- RTI Form ---
  if (translatedData.applicantName && translatedData.telephone !== undefined) {
    const textFields = [
      'applicantName', 'mailingAddress', 'telephone', 'email',
      'otherInfoDescription', 'thirdPartyName', 'thirdPartyAddress',
      'timePeriod', 'feePaid'
    ];

    for (const field of textFields) {
      if (translatedData[field]) {
        translatedData[field] = await translateToEnglish(translatedData[field], sourceLang);
      }
    }

    if (translatedData.particulars) {
      translatedData.particulars = await Promise.all(
        translatedData.particulars.map(async (particular: string) =>
          particular ? await translateToEnglish(particular, sourceLang) : particular
        )
      );
    }
  }

  // --- Consumer Form ---
  if (translatedData.complainantName && translatedData.complaintText !== undefined) {
    const textFields = [
      'caseNumber', 'forumName', 'complaintNumber', 'matter',
      'complainantName', 'complainantAddress', 'oppositePartyName',
      'oppositePartyAddress', 'complaintText', 'refundAmount',
      'compensationAmount', 'verificationPlace', 'verificationDate'
    ];

    for (const field of textFields) {
      if (translatedData[field]) {
        translatedData[field] = await translateToEnglish(translatedData[field], sourceLang);
      }
    }

    if (translatedData.annexures) {
      translatedData.annexures = await Promise.all(
        translatedData.annexures.map(async (annexure: string) =>
          annexure ? await translateToEnglish(annexure, sourceLang) : annexure
        )
      );
    }
  }

  // --- Voter ID Form ---
  if (translatedData.assemblyConstituencyName) {
    const textFields = [
      'assemblyConstituencyName',
      'parliamentaryConstituencyName',
      'applicantName',
      'shiftingReason',
      'otherDocument'
    ];

    for (const field of textFields) {
      if (translatedData[field]) {
        translatedData[field] = await translateToEnglish(translatedData[field], sourceLang);
      }
    }

    if (translatedData.presentAddress) {
      const addressFields = [
        'houseNo', 'streetArea', 'townVillage',
        'postOffice', 'tehsilTaluka', 'district', 'stateUt'
      ];

      for (const field of addressFields) {
        if (translatedData.presentAddress[field]) {
          translatedData.presentAddress[field] = await translateToEnglish(
            translatedData.presentAddress[field],
            sourceLang
          );
        }
      }
    }
  }

  // --- PAN Card Form ---
  if (translatedData.firstName && translatedData.nameToAppear !== undefined) {
    const personalFields = [
      'lastName', 'firstName', 'middleName', 'nameToAppear',
      'fatherLastName', 'fatherFirstName', 'fatherMiddleName',
      'motherLastName', 'motherFirstName', 'motherMiddleName',
      'declarationPlace'
    ];

    for (const field of personalFields) {
      if (translatedData[field]) {
        translatedData[field] = await translateToEnglish(translatedData[field], sourceLang);
      }
    }

    if (translatedData.residentialAddress) {
      const addressFields = [
        'flatNo', 'buildingName', 'roadStreet', 'area',
        'townCity', 'state', 'country'
      ];

      for (const field of addressFields) {
        if (translatedData.residentialAddress[field]) {
          translatedData.residentialAddress[field] = await translateToEnglish(
            translatedData.residentialAddress[field],
            sourceLang
          );
        }
      }
    }

    if (translatedData.communicationAddress && !translatedData.communicationAddress.sameAsResidential) {
      const addressFields = [
        'flatNo', 'buildingName', 'roadStreet', 'area',
        'townCity', 'state', 'country'
      ];

      for (const field of addressFields) {
        if (translatedData.communicationAddress[field]) {
          translatedData.communicationAddress[field] = await translateToEnglish(
            translatedData.communicationAddress[field],
            sourceLang
          );
        }
      }
    }
  }

  return translatedData;
};
