# Template: Audio, music and voiceover

Put sound files in `public/` (mp3 or wav). Load them with `staticFile()`.

`src/Narrated.tsx`
```tsx
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useVideoConfig } from "remotion";
import { getAudioDurationInSeconds } from "@remotion/media-utils";
import type { CalculateMetadataFunction } from "remotion";

type Props = { title: string; voice: string; music: string };

// Make the video exactly as long as the voiceover (+1 second of padding).
export const calcNarratedMetadata: CalculateMetadataFunction<Props> = async ({ props }) => {
  const seconds = await getAudioDurationInSeconds(staticFile(props.voice));
  return { durationInFrames: Math.ceil((seconds + 1) * 30) };
};

export const Narrated = ({ title, voice, music }: Props) => {
  const { fps, durationInFrames } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: "#0b1020", justifyContent: "center", alignItems: "center" }}>
      <h1 style={{ color: "white", fontSize: 110 }}>{title}</h1>

      {/* Background music: quiet, fades out over the last second. */}
      <Audio
        src={staticFile(music)}
        volume={(f) => interpolate(f, [durationInFrames - fps, durationInFrames], [0.15, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
      />

      {/* Voiceover starts half a second in, full volume. */}
      <Sequence from={Math.round(fps * 0.5)}>
        <Audio src={staticFile(voice)} volume={1} />
      </Sequence>
    </AbsoluteFill>
  );
};
```

Register it (note `calculateMetadata`):
```tsx
<Composition
  id="Narrated"
  component={Narrated}
  calculateMetadata={calcNarratedMetadata}
  durationInFrames={300}   // placeholder, replaced by calculateMetadata
  fps={30} width={1920} height={1080}
  defaultProps={{ title: "My story", voice: "voice.mp3", music: "music.mp3" }}
/>
```

Install: `npm i @remotion/media-utils`

Getting a voiceover
- Record yourself, or generate speech with a text-to-speech service, and save as `public/voice.mp3`. Never commit API keys; keep them in environment variables.
- Pair with `templates/captions.md`: feed it word timings from a transcription of the same file.

Rules
- Music volume 0.1-0.2 so the voice stays clear.
- `<Sequence from={...}>` delays when a sound starts.
- Audio is only in the final render (mp4). Stills (`remotion still`) have no sound.
- Check the sound made it in: `ffprobe out/video.mp4` should list an `Audio:` stream.
