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


echo "Building...";
tsc -p tsconfig.json;

echo Deploying slash commands
node ./dist/deploy.js

echo "Done. Starting application";
node ./dist/index.js;
