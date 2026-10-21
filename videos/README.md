# Workout videos

Made with [HyperFrames](https://github.com/heygen-com/hyperframes) (HTML rendered to video).

| File | What it is |
|---|---|
| `diamond-pushup-music.mp4` | Diamond push-up, title and coaching tips, with music (10.1 s) |
| `diamond-pushup.mp4` | Same video without music |
| `bench-dips.mp4` | Bench dips, animated athlete, rep counter, tips and music (14.2 s) |

## Editable sources
- `projects/diamond-pushup/` and `projects/bench-dips/`: each is a HyperFrames project. Edit it, then from inside the folder run `npx hyperframes check` and `npx hyperframes render --quality looks --output out.mp4` (needs Node 22+ and FFmpeg).
- `music/make_music.py`: the program that composes the original, copyright-free music
  (`python make_music.py out.wav SECONDS BPM rise|anthem`, needs `numpy` and `scipy`).
  `music/norm.sh` sets its loudness and writes the MP3.
