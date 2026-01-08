# Pokémon Bulbasaur Fan Site · GBA Playground

An experiment to further learn about JavaScript, Node.js, React, and modern web development practices using Pokémon as the theme. Bulbasaur is my favorite Pokémon!

## 🎮 Features

- **GBA Emulator Integration**: Play Game Boy Advance games directly in your browser using EmulatorJS
- **React-Powered SPA**: Modern single-page application with component-based architecture
- **Node.js Backend**: RESTful API with Express.js following best practices
- **SQLite Database**: Logs ROM play events and provides statistics
- **Security Hardening**: Helmet, rate limiting, CORS, and input validation
- **Responsive Design**: Beautiful, modern UI that works on desktop and mobile

## 📋 Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [API Documentation](#api-documentation)
- [Development Best Practices](#development-best-practices)
- [Roadmap](#roadmap)
- [Contributing](#contributing)

## 🛠 Tech Stack

### Frontend
- **React 18** - Component-based UI library
- **Babel Standalone** - JSX compilation in the browser
- **EmulatorJS** - Browser-based GBA emulator
- **Vanilla CSS** - Custom styling with modern CSS features

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **SQLite3** - Lightweight database
- **Helmet** - Security middleware
- **express-rate-limit** - Rate limiting middleware
- **CORS** - Cross-origin resource sharing

## 📁 Project Structure

```
pokemon_app/
├── config/                 # Configuration files
│   └── index.js           # Centralized config with env vars
├── middleware/            # Express middleware
│   ├── errorHandler.js    # Global error handling
│   └── security.js       # Security middleware (Helmet, CORS, rate limiting)
├── routes/                # API routes
│   └── api.js            # All /api/* endpoints
├── db/                    # Database module
│   └── index.js          # SQLite operations
├── public/                # Static files served to client
│   ├── components/       # React components
│   │   ├── ErrorBoundary.js
│   │   ├── RomList.js
│   │   └── EmulatorFrame.js
│   ├── hooks/            # Custom React hooks
│   │   └── useSmoothScroll.js
│   ├── App.js            # Main React app component
│   ├── index.html        # Entry point HTML
│   ├── styles.css        # Global styles
│   ├── script.js         # Helper functions
│   └── emulator.html     # EmulatorJS iframe page
├── data/                  # Data directory
│   └── roms/            # Place .gba ROM files here
├── server.js             # Express server entry point
├── package.json          # Dependencies and scripts
├── .env.example         # Environment variables template
└── README.md            # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)
- Git (for version control)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/zo3f/pokemon_app.git
   cd pokemon_app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables** (optional)
   ```bash
   cp .env.example .env
   # Edit .env with your preferred settings
   ```

4. **Add ROM files**
   - Create `data/roms/` directory if it doesn't exist
   - Place your `.gba` ROM files in `data/roms/`

5. **Start the server**
   ```bash
   npm start
   ```

6. **Open your browser**
   - Navigate to `http://localhost:3000`
   - Click on a ROM to start playing!

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the project root (see `.env.example`):

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Paths (optional - defaults shown)
# ROMS_DIR=./data/roms
# PUBLIC_DIR=./public
# DB_PATH=./data.sqlite

# Security (optional - defaults shown)
# CORS_ORIGIN=http://localhost:3000
# RATE_LIMIT_WINDOW_MS=900000
# RATE_LIMIT_MAX=100
```

### NPM Scripts

- `npm start` - Start the server (defaults to development)
- `npm run dev` - Start in development mode
- `npm run prod` - Start in production mode

## 📡 API Documentation

### Health Check
```
GET /api/health
```
Returns server status and timestamp.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-12-18T12:00:00.000Z",
  "environment": "development"
}
```

### List ROMs
```
GET /api/roms
```
Returns a list of available `.gba` ROM files.

**Response:**
```json
{
  "roms": [
    "Pokemon - Fire Red Version.gba",
    "Pokemon - Ruby Version.gba"
  ]
}
```

### Log ROM Play
```
POST /api/rom-play
Content-Type: application/json

{
  "romName": "Pokemon - Fire Red Version.gba"
}
```
Logs a ROM play event to the database.

**Response:**
```json
{
  "ok": true
}
```

### Get ROM Statistics
```
GET /api/rom-stats
```
Returns play statistics for all ROMs.

**Response:**
```json
{
  "data": [
    {
      "rom_name": "Pokemon - Fire Red Version.gba",
      "play_count": 5,
      "last_played": "2025-12-18T12:00:00.000Z"
    }
  ]
}
```

## 🏗 Development Best Practices

### Node.js Backend

✅ **Modular Architecture**: Separated concerns into config, middleware, routes, and database modules  
✅ **Error Handling**: Custom `AppError` class and global error handler middleware  
✅ **Environment Variables**: Centralized configuration using `dotenv`  
✅ **Security**: Comprehensive security measures (see [SECURITY.md](./SECURITY.md)):
  - Helmet.js with comprehensive security headers
  - Rate limiting (API and POST endpoints)
  - CORS with restricted origins
  - Input validation and sanitization
  - Path traversal prevention
  - XSS prevention (multiple layers)
  - Request size limits
  - SQL injection prevention (parameterized queries)
✅ **Async/Await**: Modern async patterns with proper error handling  
✅ **Database**: SQLite with WAL mode for better concurrency  
✅ **Graceful Shutdown**: Handles SIGTERM and SIGINT signals

### React Frontend

✅ **Component Structure**: Separated into logical, reusable components following React best practices  
✅ **Custom Hooks**: `useSmoothScroll` for navigation behavior  
✅ **Error Boundaries**: Catches React errors and displays fallback UI  
✅ **Loading States**: Proper loading and error states for async operations  
✅ **Accessibility**: ARIA labels, semantic HTML, focus states, reduced motion support  
✅ **Performance**: Lazy loading for iframes, proper cleanup in useEffect  
✅ **Security**: XSS prevention through React auto-escaping and explicit sanitization  
✅ **Modern Design**: Sleek, minimal UI with CSS custom properties and responsive design

### Code Quality

✅ **Consistent Naming**: Clear, descriptive variable and function names  
✅ **Comments**: JSDoc-style comments for functions and modules  
✅ **Error Handling**: Try-catch blocks and proper error propagation  
✅ **Input Validation**: Server-side validation for all user inputs  
✅ **Security**: No XSS vulnerabilities, proper sanitization

## 📝 Roadmap

### Completed ✅

1. ✅ Integrated a simple UX-design with only the necessary components to play a ROM with the JS emulator (20-11-2025)
2. ✅ Added a basic EmulatorJS-powered GBA player so you can upload a `.gba` ROM and play it in the browser (18-12-2025)
3. ✅ Updated the main page to a modern single-page React-powered layout with an EmulatorJS play area and improved UX styling (18-12-2025)
4. ✅ Integrated a small SQLite database with NodeJS to log ROM play events and exposed simple stats APIs (18-12-2025)
5. ✅ Improved web security and hardening using Helmet, rate limiting, safer CORS, and an explicit error handler (18-12-2025)
6. ✅ Refactored backend to follow Node.js best practices: modular structure, proper error handling, environment variables, middleware organization (18-12-2025)
7. ✅ Refactored frontend to follow React best practices: component structure, custom hooks, error boundaries, loading states (18-12-2025)
8. ✅ Added configuration files: `.env.example`, improved `.gitignore`, npm scripts (18-12-2025)

### Future Enhancements 🔮

- [ ] Add user authentication and profiles
- [ ] Implement save state functionality
- [ ] Add ROM metadata and cover art
- [ ] Create admin dashboard for statistics
- [ ] Add multiplayer support
- [ ] Implement ROM favorites/bookmarks
- [ ] Add keyboard shortcuts for emulator controls
- [ ] Create Docker containerization
- [ ] Add unit and integration tests
- [ ] Implement CI/CD pipeline

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Use consistent indentation (2 spaces)
- Follow existing naming conventions
- Add comments for complex logic
- Write clear commit messages

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [EmulatorJS](https://github.com/EmulatorJS/EmulatorJS) - Browser-based emulator
- [React](https://react.dev/) - UI library
- [Express.js](https://expressjs.com/) - Web framework
- Pokémon and all related content © Nintendo/Creatures Inc./GAME FREAK inc.

## 🔒 Security

This application implements comprehensive security measures following OWASP best practices. See [SECURITY.md](./SECURITY.md) for detailed security documentation.

**Key Security Features:**
- HTTP security headers (Helmet.js)
- Input validation and sanitization
- Rate limiting
- XSS and injection prevention
- Path traversal protection
- CORS configuration
- Request size limits

## 📞 Support

For issues, questions, or suggestions, please open an issue on GitHub.

For security vulnerabilities, please report them responsibly (see [SECURITY.md](./SECURITY.md)).

---

**Built with ❤️ and Bulbasaur** 🍃
