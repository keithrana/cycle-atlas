# FitWithMe: app launch (splash) video

**File:** `fitwithme-splash-1080x2400.mp4`
5.0 seconds, 1080x2400 (tall phone shape), 30 fps, H.264, no sound, about 800 KB.
Works for iOS and Android, on short and tall phones and on iPads held upright.

## How it fits every screen
- The background runs to every edge. Phones with different shapes only crop the dark background.
- The logo and name sit in a small box in the middle (600 px wide, 630 px tall on a 1080x2400 canvas).
- Tested by cropping the last frame to 16:9, 19.5:9, 20:9, 21:9 and 3:4 screens
  (`splash-video/poster/device-fit-test.png`). Nothing important was cut off.
- The very first frame is one flat color, `#070B16`. Use the SAME color as your app's launch-screen
  background so there is no flash between the launch screen and the video.

## How to play it (tell your developer these three rules)
1. Fill the screen ("cover"). Do NOT stretch it and do NOT use "contain".
2. Play it once, muted. When it ends, hold the last frame or go straight to the app.
3. Set the screen behind the video to `#070B16`.

| Platform | Setting that means "cover" |
|---|---|
| iOS (AVPlayerLayer) | `videoGravity = .resizeAspectFill` |
| Android (Media3 PlayerView) | `resizeMode = AspectRatioFrameLayout.RESIZE_MODE_ZOOM` |
| React Native (expo-video) | `contentFit="cover"` |
| Flutter (video_player) | wrap in `FittedBox(fit: BoxFit.cover, ...)` |

Keep a copy of `splash-video/poster/first-frame.png` or last-frame.png as a backup picture
in case the video cannot load.

## Edit and re-render
The source is in `splash-video/`. Change the text, colors or timing in
`splash-video/compositions/splash.html`, then from `splash-video/` run:

    npx hyperframes check
    npx hyperframes render --quality high --output renders/fitwithme-splash-1080x2400.mp4

Look and feel: copied from the real FitWithMe Android app (`keithrana/fitwithme-android`,
"Aurora" design). Logo = the heartbeat line that rises into an arrow, in a rounded tile.
Colors: midnight `#070B16`, mint `#36F1CD`, violet `#8B7CFF`, text `#F2F5FF`. Font: Roboto Black
(the Android system sans-serif the app uses).
Tagline "All in one calm place" is the end of the app's own sign-in line
("Your exercises, videos, health and routine, all in one calm place."). Change or delete it in
`splash-video/compositions/splash.html` (`id="fw-tag"`).

Tiny detail: after video compression the first frame decodes as about `#060914`, which is 1-2 steps
away from `#070B16`. You cannot see the difference.
