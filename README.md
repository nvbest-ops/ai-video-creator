# 🎬 AI Video Creator

An AI-powered 60-second video creator that rivals Google Flow. Built on Base44 with GPT-4o, DALL-E, ElevenLabs, and more.

## Features

- 🤖 **AI Script Generation** — Enter a prompt, GPT-4o writes a full 60-second script broken into 8 scenes
- 🖼️ **Scene Image Generation** — DALL-E generates a cinematic image for each scene
- 🔊 **AI Voiceover** — ElevenLabs brings your script to life with natural-sounding voices
- 🎨 **Style Presets** — Cinematic, Animated, Documentary, Commercial, Social, Explainer
- 📐 **Aspect Ratios** — 16:9, 9:16 (vertical), 1:1 (square)
- 🎞️ **Scene Editor** — Review and edit each scene before generating
- 📤 **Export Ready** — 60-second videos ready for YouTube, TikTok, Instagram

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Platform | Base44 |
| Script AI | OpenAI GPT-4o |
| Image AI | OpenAI DALL-E / gpt-image-1 |
| Voiceover | ElevenLabs |
| Backend | Deno (Base44 Functions) |
| Database | Base44 Entities |

## Backend Functions

- generateVideoScript — Takes a prompt + style, returns 8-scene script with visual prompts
- generateSceneImage — Generates a DALL-E image for a given scene
- generateVoiceover — Converts scene narration to audio via ElevenLabs

## Data Models

### VideoProject
title, prompt, script, style (cinematic/animated/documentary/commercial/social/explainer), aspect_ratio (16:9/9:16/1:1), status (draft/generating/ready/failed), duration_seconds, final_video_url, voiceover_enabled, music_enabled, voice_id

### VideoScene
project_id, scene_number, description, narration, visual_prompt, duration_seconds, image_url, video_clip_url, audio_url, status (pending/generating/ready/failed)

## Setup

1. Add API keys in Base44 Secrets:
   - OPENAI_API_KEY from platform.openai.com
   - ELEVENLABS_API_KEY from elevenlabs.io (free tier available)

## Roadmap

- [ ] Runway ML / Kling video clip generation
- [ ] Background music generation
- [ ] Timeline drag-and-drop editor
- [ ] Export to MP4 with FFmpeg stitching
- [ ] Share to TikTok / Instagram / YouTube
- [ ] Brand kit support
- [ ] Version history
