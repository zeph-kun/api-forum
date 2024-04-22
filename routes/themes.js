const express = require('express');
const router = express.Router();
const { Theme } = require('../models');

/**
 * @openapi
 * /themes:
 *   get:
 *     tags:
 *       - Themes
 *     summary: Retrieves a list of all Themes
 *     responses:
 *       200:
 *         description: List of all Themes
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Theme'
 *       404:
 *         description: Themes not found
 */

router.get('/', async (req, res) => {
    try {
        const themes = await Theme.findAll();
        res.json(themes);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});

/**
 * @openapi
 * /themes:
 *   post:
 *     tags:
 *       - Themes
 *     summary: Creates a new message
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Theme'
 *     responses:
 *       201:
 *         description: Theme created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 *       400:
 *         description: Invalid message
 */

router.post('/', async (req, res) => {
    try {
        const theme = await Theme.create(req.body);
        res.json(theme);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});

module.exports = router;