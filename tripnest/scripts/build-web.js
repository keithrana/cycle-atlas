// Copies the web app files into www/ (the folder the Android app packs inside itself).
const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..");
const out = path.join(root, "www");
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(path.join(out, "icons"), { recursive: true });
["index.html", "manifest.webmanifest", "sw.js"].forEach((f) => fs.copyFileSync(path.join(root, f), path.join(out, f)));
fs.readdirSync(path.join(root, "icons"))
  .filter((f) => !/1024/.test(f))
  .forEach((f) => fs.copyFileSync(path.join(root, "icons", f), path.join(out, "icons", f)));
console.log("web files copied to www/");
