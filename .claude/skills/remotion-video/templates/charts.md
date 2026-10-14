# Template: Animated bar chart

Bars grow one after another.

`src/BarChart.tsx`
```tsx
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";

type Bar = { label: string; value: number };

export const BarChart = ({ data, color = "#4f8cff" }: { data: Bar[]; color?: string }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const max = Math.max(...data.map((d) => d.value));

  return (
    <AbsoluteFill style={{ backgroundColor: "#0b1020", padding: 120, justifyContent: "flex-end" }}>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 40, height: 700 }}>
        {data.map((d, i) => {
          const grow = spring({ frame: frame - i * 6, fps, config: { damping: 15 } });
          return (
            <div key={d.label} style={{ flex: 1, textAlign: "center", color: "white", fontSize: 36 }}>
              <div style={{ height: (d.value / max) * 600 * grow, background: color, borderRadius: 8 }} />
              <div style={{ marginTop: 16 }}>{d.label}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
```

Tips
- Delay each bar with `frame - i * 6` (6 frames apart).
- For lines, animate `strokeDashoffset` on an SVG path using `interpolate`.
- Keep numbers readable: show the value as text, rounded.
