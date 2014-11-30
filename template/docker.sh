#! /bin/bash -e

{{{dockerCLI}}} --tlsverify \
  --tlscacert {{{cacert}}} \
  --tlscert {{{cert}}} \
  --tlskey {{{key}}} \
  -H {{{host}}} \
  "$@"
