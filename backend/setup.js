#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up MindEase Backend...\n');

// Create .env file if it doesn't exist
const envPath = path.join(__dirname, '.env');
const envExamplePath = path.join(__dirname, '.env.example');

if (!fs.existsSync(envPath)) {
  if (fs.existsSync(envExamplePath)) {
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ Created .env file from .env.example');
  } else {
    // Create basic .env file
    const envContent = `# Database Configuration
MONGODB_URI=mongodb://localhost:27017/mindease

# Server Configuration
PORT=3000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=mindease-super-secret-jwt-key-2024
JWT_EXPIRE=7d

# CORS Configuration
FRONTEND_URL=http://localhost:8081
`;
    fs.writeFileSync(envPath, envContent);
    console.log('✅ Created .env file with default configuration');
  }
} else {
  console.log('ℹ️  .env file already exists');
}

console.log('\n📋 Setup Instructions:');
console.log('1. Make sure MongoDB is running on your system');
console.log('2. Update the MONGODB_URI in .env if needed');
console.log('3. Change the JWT_SECRET to a secure random string');
console.log('4. Run: npm start (or npm run dev for development)');
console.log('\n🔗 Backend will be available at: http://localhost:3000');
console.log('📊 Health check: http://localhost:3000/health');
console.log('\n✨ Setup complete!');

