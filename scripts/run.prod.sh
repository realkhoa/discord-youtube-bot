#!/bin/sh

echo "Preparing environment variables";
export ENVIRONMENT=PROD;

echo "Install typescript and ts-node"
npm i -g typescript ts-node

echo "Installing dependencies";
yarn install;

echo "Starting building";

echo "Clearing old builds";
echo Deleted $(rm -rfv ./dist | wc -l) file;

echo Deploying slash commands
ts-node ./src/deploy.ts

echo "Building...";
tsc -p tsconfig.json;

echo "Done. Starting application";
node ./dist/index.js;
