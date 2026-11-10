# Lab 5 — The Sound of the Moon

A simple interactive soundscape built with **HTML, CSS, and JavaScript**.

## What it does

- Plays an **82.5-second** nighttime field recording (Part A).
- Shows a moon that **responds to the loudness of the audio** via the Web Audio API (Part B).
- Adds twinkling stars that randomly drift around the sky and scatter when the moon is clicked.
- Lets visitors play/pause, seek, and adjust volume. Clicking the moon makes it noticeably brighter/larger, triggers a light ripple, and jumps the audio to a random moment.

## Files

- `index.html`: webpage and HTML5 audio player
- `style.css`: layout, stars, and animations
- `script.js`: controls and audio-reactive moon
- `assets/moon.png`: supplied transparent moon image
- `assets/night-crickets.mp3`: MP3 converted from the supplied Freesound WAV

## Run

Open `index.html` in a browser or deploy the entire folder to GitHub Pages. If audio playback is restricted when opening a local file, run a simple local server (`python -m http.server 8000`) and open http://localhost:8000.

## Source and license

**Audio:** "Night Crickets Ambience on Rural Property" by OwlStorm on Freesound: https://freesound.org/people/OwlStorm/sounds/320145/ — listed as CC0 (please verify the license on the source page before submission). The original WAV is from a rural property in Australia; this webpage uses it as inspiration for an imagined moonlit park, not as a recording of the author's hometown.

**Moon image:** Supplied by the project author. Ensure you have the right to include it in your public repository.

## Assignment note

The assignment specifies a hometown or another meaningful place. **Before submitting, personalize the on-page description to explain why the imagined park or nighttime setting is personally meaningful to you.** The current text is a generic placeholder and should not imply you personally recorded the provided audio.

## GitHub submission

1. Create a repository and upload the entire project, preserving folder names.
2. Commit class work using the message **Class Progress** if required for the checkpoint.
3. In **Settings → Pages**, select *Deploy from a branch*, the `main` branch, and `/ (root)`.
4. Submit the repository URL and live GitHub Pages URL.

## Version 2 changes

- Increased the volume-reactive moon pulse so subtle field-recording sounds are visible.
- The moon toggles a distinct moonlight mode and displays a ripple on each click.
- Moon clicks seek to a random point in the recording (and start playback if paused).
- Stars drift to fresh random destinations every 7 seconds and scatter when the moon is clicked.
- Respect the device's reduced-motion accessibility setting.
