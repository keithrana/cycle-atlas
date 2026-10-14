# Template: Vertical clips (Reels / TikTok / Shorts)

Same code, different size. Register a vertical composition:

```tsx
<Composition
  id="Vertical"
  component={MyScene}
  width={1080}
  height={1920}
  fps={30}
  durationInFrames={30 * 30} // 30 seconds
/>
```

Render: `npx remotion render Vertical out/vertical.mp4`

Rules
- Keep text inside the **safe zone**: about 150px from the top, 350px from the bottom (apps cover those parts with buttons and captions), and 60px from the sides.
- Use big text (60px+). Phone screens are small.
- Keep clips under 60 seconds (Shorts limit); 15-30 seconds does best.
- Use `useVideoConfig()` for width/height instead of hard-coding, so the same scene works wide and tall.
- Put captions in the lower-middle, above the bottom safe zone (see captions.md).
