const express = require('express');
const router = express.Router();
const { Message } = require('../models');

/**
 * @openapi
 * /messages/user/{userId}:
 *   get:
 *     tags:
 *       - Message
 *     summary: Retrieves messages by userId
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Details of the messages
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 *       404:
 *         description: Messages not found
 */

router.get('/user/:userId', async (req, res) => {
    const userId = parseInt(req.params.userId, 10);
    if (!Number.isInteger(userId)) {
        return res.status(400).json({ error: "User ID must be an integer." });
    }
    try {
        const messages = await Message.findAll({
            where: { userId: userId }
         });
        if (messages.length > 0) {
            res.json(messages);
        } else {
            res.status(404).json({ message: "No messages found for this user." });
        }
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});

/**
 * @openapi
 * /messages:
 *   get:
 *     tags:
 *       - Message
 *     summary: Retrieves a list of all messages with pagination
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         required: false
 *         description: Page number starting from 0
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         required: false
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Paginated list of messages
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 *       404:
 *         description: Messages not found
 */

router.get('/', async (req, res) => {
    const { page, limit } = req.query;
    const { limit: queryLimit, offset } = getPagination(page, limit);

    try {
        const data = await Message.findAndCountAll({
            limit: queryLimit,
            offset: offset,
            order: [['createdAt', 'DESC']]
        });
        const response = getPagingData(data, page, queryLimit);
        if (response.messages.length > 0) {
            res.json(response);
        } else {
            res.status(404).json({ message: "No messages found." });
        }
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});

function getPagination(page, size) {
    const limit = size ? +size : 10;
    const offset = page ? page * limit : 0;
    return { limit, offset };
}

function getPagingData(data, page, limit) {
    const { count: totalItems, rows: messages } = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);
    return { totalItems, messages, totalPages, currentPage };
}

/**
 * @openapi
 * /messages:
 *   post:
 *     tags:
 *       - Message
 *     summary: Creates a new message
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Message'
 *     responses:
 *       201:
 *         description: Message created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 *       400:
 *         description: Invalid message
 */

// POST /messages
router.post('/', async (req, res) => {
    const message = req.body;
    try {
        const newMessage = await Message.create(message);
        res.status(201).json(newMessage);
    } catch (error) {
        res.status(400).json({ error: error.toString() });
    }
});


/**
 * @openapi
 * /messages/{id}:
 *   get:
 *     tags:
 *       - Message
 *     summary: Recupère un message par son ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Détails du message
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 *       404:
 *         description: Message non trouvé
 *
 */

// Get a message by ID
router.get('/:id', async (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (!Number.isInteger(id)) {
        return res.status(400).json({ error: "Message ID must be an integer." });
    }
    try {
        const message = await Message.findByPk(id);
        if (message) {
            res.json(message);
        } else {
            res.status(404).json({ message: "Message not found." });
        }
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});


// Delete a message by ID

/**
 * @openapi
 * /messages/{id}:
 *   delete:
 *     tags:
 *       - Message
 *     summary: Supprime un message spécifié par ID
 *     description: Cette route permet de supprimer un message de la base de donnée.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Message supprimé avec succès
 *       404:
 *         description: Message non trouvé
 *       500:
 *         description: Erreur interne du serveur
 */

router.delete('/:id', async (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (!Number.isInteger(id)) {
        return res.status(400).json({ error: "Message ID must be an integer." });
    }
    try {
        const message = await Message.findByPk(id);
        if (message) {
            await message.destroy();
            res.json({ message: "Message deleted." });
        } else {
            res.status(404).json({ message: "Message not found." });
        }
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});

module.exports = router;