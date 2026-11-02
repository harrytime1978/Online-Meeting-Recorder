# Meeting Recorder V3 — Windows source project

## Run and build on Windows

Install Node.js LTS. Unzip, open PowerShell in this folder, run `npm install`, `npm test`, `npm start`. Run `npm run build:win` to generate an **unsigned** NSIS installer under `dist/`. Internet is needed to install dependencies. `ffmpeg-static` is optional; if it cannot install, supply `FFMPEG_PATH` pointing to an FFmpeg executable or put FFmpeg on PATH.

## Features

- Capture screen or window, Windows loopback audio where supported, and optional microphone. Audio is mixed by Web Audio; avoid feedback by using headphones.
- 20-second **near-live** transcription chunks with `gpt-transcribe`; enabled explicitly at recording start and uploads audio during the meeting. Not true low-latency streaming; captions may lag or repeat, and pauses may not be reflected exactly.
- Long recording processing via FFmpeg Opus transcoding and 8-minute chunks (under typical 25 MB API upload limit). `gpt-4o-transcribe-diarize` supplies speaker labels but **is deprecated and scheduled for removal on February 26, 2027**. Speaker IDs can restart for each chunk and are not stable person identities.
- Bounded AI text batching generates concise meeting summaries/action items and bilingual *summary translations*. It does not provide guaranteed full-transcript translation for very long meetings.
- Searchable local archive, export to Markdown.

## Important limitations and privacy

This is a working source project, **not a production-certified Windows installer**. No Windows Teams/Zoom integration testing, Windows installer build, code signing, crash recovery testing, or compliance review was possible in this Linux environment. Capture system audio support varies by Windows version and Electron. Test Zoom and Teams with participants' permission using a short rehearsal. Screen recording on some systems does not capture application-protected audio.

Requires an OpenAI API key with billing; ChatGPT subscription alone does not grant API access. AI processing uploads audio and may generate charges. API key is stored in plaintext in the local profile: do not use shared PCs. App uses Electron 38 and SDK v6 semver dependencies—pin and audit before business deployment. Do not record without necessary consent. No automatic background meeting joining. If FFmpeg installation or Windows capture fails, diagnose before production use.

### Acceptance test checklist

1. Windows 11 + Teams: 60-second call, headphones, other participant's voice + mic. Playback both audio sources.
2. Windows 11 + Zoom: same check with different window/screenshare modes.
3. Run captions for 1 minute; confirm that about 20-second blocks eventually appear.
4. Record >60 minutes; verify saved WebM, post-process with FFmpeg, speaker text, summary, archive search.
5. Disconnect network, stop recording, verify recording remains local; reconnect and retry transcription.
6. Build installer, install/uninstall on clean Windows account, verify saving, signing/security alerts.

## Build without installing developer tools on your PC (GitHub Actions)

1. Create a new **private** GitHub repository, e.g. `meeting-recorder-windows`, with a `main` branch.
2. Extract this ZIP on your PC, then upload **the files and folders inside** `meeting-recorder-v3`, including the `.github/workflows` folder, into the repository. GitHub's web upload may not handle hidden folders or directory structure consistently; GitHub Desktop is an alternative for committing the extracted project. Do not upload the ZIP as the only file: GitHub Actions needs the project contents.
3. In the repository, click **Actions → Build Windows Installer → Run workflow**. You can also trigger it by pushing to `main`.
4. After a **successful** run, open that run and download the `MeetingRecorderV3-Windows-Installer` artifact, extract the artifact ZIP, and run the `.exe` on Windows.
5. This executable is **unsigned** and **not yet verified on Windows, Teams, or Zoom**; Windows SmartScreen may warn. Review the source and test on a disposable Windows account before trusting it with sensitive meetings.

This GitHub workflow does not include credentials or upload meeting recordings. Never commit API keys or private recordings into the repository.
