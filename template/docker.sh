#! /bin/bash -e

cmd=docker
if [ ! -z "$REAL_DOCKER" ];
then
  cmd=$REAL_DOCKER
fi

eval $cmd --tlsverify \
  --tlscacert {{{cacert}}} \
  --tlscert {{{cert}}} \
  --tlskey {{{key}}} \
  -H {{{host}}} \
  $@
