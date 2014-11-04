#! /bin/bash -e
docker --tlsverify \
  --tlscacert {{{cacert}}} \
  --tlscert {{{cert}}} \
  --tlskey {{{key}}} \
  -H {{{host}}} \
  $@
