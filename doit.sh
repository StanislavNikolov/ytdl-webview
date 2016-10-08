#!/bin/env bash

mkdir downloads
youtube-dl $1 -f mp4 -o "downloads/$2.mp4"
