#!/bin/sh

tslint --fix 'src/**/*.ts' & vue-cli-service build --target lib --name nio-core 'src/index.ts'