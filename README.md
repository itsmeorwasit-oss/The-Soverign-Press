# Sovereign Press

A modern writing platform where users can share articles, follow other writers, comment on content, and build their own reading community.

## Features

- 📝 **Write & Publish**: Create and publish articles with rich formatting
- 👥 **Follow Authors**: Build your network by following other writers
- 💬 **Comment & Engage**: Comment on articles and engage with the community
- ❤️ **Like Articles**: Show appreciation for great content
- 📚 **User Profiles**: View author profiles with all their published articles
- 🔍 **Search & Discover**: Find articles and authors easily
- ⭐ **Trending**: See what's popular on the platform

## Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** for data persistence
- **JWT** for authentication
- **Mongoose** for data modeling

### Frontend
- **React** with Vite
- **Tailwind CSS** for styling
- **Axios** for API requests
- **React Router** for navigation

## Project Structure

```
sovereign-press/
├── backend/           # Node.js/Express API server
├── frontend/          # React application
├── docs/             # Documentation
└── README.md         # This file
```

## Getting Started

### Prerequisites
- Node.js 16+
- MongoDB
- npm or yarn

### Installation

**Backend Setup**
```bash
cd backend
npm install
cp .env.example .env
# Update .env with your MongoDB URI and JWT secret
npm run dev
```

**Frontend Setup**
```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173`
The backend API will be at `http://localhost:5000`

## API Documentation

See [docs/API.md](docs/API.md) for detailed API endpoints.

## Contributing

We welcome contributions! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE file for details
