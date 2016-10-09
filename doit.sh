#!/bin/env bash

mkdir downloads

if [[ "$3" == "3" ]]; then
	youtube-dl --no-color --newline $1 \
		-x --audio-format mp3 \
		-o "downloads/$2.mp3" > "downloads/$2.log"
else
	youtube-dl --no-color --newline $1 \
		-f mp4 \
		-o "downloads/$2.mp4" > "downloads/$2.log"
fi
