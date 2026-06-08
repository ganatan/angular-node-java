# voice-generator

Generate a short script with an **LLM** (ChatGPT or Claude), then turn it into speech with a
**Text-to-Speech (TTS)** engine. Two TTS providers are supported and interchangeable at request time:

| Provider     | `tts` value   | Auth header                  | Response          | Notes                                   |
|--------------|---------------|------------------------------|-------------------|-----------------------------------------|
| ElevenLabs   | `elevenlabs`  | `xi-api-key: <key>`          | streamed MP3      | Default. `eleven_multilingual_v2` model |
| 60dB         | `60db`        | `Authorization: Bearer <key>`| JSON (base64 MP3) | `/tts-synthesize`, decoded to disk      |

---

## 🧩 Architecture

```
Angular frontend ──POST /api/llm/:type/:llm──► LLM service ──► storage/data/<name>-<llm>.json
   │                                                                     │
   └────POST /api/voice/:llm?tts=<provider>──► voice route ──reads JSON──┘
                                  │
                                  ▼
                 ElevenLabs OR 60dB adapter ──► storage/voices/<name>-<llm>.mp3
                                                        │
   ◄──── { success, data: <public MP3 url> } ──────────┘   (served from /storage)
```

The voice route does **not** receive the text directly — it reads the script JSON produced by the
LLM step, then hands the text to the selected TTS adapter.

---

## 🔗 API

| Method | Endpoint                              | Description                                            |
|--------|---------------------------------------|--------------------------------------------------------|
| POST   | `/api/llm/:type/:llm`                 | Generate a script (`type` = `biography`/`summary`)     |
| POST   | `/api/voice/:llm?tts=<provider>`      | Synthesize the script to MP3. `tts` defaults to `elevenlabs` |
| GET    | `/api/voice/health/tts`               | ElevenLabs connectivity/key check                      |

**Voice request example**

```bash
# ElevenLabs (default — ?tts can be omitted)
curl -X POST "http://localhost:3000/api/voice/chatgpt" \
  -H "Content-Type: application/json" -d '{"name":"Ridley Scott"}'

# 60dB
curl -X POST "http://localhost:3000/api/voice/chatgpt?tts=60db" \
  -H "Content-Type: application/json" -d '{"name":"Ridley Scott"}'
```

Provider selection lives in `backend-javascript/src/routes/voice.routes.js` (`getTtsProvider()`),
mirroring the LLM `getProvider()` pattern. Each adapter exposes the same
`generateVoice(text, voiceId, outputPath)` signature:

- `src/services/voice/voice.service.js` — ElevenLabs
- `src/services/voice/sixtydb.service.js` — 60dB

---

## 🛠 Configuration

`backend-javascript/.env` (see `.env.template`):

```env
# true => local mocks, no API calls | false => real provider APIs
USE_MOCK=true

# ElevenLabs
ELEVENLABS_API_KEY=eleven-your-key
ELEVENLABS_VOICE_ID=eleven-voice-id-xxxxxxxx

# 60dB (VOICE_ID optional — blank uses the 60dB system default voice)
SIXTYDB_API_KEY=sixtydb-your-key
SIXTYDB_VOICE_ID=
```

When `USE_MOCK=true`, the backend copies a pre-recorded sample instead of calling any provider, so
no API key is needed to demo the flow.

---

## 🎚 Frontend

In the Angular UI a **Voix (TTS)** dropdown selects the provider (`ElevenLabs` / `60dB`). The choice
is sent through as `?tts=` and the voice buttons / status messages relabel to the active provider.

> Note: in mock mode the bundled sample audio is ElevenLabs-style; switching to 60dB relabels the UI
> but plays the same sample. Real synthesis (`USE_MOCK=false`) uses the selected provider end to end.

---

## ⚙️ Quick start

```bash
# Backend
cd backend-javascript
npm install
npm start            # http://localhost:3000

# Frontend
cd frontend-angular
npm install
npm start            # http://localhost:4200
```
