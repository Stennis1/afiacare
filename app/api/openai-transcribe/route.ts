import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const token = process.env.OPENAI_API_KEY;

  if (!token) {
    return NextResponse.json({ error: 'Missing OPENAI_API_KEY' }, { status: 500 });
  }

  try {
    const audioBuffer = await request.arrayBuffer();

    if (audioBuffer.byteLength === 0) {
      return NextResponse.json({ error: 'Missing audio' }, { status: 400 });
    }

    const selectedLanguage = request.headers.get('x-afia-language') || 'local language';
    const languagePrompt =
      selectedLanguage === 'Twi'
        ? 'The speaker is explaining pregnancy or maternal health symptoms in Twi/Akan. Transcribe the Twi clearly.'
        : selectedLanguage === 'Dagbani'
          ? 'The speaker is explaining pregnancy or maternal health symptoms in Dagbani. Transcribe the Dagbani clearly.'
          : selectedLanguage === 'Ewe'
            ? 'The speaker is explaining pregnancy or maternal health symptoms in Ewe. Transcribe the Ewe clearly.'
            : 'The speaker is explaining pregnancy or maternal health symptoms. Transcribe clearly.';

    const formData = new FormData();
    formData.append(
      'file',
      new File([audioBuffer], 'speech.webm', {
        type: request.headers.get('content-type') || 'audio/webm',
      }),
    );
    formData.append('model', 'gpt-4o-mini-transcribe');
    formData.append('prompt', languagePrompt);

    const openAIResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!openAIResponse.ok) {
      throw new Error(await openAIResponse.text());
    }

    const data = (await openAIResponse.json()) as { text?: string };

    return NextResponse.json({
      transcript: data.text?.trim() || '',
    });
  } catch (error) {
    console.error('OpenAI transcription failed:', error);
    return NextResponse.json(
      {
        error: 'Speech transcription is unavailable right now',
        transcript: '',
      },
      { status: 503 },
    );
  }
}
