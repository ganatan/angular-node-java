import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import {
  AiService,
  ContentGenerationResponse,
  VoiceGenerationResponse,
} from './ai-service';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  imports: [FormsModule, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  name = 'ridley scott';
  type = 'biography';
  style = 'neutral';
  length = 'short';
  tts = 'elevenlabs';

  contentChatgpt = '';
  contentClaude = '';
  chatgptLoading = false;
  claudeLoading = false;
  chatgptError: string | null = null;
  claudeError: string | null = null;
  voiceChatgptError: string | null = null;
  voiceClaudeError: string | null = null;

  voiceChatgpt = '';
  voiceClaude = '';
  voiceChatgptLoading = false;
  voiceClaudeLoading = false;

  chatgptDuration = 0;
  claudeDuration = 0;
  chatgptProgress = 0;
  claudeProgress = 0;

  voiceChatgptDuration = 0;
  voiceClaudeDuration = 0;
  voiceChatgptProgress = 0;
  voiceClaudeProgress = 0;

  useMock = environment.useMock;

  styleOptions = [
    { value: 'casual', label: 'Décontracté' },
    { value: 'cinematic', label: 'Cinématographique' },
    { value: 'dialog', label: 'Dialogué' },
    { value: 'dramatic', label: 'Dramatique' },
    { value: 'emotional', label: 'Émotionnel' },
    { value: 'historical', label: 'Historique' },
    { value: 'humorous', label: 'Humoristique' },
    { value: 'inspirational', label: 'Inspirant' },
    { value: 'interview', label: 'Interview fictive' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'minimal', label: 'Minimaliste' },
    { value: 'narrative', label: 'Narratif' },
    { value: 'neutral', label: 'Neutre' },
    { value: 'poetic', label: 'Poétique' },
    { value: 'press', label: 'Journalistique' },
    { value: 'satirical', label: 'Satirique' },
    { value: 'scientific', label: 'Scientifique' },
    { value: 'technical', label: 'Technique' },
  ];

  ttsOptions = [
    { value: 'elevenlabs', label: 'ElevenLabs' },
    { value: '60db', label: '60dB' },
  ];

  get ttsLabel(): string {
    return this.ttsOptions.find((o) => o.value === this.tts)?.label || 'ElevenLabs';
  }

  private aiService = inject(AiService);

  toggleTheme() {
    const body = document.querySelector('body');
    if (body) {
      document.body.classList.toggle('dark-mode');
      document.documentElement.classList.toggle('dark-mode');
    }
  }

  loadContent(llm: 'chatgpt' | 'claude') {
    const start = performance.now();
    const interval = this.startProgress(llm);
    if (llm === 'chatgpt') {
      this.contentChatgpt = '';
      this.chatgptLoading = true;
      this.chatgptProgress = 0;
      this.voiceChatgpt = '';
      this.chatgptDuration = 0;
      this.voiceChatgptDuration = 0;
    } else {
      this.contentClaude = '';
      this.claudeLoading = true;
      this.claudeProgress = 0;
      this.voiceClaude = '';
      this.claudeDuration = 0;
      this.voiceClaudeDuration = 0;
    }

    this.aiService
      .generateContent(llm, this.name, this.length, this.style, this.type)
      .subscribe((response: ContentGenerationResponse) => {
        const duration = (performance.now() - start) / 1000;
        clearInterval(interval);
        if (llm === 'chatgpt') {
          this.chatgptError = response.success ? null : response.error || null;
          this.contentChatgpt = response.data;
          this.chatgptDuration = duration;
          this.chatgptLoading = false;
          this.chatgptProgress = 100;
        } else {
          this.claudeError = response.success ? null : response.error || null;
          this.contentClaude = response.data;
          this.claudeDuration = duration;
          this.claudeLoading = false;
          this.claudeProgress = 100;
        }
      });
  }

  resetContent(llm: 'chatgpt' | 'claude') {
    if (llm === 'chatgpt') {
      this.chatgptError = '';
      this.voiceChatgptError = '';
      this.contentChatgpt = '';
      this.chatgptDuration = 0;
      this.chatgptProgress = 0;
      this.voiceChatgpt = '';
      this.voiceChatgptDuration = 0;
    } else {
      this.claudeError = '';
      this.voiceClaudeError = '';
      this.contentClaude = '';
      this.claudeDuration = 0;
      this.claudeProgress = 0;
      this.voiceClaude = '';
      this.voiceClaudeDuration = 0;
    }
  }

  loadVoice(llm: 'chatgpt' | 'claude') {
    const start = performance.now();
    const interval = this.startVoiceProgress(llm);

    if (llm === 'chatgpt') {
      this.voiceChatgptLoading = true;
      this.voiceChatgpt = '';
      this.voiceChatgptDuration = 0;
      this.voiceChatgptProgress = 0;
    } else {
      this.voiceClaudeLoading = true;
      this.voiceClaude = '';
      this.voiceClaudeDuration = 0;
      this.voiceClaudeProgress = 0;
    }

    this.aiService
      .generateVoice(llm, this.name, this.tts)
      .subscribe((response: VoiceGenerationResponse) => {
        const duration = (performance.now() - start) / 1000;
        clearInterval(interval);

        const voiceUrl = response.success ? response.data : '';
        if (llm === 'chatgpt') {
          this.voiceChatgptError = response.success ? null : response.error || null;
          this.voiceChatgpt = voiceUrl;
          this.voiceChatgptDuration = duration;
          this.voiceChatgptLoading = false;
          this.voiceChatgptProgress = 100;
        } else {
          this.voiceClaudeError = response.success ? null : response.error || null;
          this.voiceClaude = voiceUrl;
          this.voiceClaudeDuration = duration;
          this.voiceClaudeLoading = false;
          this.voiceClaudeProgress = 100;
        }
      });
  }

  onStyleChange(value: string) {
    this.style = value;
    this.resetAll();
  }

  onLengthChange(value: string) {
    this.length = value;
    this.resetAll();
  }

  onTtsChange(value: string) {
    this.tts = value;
    this.voiceChatgpt = '';
    this.voiceClaude = '';
    this.voiceChatgptError = null;
    this.voiceClaudeError = null;
    this.voiceChatgptDuration = 0;
    this.voiceClaudeDuration = 0;
  }

  onTypeChange(value: string) {
    this.type = value;
    this.name = this.useMock
      ? value === 'biography' ? 'Ridley Scott' : 'Alien'
      : '';
    this.resetAll();
  }

  private resetAll() {
    this.contentChatgpt = '';
    this.contentClaude = '';
    this.chatgptDuration = 0;
    this.claudeDuration = 0;
    this.chatgptProgress = 0;
    this.claudeProgress = 0;
    this.voiceChatgpt = '';
    this.voiceClaude = '';
  }

  startProgress(llm: 'chatgpt' | 'claude') {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      if (progress >= 95) return;
      if (llm === 'chatgpt') this.chatgptProgress = progress;
      else this.claudeProgress = progress;
    }, 100);

    return interval;
  }


  startVoiceProgress(llm: 'chatgpt' | 'claude') {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      if (progress >= 95) return;
      if (llm === 'chatgpt') this.voiceChatgptProgress = progress;
      else this.voiceClaudeProgress = progress;
    }, 100);

    return interval;
  }
}
