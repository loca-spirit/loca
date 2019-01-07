#!/bin/sh
tslint --fix 'packages/core/src/**/*.ts'
tslint --fix 'packages/common/src/**/*.ts'
rm -rf packages/core/dist packages/common/dist
rm -rf packages/core/types packages/common/types
tsc -b packages/core packages/common
