(() => {
  let phases = [];
  let currentPhase = -1;
  let phaseTimeLeft = 0;
  let sessionInterval = null;
  let paused = false;

  function formatTime(sec) {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  function getSelectedSound() {
    const select = document.getElementById('sound-select');
    return document.getElementById(select.value);
  }

  function playBeep() {
    const selected = getSelectedSound();
    selected.pause();
    selected.currentTime = 0;
    selected.load();
    selected.play();
  }

  function playPattern(count) {
    for (let i = 0; i < count; i++) {
      setTimeout(playBeep, i * 300);
    }
  }

  function buildPhases(sets, exercises, work, restEx, restSet) {
    const arr = [];
    for (let s = 1; s <= sets; s++) {
      for (let e = 1; e <= exercises; e++) {
        arr.push({ set: s, exercise: e, state: 'work', duration: work });
        arr.push({ set: s, exercise: e, state: 'rest-ex', duration: restEx });
      }
      arr.push({ set: s, exercise: null, state: 'rest-set', duration: restSet });
    }
    return arr;
  }

  function updateDisplay() {
    if (currentPhase < phases.length && currentPhase >= 0) {
      const { set, exercise, state } = phases[currentPhase];
      document.getElementById('phase-label').textContent =
        state === 'work' ? `SET ${set}: ÖVNING ${exercise}` :
        state === 'rest-ex' ? 'PAUS ÖVNING' :
        'PAUS SET';
    } else {
      document.getElementById('phase-label').textContent = '—';
    }
    document.getElementById('big-timer').textContent = formatTime(phaseTimeLeft);
    const remaining = phases.slice(currentPhase).reduce((acc, p) => acc + p.duration, 0)
      - (phases[currentPhase]?.duration - phaseTimeLeft || 0);
    document.getElementById('remaining').textContent = formatTime(remaining);
  }

  function nextPhase() {
    currentPhase++;
    if (currentPhase >= phases.length) {
      clearInterval(sessionInterval);
      phaseTimeLeft = 0;
      updateDisplay();
      return;
    }
    phaseTimeLeft = phases[currentPhase].duration;
    playPattern(3);
    updateDisplay();
  }

  function tick() {
    if (paused) return;
    if (phaseTimeLeft > 0) {
      phaseTimeLeft--;
      const phase = phases[currentPhase];
      if (phase.state === 'work' && phaseTimeLeft === Math.ceil(phase.duration / 2)) {
        playPattern(2);
      }
      updateDisplay();
    } else {
      playPattern(3);
      nextPhase();
    }
  }

  document.getElementById('start-button').addEventListener('click', () => {
    clearInterval(sessionInterval);
    phases = buildPhases(
      +document.getElementById('input-sets').value,
      +document.getElementById('input-exercises').value,
      +document.getElementById('input-work').value,
      +document.getElementById('input-rest-ex').value,
      +document.getElementById('input-rest-set').value
    );
    currentPhase = -1;
    paused = false;
    document.getElementById('pause-button').textContent = 'Pausa';
    nextPhase();
    sessionInterval = setInterval(tick, 1000);
  });

  document.getElementById('pause-button').addEventListener('click', () => {
    paused = !paused;
    document.getElementById('pause-button').textContent = paused ? 'Fortsätt' : 'Pausa';
  });

  document.getElementById('preview-button').addEventListener('click', () => {
    playBeep();
  });

  // Musikspelare
  const playMusicButton = document.getElementById("play-music-button");
  const trainingAudio = document.getElementById("training-audio");

  playMusicButton.addEventListener("click", () => {
    if (trainingAudio.paused) {
      trainingAudio.play();
      playMusicButton.textContent = "Pausa musik";
    } else {
      trainingAudio.pause();
      playMusicButton.textContent = "Spela musik";
    }
  });

})();


