
const { create } = require('lodash');
const User = require('../models/User');
const { Op } = require('sequelize');



// Get all papers with optional filtering
const getUsers = async (req, res) => {
  try {
    const { status, search, limit = 50, offset = 0 } = req.query;

    const where = {};

    // Filter by status
    if (status) {
      where.status = status;
    }

    // Search by title or abstract
    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { abstract: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const users = await User.findAndCountAll();

    res.json({
      success: true,
      users: users.rows,
      total: users.count,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    console.error('Error fetching papers:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch papers',
      message: error.message
    });
  }
};



// Create new paper
const createUser = async (auth0_id) => {
  console.log("Creating user");
  try {
    console.log("Creating user with data:", auth0_id);


  
/*
    const paper = await User.create({
      
    });*/
    } catch (error) {
        console.error('Error creating paper:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create paper',
            message: error.message
        });
    }
};

module.exports = {
  createUser
};