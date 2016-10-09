#!/bin/env bash

mkdir downloads
youtube-dl --no-color --newline $1 -f mp4 -o "downloads/$2.mp4" > "downloads/$2.log"
