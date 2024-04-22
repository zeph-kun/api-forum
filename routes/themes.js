const express = require('express');
const router = express.Router();
const { Theme, Message} = require('../models');

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
 * /themes/{id}:
 *   get:
 *     tags:
 *       - Themes
 *     summary: Recupère un theme par son ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Détails du theme
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Theme'
 *       404:
 *         description: Message non trouvé
 *
 */

router.get('/:id', async (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (!Number.isInteger(id)) {
        return res.status(400).json({ error: "Theme ID must be an integer." });
    }
    try {
        const theme = await Theme.findByPk(id);
        if (theme) {
            res.json(theme);
        } else {
            res.status(404).json({ message: "Theme not found." });
        }
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

/**
 * @openapi
 * /themes/{id}:
 *   delete:
 *     tags:
 *       - Themes
 *     summary: Supprime un theme spécifié par ID
 *     description: Cette route permet de supprimer un theme de la base de donnée.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Theme supprimé avec succès
 *       404:
 *         description: Theme non trouvé
 *       500:
 *         description: Erreur interne du serveur
 */

router.delete('/:id', async (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (!Number.isInteger(id)) {
        return res.status(400).json({ error: "Theme ID must be an integer." });
    }
    try {
        const theme = await Theme.findByPk(id);
        if (theme) {
            await theme.destroy();
            res.json({ message: "Theme deleted successfully." });
        } else {
            res.status(404).json({ message: "Theme not found." });
        }
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});

module.exports = router;