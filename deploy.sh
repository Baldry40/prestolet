#!/bin/bash
# Builds the app and creates a zip ready to upload to Plesk /httpdocs
# Usage: ./deploy.sh

set -e

echo "Building..."
npm run build

echo "Creating deploy.zip..."
zip -r deploy.zip \
  .next \
  public \
  prisma \
  src \
  app.js \
  package.json \
  package-lock.json \
  next.config.ts \
  tsconfig.json \
  --exclude "*.DS_Store"

echo ""
echo "Done. Upload deploy.zip to Plesk /httpdocs via File Manager, then:"
echo "  1. Extract it there"
echo "  2. Go to Node.js > Run Node.js commands and run: npm install --omit=dev"
echo "  3. Set your environment variables under 'Custom environment variables'"
echo "  4. Click Restart App"
