---
name: remotion-video
description: Create videos from React code with Remotion. Use when the user asks to make, animate, preview, or render a video, motion graphic, intro, caption, or social clip using code.
---

# Remotion Video

Remotion makes videos out of React components. Each frame is a web page. Render them in order and you get an MP4.

## Core ideas
- **Composition**: one video. Has `width`, `height`, `fps`, `durationInFrames`.
- **Frame**: `useCurrentFrame()` returns the current frame number. All animation is a function of the frame.
- **`interpolate`**: maps a frame range to a value range (fade, slide).
- **`spring`**: natural bouncy motion.
- **`Sequence`**: shows children only during a frame range.
- **`AbsoluteFill`**: full-screen layer; stack them for backgrounds.
- **`Audio` / `OffthreadVideo` / `Img`**: media. Put files in `public/` and load with `staticFile("name.mp3")`.

## Workflow
1. **Plan first.** Ask or decide: length (seconds), size (1920x1080, or 1080x1920 for vertical), fps (30), and the scenes. Keep scenes to a short list.
2. **Set up** (skip if the project exists):
   ```
   npx create-video@latest
   cd <project> && npm install
   ```
3. **Write** compositions in `src/`, register them in `src/Root.tsx`.
4. **Preview**: `npm run dev` (opens Remotion Studio).
5. **Render**: `npx remotion render <CompositionId> out/video.mp4`
   Still frame: `npx remotion still <CompositionId> out/frame.png --frame=30`
6. **Verify**: render one still first, check it looks right, then render the full video.

## Starter example
`src/Root.tsx`
```tsx
import { Composition } from "remotion";
import { Hello } from "./Hello";

export const RemotionRoot = () => (
  <Composition
    id="Hello"
    component={Hello}
    durationInFrames={150}
    fps={30}
    width={1920}
    height={1080}
    defaultProps={{ title: "Hello, world" }}
  />
);
```

`src/Hello.tsx`
```tsx
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export const Hello = ({ title }: { title: string }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const opacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });
  const scale = spring({ frame, fps, config: { damping: 12 } });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0b1020", justifyContent: "center", alignItems: "center" }}>
      <h1 style={{ color: "white", fontSize: 120, opacity, transform: `scale(${scale})` }}>{title}</h1>
    </AbsoluteFill>
  );
};
```

## Rules of thumb
- Never animate with CSS transitions, `setTimeout`, or CSS animations. They don't render per frame. Drive everything from `useCurrentFrame()`.
- Always pass `extrapolateRight: "clamp"` to `interpolate` unless you want values to keep growing.
- Seconds to frames: `seconds * fps`.
- Use `<Sequence from={..} durationInFrames={..}>` to order scenes; `<Series>` to chain them.
- Load fonts with `@remotion/google-fonts` so they are ready before rendering.
- Keep props in `defaultProps` so the user can edit text in the Studio.
- Rendering needs Chromium and ffmpeg (Remotion installs/handles these); first render can be slow.

## Common problems
- **Can't download the browser (no internet / locked-down machine)**: point Remotion at an installed Chromium:
  `npx remotion render <Id> out/video.mp4 --browser-executable=/path/to/chromium --chrome-mode=chrome-for-testing`
- **Blank/white frames**: an asset path is wrong; use `staticFile()`.
- **Flicker**: an image or font not loaded; use `<Img>` and `@remotion/google-fonts`.
- **Slow render**: lower resolution/fps while testing, or use `--concurrency`.

## Templates
Copy-paste starting points. Read the one that fits:
- `templates/captions.md` - words highlighted in time with speech
- `templates/charts.md` - animated bar chart
- `templates/intro-outro.md` - title card + chaining scenes with `Series`
- `templates/vertical.md` - 1080x1920 clips for Reels/TikTok/Shorts

## Docs
https://www.remotion.dev/docs
