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
      cinematic: 'dramatic, high-production cinematic visuals with rich lighting and depth',
      animated: 'vibrant, animated style with bold colors and smooth motion',
      documentary: 'realistic, journalistic style with natural lighting',
      commercial: 'polished, professional commercial style, clean and modern',
      social: 'trendy, fast-paced social media style optimized for engagement',
      explainer: 'clear, educational style with clean visuals and simple graphics'
    };

    const systemPrompt = `You are an expert video director and scriptwriter. Create a 60-second video broken into exactly 8 scenes (each ~7-8 seconds). 
Style: ${styleGuide[style] || styleGuide.cinematic}.
Aspect ratio: ${aspect_ratio || '16:9'}.

Return a JSON object with this exact structure:
{
  "title": "Short catchy title",
  "full_script": "Complete narration script",
  "scenes": [
    {
      "scene_number": 1,
      "description": "What happens visually in this scene",
      "narration": "Exact words spoken in this scene",
      "visual_prompt": "Detailed AI image generation prompt for this scene",
      "duration_seconds": 7
    }
  ]
}

Make it compelling, professional, and optimized for the ${style || 'cinematic'} style. Total narration should fit within 60 seconds when spoken.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Create a 60-second video about: ${prompt}` }
      ],
      response_format: { type: 'json_object' }
    });

    const scriptData = JSON.parse(completion.choices[0].message.content);

    // Update the project with title and script
    if (project_id) {
      await base44.entities.VideoProject.update(project_id, {
        title: scriptData.title,
        script: scriptData.full_script,
        status: 'generating',
        duration_seconds: 60
      });

      // Create scene records
      const scenePromises = scriptData.scenes.map(scene =>
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
