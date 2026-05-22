export const runtime = 'nodejs';

export async function POST(request: Request) {
  const token = process.env.OPENAI_API_KEY;

  if (!token) {
    return Response.json({ error: 'Missing OPENAI_API_KEY' }, { status: 500 });
  }

  try {
    const { text, language } = (await request.json()) as {
      text?: string;
      language?: string;
    };

    if (!text?.trim()) {
      return Response.json({ error: 'Missing text' }, { status: 400 });
    }

    const instructions =
      language === 'Twi'
        ? 'Speak this in clear Ghanaian Twi/Akan pronunciation. Use a calm community health worker tone. Do not translate it to English.'
        : language === 'Dagbani'
          ? 'Speak this in clear Dagbani pronunciation. Use a calm community health worker tone. Do not translate it to English.'
          : language === 'Ewe'
            ? 'Speak this in clear Ewe pronunciation. Use a calm community health worker tone. Do not translate it to English.'
            : 'Speak clearly and calmly as a community health worker.';

    const openAIResponse = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini-tts',
        voice: 'alloy',
        input: text,
        instructions,
        response_format: 'mp3',
      }),
    });

    if (!openAIResponse.ok) {
      throw new Error(await openAIResponse.text());
    }

    const audio = await openAIResponse.arrayBuffer();

    return new Response(audio, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('OpenAI speech failed:', error);
    return Response.json({ error: 'Speech service unavailable' }, { status: 503 });
  }
}
