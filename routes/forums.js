const express = require('express');
const router = express.Router();
const { Forum } = require('../models');

/**
 * @openapi
 * /forums:
 *   get:
 *     tags:
 *       - Forums
 *     summary: Retrieves a list of all Forums
 *     responses:
 *       200:
 *         description: List of all Forums
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Forums'
 *       404:
 *         description: Forums not found
 */

router.get('/', async (req, res) => {
    try {
        const forums = await Forum.findAll();
        res.json(forums);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});

/**
 * @openapi
 * /forums:
 *   post:
 *     tags:
 *       - Forums
 *     summary: Creates a new Forum
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Forum'
 *     responses:
 *       201:
 *         description: Forum created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Forum'
 *       400:
 *         description: Invalid message
 */

router.post('/', async (req, res) => {
    try {
        const forum = await Forum.create(req.body);
        res.json(forum);
    } catch (error) {
        res.status(400).json({ error: error.toString() });
    }
});

module.exports = router;