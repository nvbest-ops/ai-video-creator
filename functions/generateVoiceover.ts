import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { scene_id, narration, voice_id } = body;

    if (!scene_id || !narration) {
      return Response.json({ error: 'scene_id and narration are required' }, { status: 400 });
    }

    const elevenLabsKey = Deno.env.get('ELEVENLABS_API_KEY');
    if (!elevenLabsKey) {
      return Response.json({ error: 'ElevenLabs API key not configured' }, { status: 500 });
    }

    // Default voice: Rachel (natural, professional)
    const selectedVoice = voice_id || '21m00Tcm4TlvDq8ikWAM';

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${selectedVoice}`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': elevenLabsKey,
          'Content-Type': 'application/json',
          'Accept': 'audio/mpeg'
        },
        body: JSON.stringify({
          text: narration,
          model_id: 'eleven_turbo_v2',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
            style: 0.3,
            use_speaker_boost: true
          }
        })
      }
    );

    if (!response.ok) {
      const err = await response.text();
      return Response.json({ error: `ElevenLabs error: ${err}` }, { status: 500 });
    }

    const audioBuffer = await response.arrayBuffer();
    const base64Audio = btoa(String.fromCharCode(...new Uint8Array(audioBuffer)));
    const audioDataUrl = `data:audio/mpeg;base64,${base64Audio}`;

    // Update scene with audio
    await base44.entities.VideoScene.update(scene_id, {
      audio_url: audioDataUrl
    });

    return Response.json({ success: true, audio_url: audioDataUrl });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
