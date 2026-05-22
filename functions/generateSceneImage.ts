import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';
import OpenAI from 'npm:openai@4.47.1';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { scene_id, visual_prompt, style, aspect_ratio } = body;

    if (!scene_id || !visual_prompt) {
      return Response.json({ error: 'scene_id and visual_prompt are required' }, { status: 400 });
    }

    const openai = new OpenAI({ apiKey: Deno.env.get('OPENAI_API_KEY') });

    // Map style to image quality descriptors
    const styleEnhancers = {
      cinematic: 'cinematic photography, dramatic lighting, 8K, film grain, anamorphic lens, ultra detailed',
      animated: 'digital art, vibrant colors, smooth animation frame, studio quality, bold outlines',
      documentary: 'photojournalism, natural lighting, candid, realistic, high detail',
      commercial: 'commercial photography, clean, modern, professional studio lighting',
      social: 'vibrant, eye-catching, social media optimized, bold colors, trendy aesthetic',
      explainer: 'clean illustration, flat design, bright colors, infographic style'
    };

    const enhancer = styleEnhancers[style] || styleEnhancers.cinematic;
    const size = aspect_ratio === '9:16' ? '1024x1792' : aspect_ratio === '1:1' ? '1024x1024' : '1792x1024';

    const response = await openai.images.generate({
      model: 'gpt-image-1',
      prompt: `${visual_prompt}. Style: ${enhancer}. High quality, professional.`,
      size,
      quality: 'high',
      n: 1
    });

    const imageUrl = response.data[0].url || response.data[0].b64_json;
    let finalUrl = imageUrl;

    // If base64, we'd need to upload — for now use URL directly
    if (imageUrl && !imageUrl.startsWith('http')) {
      // Handle base64 if needed
      finalUrl = `data:image/png;base64,${imageUrl}`;
    }

    // Update scene with image
    await base44.entities.VideoScene.update(scene_id, {
      image_url: finalUrl,
      status: 'ready'
    });

    return Response.json({ success: true, image_url: finalUrl });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
