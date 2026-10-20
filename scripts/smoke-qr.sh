#!/usr/bin/env bash
# HTTP smoke test for the business-card QR redirects.
# Usage: scripts/smoke-qr.sh [base-url]   (default: https://www.turfinapp.com)
set -uo pipefail

BASE="${1:-https://www.turfinapp.com}"
IPHONE="Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1"
ANDROID="Mozilla/5.0 (Linux; Android 14; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Mobile Safari/537.36"
DESKTOP="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36"

fail=0
check() { # name path ua expected_status expected_location
  local out status location cache
  out=$(curl -s -o /dev/null -D - -A "$3" "$BASE$2")
  status=$(printf '%s' "$out" | awk 'NR==1{print $2}')
  location=$(printf '%s' "$out" | awk 'tolower($1)=="location:"{print $2}' | tr -d '\r')
  cache=$(printf '%s' "$out" | awk 'tolower($1)=="cache-control:"{$1="";print}' | tr -d '\r')
  if [[ "$status" == "$4" && "$location" == "$5" ]] && { [[ "$4" != 302 ]] || [[ "$cache" == *no-store* ]]; }; then
    echo "PASS  $1  → $status ${location:-(fallback page)}"
  else
    echo "FAIL  $1  → got $status '${location}' cache='${cache}', want $4 '$5'"; fail=1
  fi
}

check "user   iPhone " "/apps/user"   "$IPHONE"  302 "https://apps.apple.com/in/app/id6785032253"
check "user   Android" "/apps/user"   "$ANDROID" 302 "https://play.google.com/store/apps/details?id=in.mounterra.turfin"
check "user   desktop" "/apps/user"   "$DESKTOP" 200 ""
check "user   no UA  " "/apps/user"   ""         200 ""
check "vendor iPhone " "/apps/vendor" "$IPHONE"  302 "https://apps.apple.com/in/app/id6781202778"
check "vendor Android" "/apps/vendor" "$ANDROID" 302 "https://play.google.com/store/apps/details?id=com.reorbitals.turfinapp.vendor"
check "vendor desktop" "/apps/vendor" "$DESKTOP" 200 ""
check "query injection" "/apps/user?url=https://evil.example&redirect=https://evil.example" "$IPHONE" 302 "https://apps.apple.com/in/app/id6785032253"
check "unknown slug  " "/apps/other"  "$IPHONE"  404 ""

exit $fail
