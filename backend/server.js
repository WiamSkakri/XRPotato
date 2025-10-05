require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();

// Basic middleware only
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('combined'));

// Mock user data
const mockUsers = [
  {
    id: 1,
    name: 'Dr. Maria Rodriguez',
    email: 'maria@university.edu',
    role: 'author',
    wallet_address: 'rAuthor123...'
  },
  {
    id: 2,
    name: 'Prof. James Chen', 
    email: 'james@research.org',
    role: 'reviewer',
    wallet_address: 'rReviewer456...'
  }
];

const mockPapers = [
  {
    id: 1,
    title: 'Quantum Computing Basics',
    author: 'Dr. Maria Rodriguez', 
    status: 'published',
    abstract: 'Introduction to quantum computing principles...',
    created_at: new Date().toISOString()
  },
  {
    id: 2, 
    title: 'Blockchain in Academic Publishing',
    author: 'Prof. James Chen',
    status: 'under_review',
    abstract: 'Exploring blockchain applications in scholarly communication...',
    created_at: new Date().toISOString()
  }
];

// SIMPLE TEST ROUTES ONLY
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'API is working!',
    version: '1.0.0'
  });
});



// GET all papers
app.get('/api/papers', (req, res) => {
  console.log('📚 GET /api/papers called');
  res.json({
    success: true,
    papers: mockPapers,
    count: mockPapers.length
  });
});

// GET single paper by ID
app.get('/api/papers/:id', (req, res) => {
  const paperId = parseInt(req.params.id);
  console.log(`📄 GET /api/papers/${paperId} called`);
  
  const paper = mockPapers.find(p => p.id === paperId);
  
  if (!paper) {
    return res.status(404).json({
      success: false,
      error: 'Paper not found'
    });
  }
  
  res.json({
    success: true,
    paper: paper
  });
});

// POST create new paper
app.post('/api/papers', (req, res) => {
  console.log('📝 POST /api/papers called');
  console.log('Request body:', req.body);
  
  const { title, abstract, author } = req.body;
  
  // Basic validation
  if (!title || !abstract) {
    return res.status(400).json({
      success: false,
      error: 'Title and abstract are required'
    });
  }
  
  // Create new paper
  const newPaper = {
    id: mockPapers.length + 1,
    title,
    abstract, 
    author: author || 'Anonymous',
    status: 'draft',
    created_at: new Date().toISOString()
  };
  
  mockPapers.push(newPaper);
  
  res.status(201).json({
    success: true,
    message: 'Paper created successfully',
    paper: newPaper
  });
});



// GET current user (mock - will integrate with Auth0 later)
app.get('/api/users/me', (req, res) => {
  console.log('👤 GET /api/users/me called');
  
  // For now, return the first user as mock
  const user = mockUsers[0];
  
  res.json({
    success: true,
    user: user
  });
});

// GET all users (for testing)
app.get('/api/users', (req, res) => {
  console.log('👥 GET /api/users called');
  res.json({
    success: true,
    users: mockUsers
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log('✅ ScholarLed Backend Server Started!');
  console.log(` Port: ${PORT}`);
  console.log(` Health: http://localhost:${PORT}/health`);
  console.log(` API Test: http://localhost:${PORT}/api/test`);
});