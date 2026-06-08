import express from 'express';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

import testElevenLabs from '../services/voice/test-elevenlabs.js';
import generateVoiceElevenLabs from '../services/voice/voice.service.js';
import generateVoiceSixtyDb from '../services/voice/sixtydb.service.js';
import generateVoiceMock from '../mocks/voice/voice.mock.js';

dotenv.config();

const router = express.Router();
const useMock = process.env.USE_MOCK === 'true';

function safeFilename(name, llm) {
  return `${name.toLowerCase().replace(/\s+/g, '-')}-${llm}`;
}

function getTtsProvider(tts) {
  const providers = {
    elevenlabs: {
      real: generateVoiceElevenLabs,
      voiceId: () => process.env.ELEVENLABS_VOICE_ID || '21m00Tcm4TlvDq8ikWAM',
    },
    '60db': {
      real: generateVoiceSixtyDb,
      voiceId: () => process.env.SIXTYDB_VOICE_ID || '',
    },
  };

  return providers[tts] || providers.elevenlabs;
}

router.post('/:llm', async (req, res) => {
  const { llm } = req.params;
  const { name } = req.body;

  const tts = (req.query.tts || 'elevenlabs').toLowerCase();
  const provider = getTtsProvider(tts);
  const voiceId = provider.voiceId();
  const fileName = safeFilename(name, llm);

  const audioPath = path.join(process.cwd(), 'storage', 'voices', `${fileName}.mp3`);
  const jsonPath = path.join(process.cwd(), 'storage', 'data', `${fileName}.json`);

  try {
    if (!fs.existsSync(jsonPath)) {
      return res.status(404).json({ success: false, error: 'Fichier JSON introuvable' });
    }

    const jsonContent = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
    const text = jsonContent.text;

    if (!text || typeof text !== 'string') {
      return res.status(400).json({ success: false, error: 'Champ "text" invalide dans le JSON' });
    }

    const outputDir = path.dirname(audioPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    if (useMock) {
      await generateVoiceMock(text, voiceId, audioPath);
      console.log('🟡 TTS MOCK -', audioPath);
    } else {
      await provider.real(text, voiceId, audioPath);
      console.log(`✅ TTS réel (${tts}) -`, audioPath);
    }

    const publicPath = `/storage/voices/${fileName}.mp3`;
    const fullUrl = `${req.protocol}://${req.get('host')}${publicPath}`;

    return res.json({
      success: true,
      data: fullUrl,
    });

  } catch (err) {
    console.error('❌ Erreur génération TTS :', err.message);

    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }

});

router.get('/health/tts', async (req, res) => {
  const voiceId = process.env.ELEVENLABS_VOICE_ID || '21m00Tcm4TlvDq8ikWAM';
  const result = await testElevenLabs(voiceId);
  res.json({ success: result });
});

export default router;
