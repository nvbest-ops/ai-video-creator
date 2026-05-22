/**
 * videoApi — unified API gateway for the NOVA video creator frontend
 * Handles: createProject, listProjects, getProject, getScenes, updateProjectStatus
 */
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const { _action } = body;

    if (_action === 'createProject') {
      const project = await base44.entities.VideoProject.create({
        prompt: body.prompt,
        style: body.style || 'cinematic',
        aspect_ratio: body.aspect_ratio || '16:9',
        voiceover_enabled: body.voiceover_enabled ?? true,
        music_enabled: false,
        voice_id: body.voice_id || '21m00Tcm4TlvDq8ikWAM',
        status: 'draft',
        duration_seconds: 60
      });
      return Response.json({ success: true, id: project.id, project });
    }

    if (_action === 'listProjects') {
      const projects = await base44.entities.VideoProject.list({ sort: '-created_date', limit: 20 });
      return Response.json({ success: true, projects });
    }

    if (_action === 'getProject') {
      const project = await base44.entities.VideoProject.get(body.project_id);
      return Response.json({ success: true, project });
    }

    if (_action === 'getScenes') {
      const scenes = await base44.entities.VideoScene.filter(
        { project_id: body.project_id },
        { sort: 'scene_number' }
      );
      return Response.json({ success: true, scenes });
    }

    if (_action === 'updateProjectStatus') {
      await base44.entities.VideoProject.update(body.project_id, { status: body.status });
      return Response.json({ success: true });
    }

    return Response.json({ error: 'Unknown action: ' + _action }, { status: 400 });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
});
