#!/bin/bash

# Build script for Breath School API
echo "🚀 Building Breath School API..."

# Clean previous build
echo "🧹 Cleaning previous build..."
rm -rf dist/

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build TypeScript and copy assets
echo "🔨 Building TypeScript and copying assets..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully!"
    echo "📁 Output directory: dist/"
    echo "📊 Build summary:"
    echo "   - TypeScript files compiled to dist/"
    echo "   - JavaScript assets copied to dist/"
    echo "   - Source maps generated"
    echo "   - Type declarations generated"
    echo ""
    echo "🚀 Available commands:"
    echo "   npm start          - Run production build"
    echo "   npm run dev        - Run development build"
    echo "   npm run dev:hex    - Run TypeScript hexagonal architecture"
    echo "   npm run dev:legacy - Run legacy JavaScript architecture"
    echo ""
    echo "🎯 Ready for deployment!"
else
    echo "❌ Build failed!"
    exit 1
fi
