// Lab 5: The Sound of the Moon
// The soundscape controls the moon's glow using the Web Audio API.
const audio = document.getElementById('audio');
const playButton = document.getElementById('playButton');
const playIcon = document.getElementById('playIcon');
const pauseIcon = document.getElementById('pauseIcon');
const seekBar = document.getElementById('seekBar');
const volumeBar = document.getElementById('volumeBar');
const currentTimeLabel = document.getElementById('currentTime');
const durationLabel = document.getElementById('duration');
const moonButton = document.getElementById('moonButton');
const statusLabel = document.getElementById('status');

let audioContext;
let analyser;
let waveform;
let smoothedEnergy = 0;
let brightMoon = false;
let starElements = [];

let seed = 42;
function random() {
  seed = (seed * 1664525 + 1013904223) % 4294967296;
  return seed / 4294967296;
}
const stars = document.getElementById('stars');
for (let i = 0; i < 85; i++) {
  const star = document.createElement('span');
  star.className = 'star';
  star.style.left = `${4 + random() * 92}%`;
  star.style.top = `${7 + random() * 76}%`;
  star.style.setProperty('--size', `${1 + random() * 2.2}px`);
  star.style.setProperty('--opacity', `${0.35 + random() * 0.6}`);
  star.style.setProperty('--speed', `${1.5 + random() * 3.5}s`);
  star.style.setProperty('--delay', `${random() * -5}s`);
  star.style.setProperty('--shift-x', '0px');
  star.style.setProperty('--shift-y', '0px');
  const sparkle = document.createElement('span');
  sparkle.className = 'sparkle';
  star.appendChild(sparkle);
  stars.appendChild(star);
  starElements.push(star);
}


function moveStars(scatter = false) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  for (const star of starElements) {
    const distance = scatter ? 115 : 44;
    star.style.setProperty('--shift-x', `${(random() * 2 - 1) * distance}px`);
    star.style.setProperty('--shift-y', `${(random() * 2 - 1) * distance * .65}px`);
    star.style.setProperty('--drift-time', scatter ? '1.3s' : `${5 + random() * 3}s`);
  }
}
setTimeout(() => moveStars(), 250);
setInterval(() => moveStars(), 7000);

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  return `${mins}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;
}

function updateProgress() {
  const duration = Number.isFinite(audio.duration) ? audio.duration : 0;
  const percentage = duration ? (audio.currentTime / duration) * 100 : 0;
  seekBar.value = String(percentage);
  seekBar.style.setProperty('--progress', `${percentage}%`);
  currentTimeLabel.textContent = formatTime(audio.currentTime);
  if (duration) durationLabel.textContent = formatTime(duration);
}

function updatePlayerState() {
  const playing = !audio.paused;
  playIcon.classList.toggle('hidden', playing);
  pauseIcon.classList.toggle('hidden', !playing);
  playButton.setAttribute('aria-label', playing ? 'Pause soundscape' : 'Play soundscape');
  document.querySelector('.player').classList.toggle('playing', playing);
  statusLabel.textContent = playing ? 'The night is alive with sound.' : 'Press play to hear the night.';
}

async function setupAudioAnalysis() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;
  if (!audioContext) {
    audioContext = new AudioContextClass();
    const source = audioContext.createMediaElementSource(audio);
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048;
    analyser.smoothingTimeConstant = 0.82;
    waveform = new Uint8Array(analyser.fftSize);
    source.connect(analyser);
    analyser.connect(audioContext.destination);
  }
  if (audioContext.state === 'suspended') await audioContext.resume();
}

playButton.addEventListener('click', async () => {
  if (audio.paused) {
    try {
      await setupAudioAnalysis();
      await audio.play();
    } catch (error) {
      statusLabel.textContent = 'Unable to play audio. Try opening the website through GitHub Pages.';
      console.error('Audio playback failed:', error);
    }
  } else {
    audio.pause();
  }
});

seekBar.addEventListener('input', () => {
  if (Number.isFinite(audio.duration)) {
    audio.currentTime = Number(seekBar.value) / 100 * audio.duration;
    updateProgress();
  }
});

volumeBar.addEventListener('input', () => {
  audio.volume = Number(volumeBar.value);
});
audio.volume = Number(volumeBar.value);

moonButton.setAttribute('aria-pressed', 'false');
moonButton.addEventListener('click', async () => {
  brightMoon = !brightMoon;
  moonButton.classList.toggle('enchanted', brightMoon);
  moonButton.setAttribute('aria-pressed', String(brightMoon));
  moonButton.classList.remove('moon-burst');
  void moonButton.offsetWidth; // Restart the click animation on repeat clicks.
  moonButton.classList.add('moon-burst');
  moveStars(true);

  const duration = audio.duration;
  if (Number.isFinite(duration) && duration > 4) {
    const margin = 2;
    const range = duration - 2 * margin;
    let next = margin + Math.random() * range;
    if (Math.abs(next - audio.currentTime) < Math.min(14, range / 3)) {
      next = margin + ((next - margin + range / 2) % range);
    }
    audio.currentTime = next;
    updateProgress();
    if (audio.paused) {
      try {
        await setupAudioAnalysis();
        await audio.play();
      } catch (error) {
        console.error('Moon playback failed:', error);
        statusLabel.textContent = `Jumped to ${formatTime(next)}. Press Play to listen.`;
        return;
      }
    }
    statusLabel.textContent = `Moonlight shifted — jumped to ${formatTime(next)}.`;
  } else {
    statusLabel.textContent = 'Moonlight changed. Press Play to load the soundscape.';
  }
});

function animateMoon() {
  let energy = 0;
  if (analyser && !audio.paused) {
    analyser.getByteTimeDomainData(waveform);
    let sumSquares = 0;
    for (let i = 0; i < waveform.length; i++) {
      const sample = (waveform[i] - 128) / 128;
      sumSquares += sample * sample;
    }
    const rms = Math.sqrt(sumSquares / waveform.length);
    energy = Math.min(1, Math.max(0, (rms - 0.003) * 33)); // Stronger response for quiet crickets.
  }
  smoothedEnergy += (energy - smoothedEnergy) * (energy > smoothedEnergy ? 0.18 : 0.07);
  document.documentElement.style.setProperty('--energy', smoothedEnergy.toFixed(3));
  requestAnimationFrame(animateMoon);
}

// Keep the controls synchronized with the actual audio element.
audio.addEventListener('loadedmetadata', updateProgress);
audio.addEventListener('timeupdate', updateProgress);
audio.addEventListener('play', updatePlayerState);
audio.addEventListener('pause', updatePlayerState);
audio.addEventListener('ended', () => {
  updatePlayerState();
  updateProgress();
  statusLabel.textContent = 'The soundscape has ended. Press play to listen again.';
});
audio.addEventListener('error', () => {
  statusLabel.textContent = 'Audio could not be loaded. Check the assets folder.';
});
updatePlayerState();
updateProgress();
requestAnimationFrame(animateMoon);
