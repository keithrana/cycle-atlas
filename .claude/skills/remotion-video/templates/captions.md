# Template: Captions

Words appear in time with speech. Give each word a start time in seconds.

`src/Captions.tsx`
```tsx
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

type Word = { text: string; start: number; end: number }; // seconds

export const Captions = ({ words, background = "#111" }: { words: Word[]; background?: string }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  // Show a window of up to 5 words around the current one.
  const current = words.findIndex((w) => t >= w.start && t < w.end);
  const i = current === -1 ? 0 : current;
  const visible = words.slice(Math.floor(i / 5) * 5, Math.floor(i / 5) * 5 + 5);

  return (
    <AbsoluteFill style={{ backgroundColor: background, justifyContent: "flex-end", alignItems: "center", paddingBottom: 200 }}>
      <div style={{ fontSize: 72, fontWeight: 800, color: "white", textShadow: "0 4px 12px black", textAlign: "center", maxWidth: "80%" }}>
        {visible.map((w, k) => (
          <span key={k} style={{ color: t >= w.start && t < w.end ? "#ffd400" : "white", marginRight: 16 }}>
            {w.text}
          </span>
        ))}
      </div>
    </AbsoluteFill>
  );
};
```

Tips
- Get word times from a transcription tool (e.g. `@remotion/captions` or Whisper) and save them as JSON in `public/`.
- `background` is the backdrop when there is no video. Pass `"transparent"` when layering over a video.
- Layer it over the video: `<AbsoluteFill><OffthreadVideo src={staticFile("clip.mp4")} /><Captions words={words} background="transparent" /></AbsoluteFill>`.
