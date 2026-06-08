# config\ai-services.js

```js
const aiServices = {
  llm: [
    { type: 'chatgpt', label: 'OpenAI', purpose: 'Text generation, summarization, Q&A, code completion' },
    { type: 'claude', label: 'Claude', purpose: 'Structured reasoning, content writing, safe dialogue' },
    { type: 'gemini', label: 'Gemini', purpose: 'Multimodal LLM for text and image understanding' },
    { type: 'mistral', label: 'Mistral', purpose: 'Open-source LLM for high-performance text/code tasks' },
    { type: 'perplexity', label: 'Perplexity AI', purpose: 'Web-augmented search engine powered by LLM' },
    { type: 'deepseek', label: 'DeepSeek', purpose: 'Code generation, explanation and debugging assistant' },
  ],

  tts: [
    { type: 'elevenlabs', label: 'ElevenLabs', purpose: 'High-quality voice synthesis from text, multilingual' },
    { type: '60db', label: '60dB', purpose: 'Voice synthesis and cloning from text, multilingual' },
  ],

  avatar: [
    { type: 'did', label: 'D-ID', purpose: 'Animate a still photo with audio or text' },
    { type: 'heygen', label: 'Heygen', purpose: 'Generate talking avatar videos from script' },
    { type: 'jogg', label: 'Jogg AI', purpose: 'Create realistic talking avatars from custom photos' },
  ],

  image: [
    { type: 'leonardo', label: 'Leonardo AI', purpose: 'Create illustrations, concept art and product visuals' },
    { type: 'midjourney', label: 'MidJourney', purpose: 'Stylized artistic image generation from prompt' },
    { type: 'kling', label: 'Kling AI', purpose: 'Future video generation from text (Sora-level quality)' },
  ],

  agent: [
    { type: 'langchain', label: 'LangChain', purpose: 'Chain tools, memory, and LLMs into intelligent agents' },
    { type: 'llamaindex', label: 'LlamaIndex', purpose: 'Connect LLMs to data sources, documents, and files' },
  ],

  music: [
    { type: 'suno', label: 'Suno AI', purpose: 'Generate full songs with lyrics, melody, and vocals' },
    { type: 'udio', label: 'Udio AI', purpose: 'Generate high-quality vocal music tracks from prompt' },
  ],
};

export default aiServices;

```
