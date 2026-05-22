import type { SupportedLanguage } from './aiTriage';

export async function speakWithAI(text: string, language: SupportedLanguage): Promise<boolean> {
  void text;
  void language;
  return false;
}

export async function speakWithAIUnavailable(text: string, language: SupportedLanguage): Promise<boolean> {
  try {
    const response = await fetch('/api/openai-speak', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text, language }),
    });

    if (!response.ok) return false;

    const audio = await response.blob();
    const url = URL.createObjectURL(audio);
    const player = new Audio(url);

    player.onended = () => URL.revokeObjectURL(url);
    await player.play();
    return true;
  } catch (error) {
    console.error('AI speech playback failed:', error);
    return false;
  }
}
