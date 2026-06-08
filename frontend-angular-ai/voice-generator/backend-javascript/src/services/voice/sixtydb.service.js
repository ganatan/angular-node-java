
import axios from 'axios';
import fs from 'fs';

async function generateVoice(text, voiceId, outputPath) {
  const url = 'https://api.60db.ai/tts-synthesize';

  try {
    const body = {
      text: text,
      output_format: 'mp3',
    };

    if (voiceId) {
      body.voice_id = voiceId;
    }

    const response = await axios.post(
      url,
      body,
      {
        headers: {
          Authorization: `Bearer ${process.env.SIXTYDB_API_KEY}`,
          'Content-Type': 'application/json',
        },
      },
    );

    const { success, message, audio_base64 } = response.data || {};

    if (!success || !audio_base64) {
      throw new Error(message || 'Réponse 60db invalide (audio_base64 manquant)');
    }

    fs.writeFileSync(outputPath, Buffer.from(audio_base64, 'base64'));
    console.log('✅ Audio enregistré :', outputPath);

    return outputPath;

  } catch (error) {
    const status = error.response?.status;

    if (status) {
      console.error(`❌ Erreur 60db ${status}`);
    } else {
      console.error('❌ Erreur inconnue :', error.message);
    }

    throw error;
  }
}

export default generateVoice;
