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
    const { prompt, style, aspect_ratio, project_id } = body;

    if (!prompt) {
      return Response.json({ error: 'prompt is required' }, { status: 400 });
    }

    const openai = new OpenAI({ apiKey: Deno.env.get('OPENAI_API_KEY') });

    const styleGuide = {
      cinematic: 'dramatic, high-production cinematic visuals with rich lighting, depth of field, and film-quality storytelling',
      animated: 'vibrant, animated style with bold colors, smooth motion, and expressive characters',
      documentary: 'realistic, journalistic style with natural lighting, authentic feel, and compelling narrative',
      commercial: 'polished, professional commercial style — clean, modern, aspirational and persuasive',
      social: 'trendy, fast-paced social media style — punchy, scroll-stopping, optimized for maximum engagement',
      explainer: 'clear, educational style with clean visuals, simple graphics and step-by-step clarity'
    };

    const systemPrompt = `You are NOVA — an elite AI Video Content Director and Superagent specializing in 60-second viral video creation. You combine the creative vision of a world-class director with the strategic mind of a content marketer.

Your mission: Transform any topic into a compelling, professionally structured 60-second video that captivates audiences from the first frame to the last.

VIDEO SPECS:
- Total duration: exactly 60 seconds
- Structure: exactly 8 scenes, each 7-8 seconds
- Style: ${styleGuide[style] || styleGuide.cinematic}
- Aspect ratio: ${aspect_ratio || '16:9'}

YOUR CREATIVE PRINCIPLES:
1. HOOK in scene 1 — grab attention in the first 3 seconds
2. BUILD tension or curiosity through scenes 2-5
3. DELIVER the payoff or key message in scenes 6-7
4. END with a strong call-to-action or memorable closing in scene 8
5. Every narration line must be punchy, vivid, and perfectly timed to ~7 seconds when spoken aloud
6. Visual prompts must be hyper-specific — describe lighting, camera angle, subject, mood, color palette
7. Narration and visuals must work in perfect harmony

Return a JSON object with this EXACT structure (no extra fields):
{
  "title": "Short catchy title (max 8 words)",
  "full_script": "Complete flowing narration script as one paragraph",
  "hook": "One-line description of the opening hook",
  "scenes": [
    {
      "scene_number": 1,
      "description": "Detailed visual description of what happens on screen",
      "narration": "Exact spoken words — punchy, ~15-25 words, fits 7 seconds",
      "visual_prompt": "Hyper-detailed DALL-E prompt: subject, setting, lighting, camera angle, mood, color palette, style",
      "duration_seconds": 7
    }
  ]
}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Create a powerful 60-second ${style || 'cinematic'} video about: ${prompt}` }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.85
    });

    const scriptData = JSON.parse(completion.choices[0].message.content);

    if (project_id) {
      await base44.entities.VideoProject.update(project_id, {
        title: scriptData.title,
        script: scriptData.full_script,
        status: 'generating',
        duration_seconds: 60
      });

      const scenePromises = scriptData.scenes.map((scene: any) =>
        base44.entities.VideoScene.create({
          project_id,
          scene_number: scene.scene_number,
          description: scene.description,
          narration: scene.narration,
          visual_prompt: scene.visual_prompt,
          duration_seconds: scene.duration_seconds || 7,
          status: 'pending'
        })
      );
      await Promise.all(scenePromises);
    }

    return Response.json({ success: true, script: scriptData });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
