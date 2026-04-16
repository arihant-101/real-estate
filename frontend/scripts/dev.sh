#!/usr/bin/env bash
ulimit -n 10240 2>/dev/null
exec npx next dev "$@"
