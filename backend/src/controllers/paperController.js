const Paper = require('../models/Paper');
const User = require('../models/User');
const { Op } = require('sequelize');

// Get all papers with optional filtering
const getPapers = async (req, res) => {
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

        const papers = await Paper.findAndCountAll({
            where,
            include: [{
                model: User,
                as: 'author',
                attributes: ['id', 'name', 'email', 'institution']
            }],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['created_at', 'DESC']]
        });

        res.json({
            success: true,
            papers: papers.rows,
            total: papers.count,
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

// Get single paper by ID
const getPaper = async (req, res) => {
    try {
        const { id } = req.params;

        const paper = await Paper.findByPk(id, {
            include: [{
                model: User,
                as: 'author',
                attributes: ['id', 'name', 'email', 'institution', 'wallet_address']
            }]
        });

        if (!paper) {
            return res.status(404).json({
                success: false,
                error: 'Paper not found'
            });
        }

        res.json({
            success: true,
            paper
        });
    } catch (error) {
        console.error('Error fetching paper:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch paper',
            message: error.message
        });
    }
};

// Create new paper
const createPaper = async (req, res) => {
    try {
        const { title, abstract, content_hash, file_url, author_id } = req.body;

        // Validation
        if (!title || !abstract || !content_hash) {
            return res.status(400).json({
                success: false,
                error: 'Title, abstract, and content_hash are required'
            });
        }

        // Validate title length
        if (title.length > 255) {
            return res.status(400).json({
                success: false,
                error: 'Title must be less than 255 characters'
            });
        }

        // Validate abstract length
        if (abstract.length > 5000) {
            return res.status(400).json({
                success: false,
                error: 'Abstract must be less than 5000 characters'
            });
        }

        const paper = await Paper.create({
            title: title.trim(),
            abstract: abstract.trim(),
            content_hash,
            file_url,
            author_id,
            status: 'draft'
        });

        // Fetch the created paper with author details
        const createdPaper = await Paper.findByPk(paper.id, {
            include: [{
                model: User,
                as: 'author',
                attributes: ['id', 'name', 'email', 'institution']
            }]
        });

        res.status(201).json({
            success: true,
            message: 'Paper created successfully',
            paper: createdPaper
        });
    } catch (error) {
        console.error('Error creating paper:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create paper',
            message: error.message
        });
    }
};

// Update paper
const updatePaper = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, abstract, status, file_url, ipfs_cid } = req.body;

        const paper = await Paper.findByPk(id);

        if (!paper) {
            return res.status(404).json({
                success: false,
                error: 'Paper not found'
            });
        }

        // Update only provided fields
        if (title) paper.title = title.trim();
        if (abstract) paper.abstract = abstract.trim();
        if (status) paper.status = status;
        if (file_url) paper.file_url = file_url;
        if (ipfs_cid) paper.ipfs_cid = ipfs_cid;

        await paper.save();

        // Fetch updated paper with author details
        const updatedPaper = await Paper.findByPk(id, {
            include: [{
                model: User,
                as: 'author',
                attributes: ['id', 'name', 'email', 'institution']
            }]
        });

        res.json({
            success: true,
            message: 'Paper updated successfully',
            paper: updatedPaper
        });
    } catch (error) {
        console.error('Error updating paper:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update paper',
            message: error.message
        });
    }
};

// Delete paper
const deletePaper = async (req, res) => {
    try {
        const { id } = req.params;

        const paper = await Paper.findByPk(id);

        if (!paper) {
            return res.status(404).json({
                success: false,
                error: 'Paper not found'
            });
        }

        await paper.destroy();

        res.json({
            success: true,
            message: 'Paper deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting paper:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete paper',
            message: error.message
        });
    }
};

module.exports = {
    getPapers,
    getPaper,
    createPaper,
    updatePaper,
    deletePaper
};
