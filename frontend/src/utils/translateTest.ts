import axios from 'axios';

export async function translateText(text: string, targetLang: string) {
  try {
    const response = await axios.post('https://libretranslate.de/translate', {
      q: text,
      source: 'auto',
      target: targetLang,
      format: 'text'
    }, {
      headers: { 'accept': 'application/json' }
    });
    return response.data.translatedText;
  } catch (error) {
    console.error('Translation error:', error);
    return text; // fallback to original text
  }
}