# Run Glimmer on your Windows machine (plain steps)

## One-time setup (about 10 minutes)
1. **Install Node.js.** Go to https://nodejs.org, click the big **LTS** button, run the installer, keep all the default choices.
2. **Get the files.** Download this project from GitHub (green **Code** button, then **Download ZIP**) and unzip it. You only need the `glimmer` folder.
3. **Start it once in demo mode.** Open the `glimmer` folder and double-click **start-glimmer.bat**. A black window opens and says "Glimmer is running". Open your browser at **http://localhost:3000**. You should see Glimmer with the "DEMO MODE" banner. Close the black window to stop it.

## Turn on real AI
4. In the `glimmer` folder, make a copy of `.env.example` and rename the copy to exactly **.env**
   (In File Explorer, turn on View > Show > File name extensions so it does not become `.env.txt`.)
5. Open `.env` in Notepad. Paste your laozhang.ai key after `LAOZHANG_API_KEY=`. Save. **Never send this file to anyone** (not to me, not by email).
6. Double-click **start-glimmer.bat** again. The window should say "(real AI on)". The page banner changes to "REAL AI is on for pictures".

## Using it from your phone or other computers at home (optional)
7. In `.env` set `HOST=0.0.0.0` and `ACCESS_PASSWORD=` a long password you make up. Never use 0.0.0.0 without a password.
8. Find the server's home-network address: press Windows key, type `cmd`, Enter, type `ipconfig`, look for "IPv4 Address" (like 192.168.1.20). On the other device open `http://192.168.1.20:3000` and type the password (username can be anything).
9. If Windows asks about the firewall, allow **Private networks only**.

## Safety rules
- Do NOT open a port on your router or put this on the internet. It is built for your home network only.
- Set a small spending limit on your laozhang.ai account.
- If the key ever leaks, make a new one on their site and update `.env`.

## Start automatically when Windows starts (optional)
Press Windows + R, type `shell:startup`, Enter, and drop a shortcut to **start-glimmer.bat** in that folder.
