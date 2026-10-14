# Template: Title intro / outro card

A short card (2-3 seconds) with a title and subtitle. Use at the start or end.

`src/TitleCard.tsx`
```tsx
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export const TitleCard = ({ title, subtitle }: { title: string; subtitle?: string }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const rise = spring({ frame, fps, config: { damping: 14 } });
  const fadeOut = interpolate(frame, [durationInFrames - 15, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: "linear-gradient(135deg,#1b2a6b,#0b1020)", justifyContent: "center", alignItems: "center", opacity: fadeOut }}>
      <h1 style={{ color: "white", fontSize: 130, margin: 0, transform: `translateY(${(1 - rise) * 60}px)`, opacity: rise }}>{title}</h1>
      {subtitle && <p style={{ color: "#9fb3ff", fontSize: 48, opacity: rise }}>{subtitle}</p>}
    </AbsoluteFill>
  );
};
```

Chain with the main video using `<Series>`:
```tsx
<Series>
  <Series.Sequence durationInFrames={90}><TitleCard title="My Video" /></Series.Sequence>
  <Series.Sequence durationInFrames={600}><MainScene /></Series.Sequence>
  <Series.Sequence durationInFrames={90}><TitleCard title="Thanks for watching" /></Series.Sequence>
</Series>
```
