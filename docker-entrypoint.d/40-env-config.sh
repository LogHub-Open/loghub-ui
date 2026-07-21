#!/bin/sh
set -eu

cat <<JS > /usr/share/nginx/html/env-config.js
window.__ENV__ = {
  LOGHUB_API_URL: "${LOGHUB_API_URL:-}",
  LOGHUB_API_KEY: "${LOGHUB_API_KEY:-}",
};
JS
