# FitWithMe: app launch (splash) video

**File:** `fitwithme-splash-1080x2400.mp4`
5.0 seconds, 1080x2400 (tall phone shape), 30 fps, H.264, no sound, about 800 KB.
Works for iOS and Android, on short and tall phones and on iPads held upright.

## How it fits every screen
- The background runs to every edge. Phones with different shapes only crop the dark background.
- The logo and name sit in a small box in the middle (600 px wide, 630 px tall on a 1080x2400 canvas).
- Tested by cropping the last frame to 16:9, 19.5:9, 20:9, 21:9 and 3:4 screens
  (`splash-video/poster/device-fit-test.png`). Nothing important was cut off.
- The very first frame is one flat color, `#0F1424`. Use the SAME color as your app's launch-screen
  background so there is no flash between the launch screen and the video.

## How to play it (tell your developer these three rules)
1. Fill the screen ("cover"). Do NOT stretch it and do NOT use "contain".
2. Play it once, muted. When it ends, hold the last frame or go straight to the app.
3. Set the screen behind the video to `#0F1424`.

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

Colors used: coral `#FF5A3C`, lime `#B6F23A`, white, background `#0F1424`.
Font: Outfit. Placeholder tagline: "Train together" (change it to your own).
