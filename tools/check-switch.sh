#!/usr/bin/env bash
# Checks the q-guard.app switch from WordPress.com to GitHub Pages (DNS at OVH).
# See docs/ovh-switch.md for the procedure.
#
#   tools/check-switch.sh before dns109.ovh.net   # before switching the name servers:
#                                                 # GitHub serves the site, and the dormant
#                                                 # OVH zone holds the right records
#   tools/check-switch.sh after                   # once the name servers point at OVH
set -u
DOMAIN=q-guard.app
GITHUB_A="185.199.108.153 185.199.109.153 185.199.110.153 185.199.111.153"
GITHUB_AAAA="2606:50c0:8000::153 2606:50c0:8001::153 2606:50c0:8002::153 2606:50c0:8003::153"
failures=0

check() { # label, expected, actual
  if [ "$2" = "$3" ]; then
    printf '  ok    %s\n' "$1"
  else
    printf '  FAIL  %s\n        expected: %s\n        got:      %s\n' "$1" "$2" "$3"
    failures=$((failures + 1))
  fi
}

sorted() { sed '/^$/d' | sort | paste -sd' ' -; }

records() { # server ("" = public resolver), name, type
  if [ -n "$1" ]; then dig +short "$3" "$2" "@$1"; else dig +short "$3" "$2"; fi | sorted
}

zone_checks() { # server
  local ns=$1
  check "A $DOMAIN" "$(printf '%s\n' $GITHUB_A | sorted)" "$(records "$ns" $DOMAIN A)"
  check "AAAA $DOMAIN" "$(printf '%s\n' $GITHUB_AAAA | sorted)" "$(records "$ns" $DOMAIN AAAA)"
  check "CNAME www" "q-leap.github.io." "$(dig +short CNAME www.$DOMAIN ${ns:+@$ns})"
  check "MX (Outlook mail)" "0 qguard-app0c.mail.protection.outlook.com." "$(dig +short MX $DOMAIN ${ns:+@$ns})"
  check "TXT (SPF + Microsoft)" '"MS=ms40901918" "v=spf1 include:spf.protection.outlook.com -all"' "$(records "$ns" $DOMAIN TXT)"
  check "CNAME autodiscover" "autodiscover.outlook.com." "$(dig +short CNAME autodiscover.$DOMAIN ${ns:+@$ns})"
  check "CNAME selector1._domainkey (DKIM)" "selector1-qguard-app0c._domainkey.qleap365.onmicrosoft.com." "$(dig +short CNAME selector1._domainkey.$DOMAIN ${ns:+@$ns})"
  check "CNAME selector2._domainkey (DKIM)" "selector2-qguard-app0c._domainkey.qleap365.onmicrosoft.com." "$(dig +short CNAME selector2._domainkey.$DOMAIN ${ns:+@$ns})"
  check "TXT _dmarc" '"v=DMARC1;p=none;"' "$(dig +short TXT _dmarc.$DOMAIN ${ns:+@$ns})"
}

case "${1:-}" in
  before)
    ns=${2:?"give one of the OVH name servers shown in OVH > Domain names > $DOMAIN > DNS servers, e.g. dns109.ovh.net"}
    echo "GitHub Pages serves $DOMAIN (forced to GitHub's IP, DNS untouched):"
    check "home page" 200 "$(curl -s -o /dev/null -w '%{http_code}' --resolve $DOMAIN:80:185.199.108.153 http://$DOMAIN/)"
    check "contact page" 200 "$(curl -s -o /dev/null -w '%{http_code}' --resolve $DOMAIN:80:185.199.108.153 http://$DOMAIN/contact/)"
    check "internal docs not published" 404 "$(curl -s -o /dev/null -w '%{http_code}' --resolve $DOMAIN:80:185.199.108.153 http://$DOMAIN/docs/architecture.md)"
    echo "Dormant OVH zone on $ns:"
    zone_checks "$ns"
    echo "Registry:"
    check "no DNSSEC DS record (a stale one would break resolution)" "" "$(dig +short DS $DOMAIN)"
    ;;
  after)
    echo "Delegation:"
    printf '  info  name servers: %s\n' "$(dig +short NS $DOMAIN | sorted)"
    echo "Public DNS:"
    zone_checks ""
    echo "Site:"
    check "https://$DOMAIN/ (valid certificate)" 200 "$(curl -s -o /dev/null -w '%{http_code}' https://$DOMAIN/)"
    check "https://www.$DOMAIN/ redirects" 301 "$(curl -s -o /dev/null -w '%{http_code}' https://www.$DOMAIN/)"
    check "served by GitHub" "GitHub.com" "$(curl -sI https://$DOMAIN/ | tr -d '\r' | awk -F': ' 'tolower($1)=="server"{print $2}')"
    ;;
  *)
    echo "usage: $0 before <ovh-name-server> | after" >&2
    exit 2
    ;;
esac

echo
if [ "$failures" -eq 0 ]; then echo "All checks passed."; else echo "$failures check(s) failed."; exit 1; fi
