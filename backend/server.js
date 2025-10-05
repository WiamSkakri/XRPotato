require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { sequelize, testConnection } = require('./src/config/database');
const Paper = require('./src/models/Paper');
const User = require('./src/models/User');
const paperController = require('./src/controllers/paperController');
const multer = require('multer');
const app = express();
const XRPService = require('./src/services/xrpService');


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

async function startServer(){
  await XRPService.initialize();
  
  // CORS Configuration - Allow frontend domains
  const allowedOrigins = [
    'http://localhost:8080',
    'http://localhost:3000',
    process.env.FRONTEND_URL, // Set this in Render
  ].filter(Boolean); // Remove undefined values

  app.use(cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
        callback(null, true);
      } else {
        console.warn(`CORS blocked request from origin: ${origin}`);
        callback(null, true); // Allow all in production for now, restrict later
      }
    },
    credentials: true
  }));
  
  // Other Middleware
  app.use(express.json());
  app.use(helmet());
  app.use(morgan('combined'));

  // Setup model associations
  User.hasMany(Paper, { foreignKey: 'author_id', as: 'papers' });
  Paper.belongsTo(User, { foreignKey: 'author_id', as: 'author' });

  // Health check
  app.get('/health', (req, res) => {
    res.json({ 
      status: 'OK', 
      message: 'Server is running',
      timestamp: new Date().toISOString()
    });
  });

  // API test
  app.get('/api/test', (req, res) => {
    res.json({ 
      message: 'API is working!',
      version: '1.0.0'
    });
  });

  // Database connection test
  app.get('/api/db-test', async (req, res) => {
    try {
      await sequelize.authenticate();
      const [results] = await sequelize.query('SELECT version();');
      
      res.json({
        success: true,
        message: 'Database connection successful!',
        database: 'PostgreSQL (Supabase)',
        version: results[0].version
      });
    } catch (error) {
      console.error('Database connection error:', error);
      res.status(500).json({
        success: false,
        message: 'Database connection failed',
        error: error.message
      });
    }
  });

  // Paper routes - now using real database
  app.get('/api/papers', paperController.getPapers);
  app.get('/api/papers/:id', paperController.getPaper);
 app.post('/api/papers', upload.single('file'), paperController.createPaper);
  app.put('/api/papers/:id', paperController.updatePaper);
  app.delete('/api/papers/:id', paperController.deletePaper);

  // User routes (mock for now)
  app.get('/api/users/me', (req, res) => {
    console.log('👤 GET /api/users/me called');
    res.json({
      success: true,
      user: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Dr. Maria Rodriguez',
        email: 'maria@university.edu',
        role: 'author',
        wallet_address: 'rAuthor123...'
      }
    });
  });

  const PORT = process.env.PORT || 3001;

  // Start server and test database connection
  app.listen(PORT, async () => {
    console.log('✅ ScholarLed Backend Server Started!');
    console.log(` Port: ${PORT}`);
    console.log(` Health: http://localhost:${PORT}/health`);
    console.log(` API Test: http://localhost:${PORT}/api/test`);
    console.log(` DB Test: http://localhost:${PORT}/api/db-test`);
    console.log('');
    
    // Test database connection on startup
    await testConnection();
  });

}
startServer();
