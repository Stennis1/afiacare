import type { SupportedLanguage } from './aiTriage';

export async function transcribeLocalLanguageAudio(
  audio: Blob,
  language: SupportedLanguage,
): Promise<string | null> {
  try {
    const response = await fetch('/api/openai-transcribe', {
      method: 'POST',
      headers: {
        'Content-Type': audio.type || 'audio/webm',
        'X-Afia-Language': language,
      },
      body: audio,
    });

    if (!response.ok) return null;

    const data = (await response.json()) as { transcript?: string };
    return data.transcript?.trim() || null;
  } catch (error) {
    console.error('Local language audio transcription failed:', error);
    return null;
  }
}
