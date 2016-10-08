#!/bin/env bash

mkdir downloads
youtube-dl $1 -o "downloads/$2.mp4"
