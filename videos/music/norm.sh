#!/bin/bash
# usage: norm.sh in.wav out.mp3 target_LUFS  -> gain-matches to the target, limits peaks to -1.5 dBFS, encodes mp3
in=$1; out=$2; tgt=${3:--15}
I=$(ffmpeg -hide_banner -i "$in" -af ebur128 -f null - 2>&1 | awk '/I:/{v=$2} END{print v}')
G=$(python3 -c "print(round($tgt - ($I),2))")
ffmpeg -v error -y -i "$in" -af "volume=${G}dB,alimiter=limit=0.84:level=disabled" -b:a 192k "$out"
echo "$in: was ${I} LUFS, gain ${G} dB"
ffmpeg -hide_banner -i "$out" -af ebur128=peak=true -f null - 2>&1 | grep -E "^\s+(I|Peak):" 
