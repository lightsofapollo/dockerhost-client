#! /bin/bash -e
echo "Activating {{alias}} - {{{{root}}}"
export REAL_DOCKER=$(which docker)
export PATH={{{root}}}:$PATH
