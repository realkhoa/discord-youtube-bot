#!/bin/sh

echo "Checking for update"
git pull

echo "Preparing environment variables";
export ENVIRONMENT=PROD;
export NODE_ENV=production;

echo "Install typescript and ts-node"
npm i -g typescript ts-node

echo "Installing dependencies";
yarn install;

echo "Starting building";

echo "Clearing old builds";
echo Deleted $(rm -rfv ./dist | wc -l) file;

echo "Building...";
tsc -p tsconfig.json;

echo "Creating database directory..."
mkdir .database/

echo "Preparing database..."
ts-node ./src/prepareDatabase.ts

echo Deploying slash commands
node ./dist/deploy.js

echo "Done. Starting application";
node ./dist/index.js;
