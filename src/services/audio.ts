/**
 * Procedural Web Audio API sound synthesizer
 * Zero external audio files, 100% generated in real-time.
 *
 * Designed specifically for a focused primary school classroom:
 * - Gentle, warm, relaxing background music (Lo-Fi Music Box / Kalimba & Velvet Pad)
 * - Calming, peaceful tempo (approx 72 BPM) with natural musical breathing room
 * - Dedicated lowpass filter on BGM bus to eliminate all harsh/tinny frequencies
 * - Comfortable soft default volume that fills the room subtly without being distracting
 * - Quick volume control presets (Lembut / Sedang / Mati)
 */

type SoundStateListener = (state: {
  bgmEnabled: boolean;
  sfxEnabled: boolean;
  isBgmPlaying: boolean;
  bgmVolume: number;
}) => void;

class SoundSystem {
  private ctx: AudioContext | null = null;
  private bgmGain: GainNode | null = null;
  private bgmFilter: BiquadFilterNode | null = null;
  private sfxGain: GainNode | null = null;
  private masterGain: GainNode | null = null;
  public isBgmPlaying = false;
  private bgmTimer: number | null = null;
  private bgmStep = 0;

  public bgmEnabled = true;
  public sfxEnabled = true;
  // Gentle, cozy background volume: subtle, soothing, never overwhelming
  public bgmVolume = 0.05;
  public sfxVolume = 0.35;

  private listeners: SoundStateListener[] = [];

  constructor() {
    if (typeof window !== 'undefined') {
      const unlockAudio = () => {
        this.ensurePlaying();
      };
      window.addEventListener('click', unlockAudio, { passive: true });
      window.addEventListener('pointerdown', unlockAudio, { passive: true });
      window.addEventListener('keydown', unlockAudio, { passive: true });
      window.addEventListener('touchstart', unlockAudio, { passive: true });
    }
  }

  public subscribe(fn: SoundStateListener): () => void {
    this.listeners.push(fn);
    fn({
      bgmEnabled: this.bgmEnabled,
      sfxEnabled: this.sfxEnabled,
      isBgmPlaying: this.isBgmPlaying,
      bgmVolume: this.bgmVolume,
    });
    return () => {
      this.listeners = this.listeners.filter(l => l !== fn);
    };
  }

  private notify() {
    this.listeners.forEach(fn =>
      fn({
        bgmEnabled: this.bgmEnabled,
        sfxEnabled: this.sfxEnabled,
        isBgmPlaying: this.isBgmPlaying,
        bgmVolume: this.bgmVolume,
      })
    );
  }

  public initCtx() {
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(1, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);

        // Dedicated warm lowpass filter on BGM bus
        // Smooth 480 Hz cutoff with low Q (0.5) eliminates any harshness or sharp clicks
        this.bgmFilter = this.ctx.createBiquadFilter();
        this.bgmFilter.type = 'lowpass';
        this.bgmFilter.frequency.setValueAtTime(480, this.ctx.currentTime);
        this.bgmFilter.Q.setValueAtTime(0.5, this.ctx.currentTime);

        this.bgmGain = this.ctx.createGain();
        this.bgmGain.gain.setValueAtTime(this.bgmEnabled ? this.bgmVolume : 0, this.ctx.currentTime);

        this.bgmGain.connect(this.bgmFilter);
        this.bgmFilter.connect(this.masterGain);

        this.sfxGain = this.ctx.createGain();
        this.sfxGain.gain.setValueAtTime(this.sfxEnabled ? this.sfxVolume : 0, this.ctx.currentTime);
        this.sfxGain.connect(this.masterGain);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public ensurePlaying() {
    this.initCtx();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') {
      this.ctx
        .resume()
        .then(() => {
          if (this.bgmEnabled && !this.isBgmPlaying) {
            this.startBGM();
          }
        })
        .catch(() => {});
    } else if (this.bgmEnabled && !this.isBgmPlaying) {
      this.startBGM();
    }
  }

  public setBgmEnabled(enabled: boolean) {
    this.bgmEnabled = enabled;
    if (this.bgmGain && this.ctx) {
      this.bgmGain.gain.setValueAtTime(enabled ? this.bgmVolume : 0, this.ctx.currentTime);
    }
    if (!enabled && this.isBgmPlaying) {
      this.stopBGM();
    } else if (enabled && !this.isBgmPlaying) {
      this.startBGM();
    }
    this.notify();
  }

  public setSfxEnabled(enabled: boolean) {
    this.sfxEnabled = enabled;
    if (this.sfxGain && this.ctx) {
      this.sfxGain.gain.setValueAtTime(enabled ? this.sfxVolume : 0, this.ctx.currentTime);
    }
    this.notify();
  }

  public setBgmVolume(val: number) {
    this.bgmVolume = Math.max(0, Math.min(1, val));
    if (this.bgmGain && this.ctx && this.bgmEnabled) {
      this.bgmGain.gain.setValueAtTime(this.bgmVolume, this.ctx.currentTime);
    }
    this.notify();
  }

  public cycleVolumePreset(): number {
    // Presets: 0.04 (Sangat Lembut / Santai) -> 0.08 (Sedang) -> 0 (Mati)
    if (!this.bgmEnabled || this.bgmVolume === 0) {
      this.bgmVolume = 0.04;
      this.setBgmEnabled(true);
      return 0.04;
    } else if (this.bgmVolume <= 0.05) {
      this.setBgmVolume(0.08);
      return 0.08;
    } else if (this.bgmVolume <= 0.12) {
      this.setBgmEnabled(false);
      return 0;
    } else {
      this.setBgmVolume(0.04);
      return 0.04;
    }
  }

  public toggleMute() {
    const nextState = !this.bgmEnabled;
    this.setBgmEnabled(nextState);
    return nextState;
  }

  /**
   * Soothing, Peaceful & Gentle Background Music:
   * Relaxed 56 BPM Lo-Fi Study Soundscape with velvet warm chord pad.
   * Comforting, warm, child-friendly melody that keeps the atmosphere alive ("tidak sepi")
   * without ever distracting student thinking or teacher instruction ("tidak mengganggu").
   */
  public startBGM() {
    this.initCtx();
    if (!this.ctx || !this.bgmEnabled) return;
    if (this.isBgmPlaying && this.bgmTimer !== null) return;
    this.isBgmPlaying = true;
    this.notify();

    if (this.bgmGain) {
      this.bgmGain.gain.setValueAtTime(this.bgmVolume, this.ctx.currentTime);
    }

    // Peaceful 16-step slow progression (each step is 1.1s = peaceful, slow, unhurried breath)
    // 0 = rest / silence space to prevent acoustic fatigue
    // Pentatonic harmony: C - G - Am - F (naturally soothing and uplifting)
    const bellNotes: { [step: number]: number } = {
      0: 261.63,  // C4 (Warm gentle opening)
      2: 329.63,  // E4
      4: 392.00,  // G4
      6: 440.00,  // A4
      8: 349.23,  // F4
      10: 329.63, // E4
      12: 293.66, // D4
      14: 261.63, // C4
    };

    // Warm Chord Pads (played softly every 4 steps to sustain warm background ambience)
    // Very gentle sine waves with soft 120ms attack and long smooth release
    const chordPads: { [step: number]: number[] } = {
      0: [130.81, 164.81, 196.00], // C major (C3, E3, G3)
      4: [196.00, 246.94, 293.66], // G major (G3, B3, D4)
      8: [110.00, 130.81, 164.81], // A minor (A2, C3, E3)
      12: [174.61, 220.00, 261.63], // F major (F3, A3, C4)
    };

    // Very unhurried tempo (1100ms per step = serene, peaceful atmosphere)
    const tempoMs = 1100;

    const tick = () => {
      if (!this.isBgmPlaying || !this.ctx || !this.bgmGain) return;
      const t = this.ctx.currentTime;
      const stepIdx = this.bgmStep % 16;
      const bellFreq = bellNotes[stepIdx];

      // 1. Soft Warm Kalimba droplet chime (sparse, mellow, never piercing)
      if (bellFreq) {
        const osc = this.ctx.createOscillator();
        const noteGain = this.ctx.createGain();

        osc.type = 'sine'; // Mellow pure sine wave
        osc.frequency.setValueAtTime(bellFreq, t);

        // Smooth gradual attack (no click) and lingering soft decay
        noteGain.gain.setValueAtTime(0.0001, t);
        noteGain.gain.linearRampToValueAtTime(0.025, t + 0.08);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, t + 1.2);

        osc.connect(noteGain);
        noteGain.connect(this.bgmGain);

        osc.start(t);
        osc.stop(t + 1.25);
      }

      // 2. Velvet Ambient Chord Pad (plays softly on steps 0, 4, 8, 12)
      // Creates a cozy acoustic bed so it's not silent/lonely ("tidak sepi")
      if (chordPads[stepIdx]) {
        const freqs = chordPads[stepIdx];
        freqs.forEach(freq => {
          const padOsc = this.ctx!.createOscillator();
          const padGain = this.ctx!.createGain();

          padOsc.type = 'sine';
          padOsc.frequency.setValueAtTime(freq, t);

          // Soft slow swell and long, gentle decay over 4.2 seconds
          padGain.gain.setValueAtTime(0.0001, t);
          padGain.gain.linearRampToValueAtTime(0.012, t + 0.5);
          padGain.gain.exponentialRampToValueAtTime(0.0001, t + 4.1);

          padOsc.connect(padGain);
          padGain.connect(this.bgmGain!);

          padOsc.start(t);
          padOsc.stop(t + 4.2);
        });
      }

      this.bgmStep++;
      this.bgmTimer = window.setTimeout(tick, tempoMs);
    };

    tick();
  }

  public stopBGM() {
    this.isBgmPlaying = false;
    if (this.bgmTimer !== null) {
      clearTimeout(this.bgmTimer);
      this.bgmTimer = null;
    }
    this.notify();
  }

  public pauseBGM() {
    if (this.bgmGain && this.ctx) {
      this.bgmGain.gain.setTargetAtTime(0.02, this.ctx.currentTime, 0.15);
    }
  }

  public resumeBGM() {
    if (this.bgmGain && this.ctx && this.bgmEnabled) {
      this.bgmGain.gain.setTargetAtTime(this.bgmVolume, this.ctx.currentTime, 0.15);
    }
  }

  // --- SOUND EFFECTS (Warm, non-startling, pleasant for students) ---

  public playClick() {
    if (!this.sfxEnabled) return;
    this.initCtx();
    if (!this.ctx || !this.sfxGain) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(500, t);
    osc.frequency.exponentialRampToValueAtTime(260, t + 0.04);

    g.gain.setValueAtTime(0.12, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.045);

    osc.connect(g);
    g.connect(this.sfxGain);
    osc.start(t);
    osc.stop(t + 0.05);
  }

  public playCorrect() {
    if (!this.sfxEnabled) return;
    this.initCtx();
    if (!this.ctx || !this.sfxGain) return;
    const t = this.ctx.currentTime;

    // Gentle pleasant xylophone chime
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const g = this.ctx!.createGain();
      const startTime = t + idx * 0.06;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      g.gain.setValueAtTime(0.001, startTime);
      g.gain.linearRampToValueAtTime(0.16, startTime + 0.015);
      g.gain.exponentialRampToValueAtTime(0.001, startTime + 0.28);

      osc.connect(g);
      g.connect(this.sfxGain!);
      osc.start(startTime);
      osc.stop(startTime + 0.29);
    });
  }

  public playWrong() {
    if (!this.sfxEnabled) return;
    this.initCtx();
    if (!this.ctx || !this.sfxGain) return;
    const t = this.ctx.currentTime;

    // Soft, polite two-tone bell (gentle, not harsh or buzzing)
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const g = this.ctx.createGain();

    osc1.type = 'sine';
    osc2.type = 'sine';
    osc1.frequency.setValueAtTime(260, t);
    osc1.frequency.exponentialRampToValueAtTime(220, t + 0.22);
    osc2.frequency.setValueAtTime(196, t);
    osc2.frequency.exponentialRampToValueAtTime(164, t + 0.22);

    g.gain.setValueAtTime(0.001, t);
    g.gain.linearRampToValueAtTime(0.14, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.24);

    osc1.connect(g);
    osc2.connect(g);
    g.connect(this.sfxGain);

    osc1.start(t);
    osc2.start(t);
    osc1.stop(t + 0.25);
    osc2.stop(t + 0.25);
  }

  public playTug() {
    if (!this.sfxEnabled) return;
    this.initCtx();
    if (!this.ctx || !this.sfxGain) return;
    const t = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(120, t);
    osc.frequency.exponentialRampToValueAtTime(75, t + 0.16);

    g.gain.setValueAtTime(0.15, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.18);

    osc.connect(g);
    g.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.19);
  }

  public playCountdown() {
    if (!this.sfxEnabled) return;
    this.initCtx();
    if (!this.ctx || !this.sfxGain) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(700, t);

    g.gain.setValueAtTime(0.08, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.09);

    osc.connect(g);
    g.connect(this.sfxGain);
    osc.start(t);
    osc.stop(t + 0.1);
  }

  public playRoundTransition() {
    if (!this.sfxEnabled) return;
    this.initCtx();
    if (!this.ctx || !this.sfxGain) return;
    const t = this.ctx.currentTime;
    const notes = [392.00, 523.25, 659.25];
    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const g = this.ctx!.createGain();
      const st = t + idx * 0.09;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, st);
      g.gain.setValueAtTime(0.12, st);
      g.gain.exponentialRampToValueAtTime(0.001, st + 0.22);

      osc.connect(g);
      g.connect(this.sfxGain!);
      osc.start(st);
      osc.stop(st + 0.23);
    });
  }

  public playVictory() {
    if (!this.sfxEnabled) return;
    this.initCtx();
    if (!this.ctx || !this.sfxGain) return;
    const t = this.ctx.currentTime;
    const melody = [
      { f: 523.25, d: 0.14 },
      { f: 659.25, d: 0.14 },
      { f: 783.99, d: 0.22 },
      { f: 1046.5, d: 0.6 }
    ];

    let offset = 0;
    melody.forEach((item) => {
      const st = t + offset;
      const osc = this.ctx!.createOscillator();
      const g = this.ctx!.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(item.f, st);

      g.gain.setValueAtTime(0.18, st);
      g.gain.exponentialRampToValueAtTime(0.001, st + item.d);

      osc.connect(g);
      g.connect(this.sfxGain!);
      osc.start(st);
      osc.stop(st + item.d + 0.05);
      offset += item.d * 0.85;
    });
  }

  public playDefeat() {
    if (!this.sfxEnabled) return;
    this.initCtx();
    if (!this.ctx || !this.sfxGain) return;
    const t = this.ctx.currentTime;
    const notes = [392, 349.2, 329.6];
    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const g = this.ctx!.createGain();
      const st = t + idx * 0.2;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, st);
      g.gain.setValueAtTime(0.1, st);
      g.gain.exponentialRampToValueAtTime(0.001, st + 0.3);

      osc.connect(g);
      g.connect(this.sfxGain!);
      osc.start(st);
      osc.stop(st + 0.32);
    });
  }

  /**
   * Triumphant celebratory fanfare with soft multi-harmonic chime
   */
  public playGrandTrophyFanfare() {
    if (!this.sfxEnabled) return;
    this.initCtx();
    if (!this.ctx || !this.sfxGain) return;
    const t = this.ctx.currentTime;

    this.pauseBGM();
    setTimeout(() => {
      this.resumeBGM();
    }, 3200);

    const notes = [
      { f: 523.25, d: 0.14 },
      { f: 523.25, d: 0.14 },
      { f: 659.25, d: 0.22 },
      { f: 587.33, d: 0.14 },
      { f: 659.25, d: 0.14 },
      { f: 783.99, d: 0.4 },
      { f: 1046.50, d: 1.1 }
    ];

    let offset = 0;
    notes.forEach((item) => {
      const st = t + offset;
      const osc = this.ctx!.createOscillator();
      const g = this.ctx!.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(item.f, st);

      g.gain.setValueAtTime(0.22, st);
      g.gain.exponentialRampToValueAtTime(0.001, st + item.d);

      osc.connect(g);
      g.connect(this.sfxGain!);
      osc.start(st);
      osc.stop(st + item.d + 0.05);

      offset += item.d * 0.85;
    });

    this.playCrowdCheer(t + 0.5);
    this.playCelebrationWhistle(t + 1.1);
  }

  public playCrowdCheer(startTime?: number) {
    if (!this.sfxEnabled) return;
    this.initCtx();
    if (!this.ctx || !this.sfxGain) return;
    const t = startTime ?? this.ctx.currentTime;

    const bufferSize = this.ctx.sampleRate * 1.8;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.sin((i / bufferSize) * Math.PI);
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(800, t);
    filter.Q.setValueAtTime(1.8, t);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.14, t + 0.4);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 1.8);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    noise.start(t);
    noise.stop(t + 1.85);
  }

  public playCelebrationWhistle(startTime?: number) {
    if (!this.sfxEnabled) return;
    this.initCtx();
    if (!this.ctx || !this.sfxGain) return;
    const t = startTime ?? this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1100, t);
    osc.frequency.exponentialRampToValueAtTime(1800, t + 0.28);

    gain.gain.setValueAtTime(0.07, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.32);
  }
}

export const sound = new SoundSystem();
