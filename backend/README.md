# MindEase Backend API

A RESTful API built with Express.js and MongoDB for the MindEase Lite mental health application.

## Features

- **User Authentication**: JWT-based authentication with registration and login
- **Mood Tracking**: Record and track mood, stress, and anxiety levels
- **Timer Sessions**: Manage meditation and mindfulness timer sessions
- **Statistics**: Get insights and analytics on mood and timer data
- **Security**: Rate limiting, CORS, helmet security headers

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the backend directory:
```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/mindease

# Server Configuration
PORT=3000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=7d

# CORS Configuration
FRONTEND_URL=http://localhost:8081
```

3. Start MongoDB (if running locally):
```bash
# On macOS with Homebrew
brew services start mongodb-community

# On Ubuntu/Debian
sudo systemctl start mongod

# On Windows
net start MongoDB
```

4. Start the server:
```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

## API Endpoints

### Authentication
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login user
- `GET /api/users/me` - Get current user (protected)
- `PUT /api/users/settings` - Update user settings (protected)

### Mood Tracking
- `POST /api/moods` - Add mood entry (protected)
- `GET /api/moods` - Get mood entries (protected)
- `GET /api/moods/stats` - Get mood statistics (protected)
- `PUT /api/moods/:id` - Update mood entry (protected)
- `DELETE /api/moods/:id` - Delete mood entry (protected)

### Timer Sessions
- `POST /api/timers` - Add timer session (protected)
- `GET /api/timers` - Get timer sessions (protected)
- `GET /api/timers/stats` - Get timer statistics (protected)
- `PUT /api/timers/:id` - Update timer session (protected)
- `PUT /api/timers/:id/complete` - Complete timer session (protected)
- `DELETE /api/timers/:id` - Delete timer session (protected)

### Health Check
- `GET /health` - Server health status

## Database Models

### User
- `name`: String (required)
- `email`: String (required, unique)
- `password`: String (required, hashed)
- `settings`: Object (theme, language, notifications)
- `isActive`: Boolean

### MoodEntry
- `userId`: ObjectId (reference to User)
- `mood`: Number (1-5 scale)
- `stress`: Number (1-5 scale)
- `anxiety`: Number (1-5 scale)
- `notes`: String (optional)

### TimerSession
- `userId`: ObjectId (reference to User)
- `duration`: Number (minutes)
- `completed`: Boolean
- `startTime`: Date
- `endTime`: Date (optional)
- `notes`: String (optional)

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Error Handling

All API responses follow this format:

**Success Response:**
```json
{
  "success": true,
  "data": { ... }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description"
}
```

## Development

### Project Structure
```
backend/
├── controllers/     # Route handlers
├── middleware/      # Custom middleware (auth, etc.)
├── models/         # MongoDB models
├── routes/         # API routes
├── server.js       # Main server file
├── package.json    # Dependencies
└── README.md       # This file
```

### Adding New Features

1. Create model in `models/`
2. Create controller in `controllers/`
3. Create routes in `routes/`
4. Import and use routes in `server.js`

## Production Deployment

1. Set `NODE_ENV=production`
2. Use a strong JWT secret
3. Configure MongoDB Atlas for cloud database
4. Set up proper CORS origins
5. Use a process manager like PM2
6. Set up SSL/HTTPS

## Testing

Test the API using tools like:
- Postman
- curl
- Thunder Client (VS Code extension)

Example curl commands:

```bash
# Health check
curl http://localhost:3000/health

# Register user
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

