"""Original gym-motivation track, synthesised from scratch (no samples, no downloads).
usage: make_music.py OUT.wav DURATION_S BPM ROOT_MIDI_A_MINOR_STYLE_PROG_NAME"""
import sys, numpy as np
from scipy import signal

SR = 44100
out_path, dur, bpm, prog_name = sys.argv[1], float(sys.argv[2]), float(sys.argv[3]), sys.argv[4]
rng = np.random.default_rng(7)
beat = 60.0 / bpm
N = int((dur + 1.5) * SR)            # render a little extra, trim at the end
t_all = np.arange(N) / SR

def midi(m): return 440.0 * 2 ** ((m - 69) / 12)
def lp(x, f, order=2): b, a = signal.butter(order, f / (SR / 2), "low"); return signal.lfilter(b, a, x)
def hp(x, f, order=2): b, a = signal.butter(order, f / (SR / 2), "high"); return signal.lfilter(b, a, x)
def bp(x, lo, hi): b, a = signal.butter(2, [lo / (SR / 2), hi / (SR / 2)], "band"); return signal.lfilter(b, a, x)
def put(buf, sig, at_s, gain=1.0, pan=0.0):
    i = int(at_s * SR)
    if i >= N: return
    j = min(N, i + len(sig)); seg = sig[: j - i] * gain
    buf[0, i:j] += seg * (1 - max(0, pan)); buf[1, i:j] += seg * (1 + min(0, pan))
def saw(f, n, detune=0.0, ph=0.0):
    tt = np.arange(n) / SR
    return 2 * ((tt * f * (1 + detune) + ph) % 1.0) - 1

# ---- progressions: (root midi for bass, chord tones midi) per bar --------------------------
PROGS = {
    # Am F C G : minor start, lifts to major - classic "push through" feel
    "rise": [(45, [57, 60, 64]), (41, [53, 57, 60]), (48, [55, 60, 64]), (43, [55, 59, 62])],
    # Em C G D : bright anthemic
    "anthem": [(40, [55, 59, 64]), (36, [55, 60, 64]), (43, [55, 59, 62]), (38, [54, 57, 62])],
}
prog = PROGS[prog_name]
n_beats = int(np.ceil((dur + 1.0) / beat))
final_beat = int((dur - 0.6) // beat)          # the big final hit lands about 0.6-1 s before the end
final_beat -= final_beat % 4                     # on a bar line

dry = np.zeros((2, N))      # drums / bass
mus = np.zeros((2, N))      # pad + pluck (gets reverb)
kick_times = []

# ---- drums ---------------------------------------------------------------------------------
def kick():
    n = int(0.45 * SR); tt = np.arange(n) / SR
    f = 45 + 110 * np.exp(-tt / 0.035)
    ph = 2 * np.pi * np.cumsum(f) / SR
    return (np.sin(ph) * np.exp(-tt / 0.17) + 0.25 * np.exp(-tt / 0.004) * rng.standard_normal(n)) * 1.0
def clap():
    s = np.zeros(int(0.3 * SR))
    for k, d in enumerate([0, 0.011, 0.022, 0.034]):
        n = int(0.18 * SR); tt = np.arange(n) / SR
        burst = bp(rng.standard_normal(n), 900, 3800) * np.exp(-tt / (0.012 if k < 3 else 0.07))
        s[int(d * SR): int(d * SR) + n] += burst[: len(s) - int(d * SR)]
    return s * 0.9
def hat(decay):
    n = int(decay * 5 * SR); tt = np.arange(n) / SR
    return hp(rng.standard_normal(n), 7000) * np.exp(-tt / decay) * 0.5
def crash():
    n = int(1.4 * SR); tt = np.arange(n) / SR
    return hp(rng.standard_normal(n), 5000) * np.exp(-tt / 0.3) * 0.3

K, C, HH, HHO = kick(), clap(), hat(0.025), hat(0.09)
for b in range(n_beats):
    tb = b * beat; bar_i, bt = divmod(b, 4)
    if b > final_beat: break
    if b < final_beat:
        put(dry, K, tb, 1.0); kick_times.append(tb)
        if bar_i >= 1 and bt in (1, 3): put(dry, C, tb, 0.8)
        if bar_i >= 1:
            put(dry, HH, tb + beat * 0.5, 0.7)
            if bt == 3: put(dry, HHO, tb + beat * 0.5, 0.6)
        if bar_i >= 2: [put(dry, HH, tb + beat * x, 0.35) for x in (0.25, 0.75)]
    else:
        put(dry, K, tb, 1.1); put(dry, C, tb, 1.0); put(dry, crash(), tb, 0.9); kick_times.append(tb)

# ---- bass: rolling offbeat 8ths, silent on the final hit bar until the downbeat -------------
for b in range(final_beat):
    root = prog[(b // 4) % len(prog)][0]
    for h in (0.5, 0.0):
        if h == 0.0 and b % 4 != 0: continue
        n = int(beat * 0.45 * SR); tt = np.arange(n) / SR
        f = midi(root + 12)
        tone = np.sin(2 * np.pi * f * tt) + 0.35 * lp(saw(f, n), 600)
        put(dry, tone * np.exp(-tt / 0.25) * np.minimum(1, tt / 0.004), b * beat + h * beat, 0.55)
rootF = prog[(final_beat // 4) % len(prog)][0] + 12
nF = int(1.8 * SR); ttF = np.arange(nF) / SR
put(dry, np.sin(2 * np.pi * midi(rootF) * ttF) * np.exp(-ttF / 0.9), final_beat * beat, 0.7)

# ---- pad: detuned saws on the chord, ducked by the kick -----------------------------------------
duck = np.ones(N)
for kt in kick_times:
    i = int(kt * SR); m = min(N, i + int(0.35 * SR)); tt = np.arange(m - i) / SR
    duck[i:m] = np.minimum(duck[i:m], 1 - 0.75 * np.exp(-tt / 0.11))
for bar in range(int(np.ceil(n_beats / 4))):
    start = bar * 4 * beat
    if start >= dur + 0.5: break
    last = bar * 4 >= final_beat
    chord = prog[bar % len(prog)][1]
    length = 1.9 if last else 4 * beat
    n = int((length + 0.3) * SR); tt = np.arange(n) / SR
    pad = np.zeros(n)
    for m in chord:
        for dt in (-0.004, 0.0, 0.004):
            pad += saw(midi(m), n, dt, rng.random())
    pad = lp(pad / 9, 1900)
    env = np.minimum(1, tt / 0.12) * (np.exp(-np.maximum(0, tt - length) / 0.12))
    put(mus, pad * env * 0.55, start, 1.0, 0.0)
mus *= duck[None, :]

# ---- pluck arpeggio on 8ths (bright, hooky), with a dotted-eighth echo -------------------------
pluck_bus = np.zeros((2, N))
pat = [0, 1, 2, 1, 2, 1, 2, 3]          # indices into chord tones (3 = octave of the first)
for b8 in range(int(final_beat * 2)):
    bar = (b8 // 8) % len(prog); chord = prog[bar][1]
    if b8 // 8 < 1 and b8 % 2 == 1: continue          # sparser in the first bar
    idx = pat[b8 % 8]; m = (chord[idx] if idx < 3 else chord[0] + 12) + 12
    n = int(0.28 * SR); tt = np.arange(n) / SR
    f = midi(m)
    tone = lp(saw(f, n) + saw(f, n, 0.006), 3200)
    put(pluck_bus, tone * np.exp(-tt / 0.1) * np.minimum(1, tt / 0.002), b8 * beat * 0.5, 0.30, pan=(-0.35 if b8 % 2 else 0.35))
for k, g in ((1, 0.42), (2, 0.2)):
    d = int(0.75 * beat * SR * k)
    mus[:, d:] += pluck_bus[:, : N - d][:, :] * g
mus += pluck_bus

# ---- small room reverb on the musical bus -------------------------------------------------------
def reverb(x, wet=0.22):
    y = np.zeros_like(x)
    for ch in range(2):
        acc = np.zeros(N)
        for d, g in ((0.0297, 0.80), (0.0371, 0.78), (0.0411, 0.76), (0.0437, 0.74)):
            D = int(d * SR * (1 + 0.03 * ch)); c = np.zeros(N + D); c[:N] = x[ch]
            c = signal.lfilter([1], [1] + [0] * (D - 1) + [-g], c)[:N]; acc += c
        y[ch] = acc / 4
    return x * (1 - wet) + lp(y, 5000) * wet * 2.0
mus = reverb(mus)

# ---- riser into the final hit -----------------------------------------------------------------
rn = int(2 * beat * SR); rt = np.arange(rn) / SR
riser = hp(rng.standard_normal(rn), 2500) * (rt / rt[-1]) ** 2 * 0.35
put(dry, riser, final_beat * beat - 2 * beat, 0.7)

# ---- mix, soft-limit, trim, fade ----------------------------------------------------------------
mix = dry + mus * 0.9
mix = np.tanh(mix * 0.85) / np.tanh(0.85)
mix = mix[:, : int(dur * SR)]
fade = int(0.5 * SR); mix[:, -fade:] *= np.linspace(1, 0, fade)
mix *= 0.89 / np.max(np.abs(mix))
import wave
pcm = (mix.T * 32767).astype("<i2")
with wave.open(out_path, "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
print("wrote", out_path, f"{dur:.2f}s", f"bpm={bpm}", prog_name, "final hit at", round(final_beat * beat, 2), "s")
