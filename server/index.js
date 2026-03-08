require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const sequelize = require('./config/database');
const errorHandler = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/auth');
const donationRoutes = require('./routes/donations');
const partnerRoutes = require('./routes/partners');

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ──────────────────────────────────────────────

// CORS configuration
app.use(cors({
    origin: process.env.NODE_ENV === 'production'
        ? process.env.CLIENT_URL
        : ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
const uploadsDir = path.join(__dirname, '..', process.env.UPLOAD_DIR || 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// ─── API Routes ─────────────────────────────────────────────

app.use('/api/auth', authRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/partners', partnerRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'FoodBridge API is running 🌉',
        timestamp: new Date().toISOString(),
    });
});

// ─── Error Handler ──────────────────────────────────────────

app.use(errorHandler);

// ─── Start Server ───────────────────────────────────────────

const startServer = async () => {
    try {
        // Test database connection
        await sequelize.authenticate();
        console.log('✅ PostgreSQL connected successfully.');

        // Sync models (development only — use migrations in production)
        if (process.env.NODE_ENV === 'development') {
            await sequelize.sync({ alter: true });
            console.log('✅ Database models synced.');
        }

        app.listen(PORT, () => {
            console.log(`
  ╔══════════════════════════════════════════════╗
  ║                                              ║
  ║   🌉 FoodBridge API Server                   ║
  ║   Running on http://localhost:${PORT}          ║
  ║   Environment: ${process.env.NODE_ENV || 'development'}              ║
  ║                                              ║
  ╚══════════════════════════════════════════════╝
      `);
        });
    } catch (error) {
        console.error('❌ Unable to start server:', error.message);
        process.exit(1);
    }
};

startServer();
