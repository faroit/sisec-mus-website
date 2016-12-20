#!/usr/bin/env bash

rsync \
  -i \
  --delete \
  --exclude=thumbs/ \
  --exclude=./node_modules/ \
  --exclude=./src/ \
  --exclude=./app/ \
  --exclude=.babelrc \
  --exclude=.Gruntfile.js \
  --exclude=.git \
  --exclude=.gitignore \
  --exclude=.gitattributes \
  --exclude=.gitmodules \
  --exclude=.DS_store \
  --exclude=.DS_Store \
  --exclude=Thumbs.db \
  --exclude='._*' \
  --exclude='*.swp' \
  -a \
  -p \
  index.html \
  dist \
  data \
  media \
  iwal01wm@karli.rrze.uni-erlangen.de:/proj/websource/docs/kooperationen/www.sisec17.audiolabs-erlangen.de/websource
