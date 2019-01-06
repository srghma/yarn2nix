#!/usr/bin/env bash

set -euo pipefail

THIS_SCRIPT_DIR=$(dirname "$(readlink -f "$BASH_SOURCE")")
PROJECT_ROOT=$(readlink -f "$THIS_SCRIPT_DIR/../..")
cd $THIS_SCRIPT_DIR
yarn install
node $PROJECT_ROOT/packages/cli/src/index.js > $THIS_SCRIPT_DIR/yarn.nix
