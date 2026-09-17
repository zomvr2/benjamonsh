"use client";

// Motor de audio para el "recuerdo" del Listening Now: un preview que suena
// lejano, bajo y con eco, como si se colara desde la memoria. Se arma con la
// Web Audio API nativa (sin librerías): un pasabajos + una línea de delay con
// realimentación para el eco, un LFO lento que hace flotar el filtro, y un
// leve "wobble" de velocidad de reproducción (efecto cinta vieja).

export type DreamyState = "idle" | "loading" | "playing" | "stopping" | "error";

const FADE_IN = 0.9; // s
const FADE_OUT = 0.6; // s
const TARGET_GAIN = 0.22;
const FILTER_BASE_HZ = 900;
const FILTER_LFO_HZ = 0.12; // deriva lenta, casi imperceptible
const FILTER_LFO_DEPTH = 220;
const WOBBLE_RATE_HZ = 0.18;
const WOBBLE_DEPTH = 0.018; // variación de playbackRate

let sharedCtx: AudioContext | null = null;
let unlockAttached = false;

function getAudioContextCtor(): typeof AudioContext | null {
  if (typeof window === "undefined") return null;
  return (
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext ??
    null
  );
}

function getSharedContext(): AudioContext | null {
  if (sharedCtx) return sharedCtx;
  const Ctor = getAudioContextCtor();
  if (!Ctor) return null;
  sharedCtx = new Ctor();
  return sharedCtx;
}

/** El primer click/toque/tecla en la página "arma" el AudioContext para que
 *  el primer hover sobre «Escuchando ahora» no se pierda por la política de
 *  autoplay del navegador. */
function ensureUnlockListener() {
  if (unlockAttached || typeof window === "undefined") return;
  unlockAttached = true;
  const unlock = () => {
    getSharedContext()?.resume().catch(() => {});
  };
  window.addEventListener("pointerdown", unlock, { once: true, passive: true });
  window.addEventListener("keydown", unlock, { once: true });
}

export class DreamyPreview {
  private audio: HTMLAudioElement | null = null;
  private sourceNode: MediaElementAudioSourceNode | null = null;
  private masterGain: GainNode | null = null;
  private lfo: OscillatorNode | null = null;
  private rafId = 0;
  private wobbleT = 0;
  private token = 0;
  state: DreamyState = "idle";

  constructor(private onStateChange?: (s: DreamyState) => void) {
    ensureUnlockListener();
  }

  private setState(s: DreamyState) {
    this.state = s;
    this.onStateChange?.(s);
  }

  /** Carga y hace fade-in del preview en `url`. Cancela cualquier carga anterior. */
  async play(url: string): Promise<void> {
    const myToken = ++this.token;
    this.setState("loading");
    this.teardown();

    const ctx = getSharedContext();
    if (!ctx) {
      this.setState("error");
      return;
    }
    if (ctx.state === "suspended") {
      try {
        await ctx.resume();
      } catch {
        // se reintenta en el próximo gesto del usuario
      }
    }

    const audio = new Audio();
    audio.preload = "auto";
    audio.loop = true; // el preview dura ~30s; en loop se siente como un recuerdo que vuelve
    audio.src = url;
    this.audio = audio;

    const ready = await new Promise<boolean>((resolve) => {
      const onReady = () => {
        cleanup();
        resolve(true);
      };
      const onError = () => {
        cleanup();
        resolve(false);
      };
      const cleanup = () => {
        audio.removeEventListener("canplay", onReady);
        audio.removeEventListener("error", onError);
      };
      audio.addEventListener("canplay", onReady, { once: true });
      audio.addEventListener("error", onError, { once: true });
      audio.load();
    });
    if (myToken !== this.token) return; // se pidió otra cosa mientras cargaba
    if (!ready) {
      this.setState("error");
      return;
    }

    // Arranca en un punto al azar del preview: un fragmento, no la intro entera.
    const dur = Number.isFinite(audio.duration) && audio.duration > 6 ? audio.duration : 28;
    try {
      audio.currentTime = Math.random() * Math.max(0, dur - 6);
    } catch {
      // algunos navegadores tardan en permitir seek; no es grave
    }

    const source = ctx.createMediaElementSource(audio);
    const lowpass = ctx.createBiquadFilter();
    lowpass.type = "lowpass";
    lowpass.frequency.value = FILTER_BASE_HZ;
    lowpass.Q.value = 0.7;

    // LFO lento sobre el corte del filtro: la memoria se desenfoca y enfoca.
    const lfo = ctx.createOscillator();
    lfo.frequency.value = FILTER_LFO_HZ;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = FILTER_LFO_DEPTH;
    lfo.connect(lfoGain).connect(lowpass.frequency);
    lfo.start();

    const dry = ctx.createGain();
    dry.gain.value = 0.55;

    const delay = ctx.createDelay(1.2);
    delay.delayTime.value = 0.34;
    const feedback = ctx.createGain();
    feedback.gain.value = 0.42;
    const echoTone = ctx.createBiquadFilter();
    echoTone.type = "lowpass";
    echoTone.frequency.value = 1600;
    const wet = ctx.createGain();
    wet.gain.value = 0.5;

    const master = ctx.createGain();
    master.gain.value = 0;

    source.connect(lowpass);
    lowpass.connect(dry).connect(master);
    lowpass.connect(delay);
    delay.connect(echoTone);
    echoTone.connect(feedback).connect(delay); // realimentación: el eco se repite y se apaga solo
    echoTone.connect(wet).connect(master);
    master.connect(ctx.destination);

    this.sourceNode = source;
    this.masterGain = master;
    this.lfo = lfo;

    const now = ctx.currentTime;
    master.gain.cancelScheduledValues(now);
    master.gain.setValueAtTime(0, now);
    master.gain.linearRampToValueAtTime(TARGET_GAIN, now + FADE_IN);

    try {
      await audio.play();
    } catch {
      if (myToken === this.token) this.setState("error");
      return;
    }
    if (myToken !== this.token) return;
    this.setState("playing");
    this.startWobble();
  }

  /** Fade-out y corte. Seguro de llamar aunque no esté sonando nada. */
  stop() {
    this.token++;
    this.stopWobble();
    const ctx = sharedCtx;
    const audio = this.audio;
    const gain = this.masterGain;
    if (!ctx || !audio || !gain) {
      this.teardown();
      this.setState("idle");
      return;
    }
    this.setState("stopping");
    const now = ctx.currentTime;
    const current = gain.gain.value;
    gain.gain.cancelScheduledValues(now);
    gain.gain.setValueAtTime(current, now);
    gain.gain.linearRampToValueAtTime(0, now + FADE_OUT);
    const stopToken = this.token;
    window.setTimeout(() => {
      if (stopToken !== this.token) return; // ya empezó otra reproducción
      this.teardown();
      this.setState("idle");
    }, FADE_OUT * 1000 + 80);
  }

  /** Corta todo de inmediato, sin fade. Para usar en el unmount. */
  destroy() {
    this.token++;
    this.stopWobble();
    this.teardown();
    this.setState("idle");
  }

  private startWobble() {
    const audio = this.audio;
    if (!audio) return;
    const step = () => {
      this.wobbleT += 1 / 60;
      audio.playbackRate = 1 + Math.sin(this.wobbleT * WOBBLE_RATE_HZ * Math.PI * 2) * WOBBLE_DEPTH;
      this.rafId = requestAnimationFrame(step);
    };
    this.rafId = requestAnimationFrame(step);
  }

  private stopWobble() {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.rafId = 0;
  }

  private teardown() {
    this.stopWobble();
    try {
      this.lfo?.stop();
    } catch {
      // ya estaba detenido
    }
    try {
      this.lfo?.disconnect();
    } catch {
      // noop
    }
    try {
      this.sourceNode?.disconnect();
    } catch {
      // noop
    }
    try {
      this.masterGain?.disconnect();
    } catch {
      // noop
    }
    if (this.audio) {
      this.audio.pause();
      this.audio.src = "";
      this.audio.load();
    }
    this.lfo = null;
    this.sourceNode = null;
    this.masterGain = null;
    this.audio = null;
  }
}
