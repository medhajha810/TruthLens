#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 TruthLens Setup Script');
console.log('========================\n');

// Check if Node.js version is compatible
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);

if (majorVersion < 16) {
  console.error('❌ Node.js 16 or higher is required. Current version:', nodeVersion);
  process.exit(1);
}

console.log('✅ Node.js version check passed:', nodeVersion);

// Create .env file if it doesn't exist
const envPath = path.join(__dirname, '.env');
const envExamplePath = path.join(__dirname, 'env.example');

if (!fs.existsSync(envPath) && fs.existsSync(envExamplePath)) {
  console.log('📝 Creating .env file from template...');
  fs.copyFileSync(envExamplePath, envPath);
  console.log('✅ .env file created successfully');
} else if (fs.existsSync(envPath)) {
  console.log('✅ .env file already exists');
} else {
  console.log('⚠️  No env.example found, skipping .env creation');
}

// Install backend dependencies
console.log('\n📦 Installing backend dependencies...');
try {
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Backend dependencies installed');
} catch (error) {
  console.error('❌ Failed to install backend dependencies');
  process.exit(1);
}

// Install frontend dependencies
console.log('\n📦 Installing frontend dependencies...');
try {
  execSync('npm install', { cwd: path.join(__dirname, 'client'), stdio: 'inherit' });
  console.log('✅ Frontend dependencies installed');
} catch (error) {
  console.error('❌ Failed to install frontend dependencies');
  process.exit(1);
}

// Create necessary directories
const dirs = ['logs', 'uploads'];
dirs.forEach(dir => {
  const dirPath = path.join(__dirname, dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`📁 Created directory: ${dir}`);
  }
});

console.log('\n🎉 Setup completed successfully!');
console.log('\n📋 Next steps:');
console.log('1. Edit .env file with your API keys (optional)');
console.log('2. Run "npm run dev" to start the development server');
console.log('3. Open http://localhost:3000 in your browser');
console.log('\n📚 For more information, check the README.md file');
console.log('\nHappy coding! 🚀'); 