#!/usr/bin/env bash
# fetch-stitch.sh — downloads a Stitch asset handling GCS redirects
URL="$1"
OUT="$2"
curl -L --fail --silent --show-error \
  -H "User-Agent: Mozilla/5.0 (compatible; StitchFetcher/1.0)" \
  "$URL" -o "$OUT"
echo "Saved to $OUT ($(wc -c < "$OUT") bytes)"
