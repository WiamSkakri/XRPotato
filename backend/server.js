require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { sequelize, testConnection } = require('./src/config/database');
const Paper = require('./src/models/Paper');
const User = require('./src/models/User');
const paperController = require('./src/controllers/paperController');
const userController = require('./src/controllers/userController');
const multer = require('multer');
const app = express();
const XRPService = require('./src/services/xrpService');


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

async function startServer(){
  await XRPService.initialize();
  // Middleware
  app.use(express.json());
  app.use(cors());
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

  app.get('/api/dbuser/:id', async (req, res) => {
    try {
      const userId = req.params.id;
      // Query to check if user exists
    const [results] = await sequelize.query(
      'SELECT EXISTS(SELECT 1 FROM users WHERE auth0_id = :userId) as exists',
      {
        replacements: { userId: userId },
        type: sequelize.QueryTypes.SELECT
      }
    );
    if(!results.exists){
      console.log("User does not exist, creating...");
      await userController.createUser({auth0_id: userId});
      const [resultt] = await sequelize.query(
      'INSERT INTO users (id, auth0_id, email) VALUES (gen_random_uuid(), :auth0_id, :email) RETURNING id',
      {
        replacements: { auth0_id: userId,
          email: userId + "@example.com"
         },
        type: sequelize.QueryTypes.INSERT
      }
    );
    
    res.json({
      success: true,
      userId: results[0].id,
      message: 'User created'
    });
    }

    res.json({
      success: true,
      exists: results.exists,
      userId: userId,
      message: results.exists ? 'User found' : 'User not found'
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
