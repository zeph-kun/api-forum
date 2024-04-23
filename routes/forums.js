const express = require('express');
const router = express.Router();
const { Forum, Message } = require('../models');


/**
 * @openapi
 * /{forumId}/messages:
 *   post:
 *     tags:
 *       - Message
 *     summary: Post a new message to a specific forum
 *     parameters:
 *       - in: path
 *         name: forumId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the forum to post the message in
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - subject
 *               - body
 *               - userId
 *             properties:
 *               subject:
 *                 type: string
 *               body:
 *                 type: text
 *               userId:
 *                 type: integer
 *             example:
 *               subject: "Welcome to the forum"
 *               body: "Excited to discuss with you all."
 *               userId: 1
 *     responses:
 *       201:
 *         description: Message created successfully
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: Forum not found
 */

router.post('/:forumId/messages', async (req, res) => {
    const { forumId } = req.params;
    const { subject, body, userId } = req.body;
    console.log(forumId);

    if (!subject || !body || !userId) {
        return res.status(400).json({ error: "Missing required fields: subject, body, userId" });
    }

    try {
        const forum = await Forum.findByPk(forumId);
        console.log(forumId);
        if (!forum) {
            return res.status(404).json({ message: "Forum not found" });
        }

        const message = await Message.create({
            subject,
            body,
            userId,
            forumId,
            replyToMessageId: null  // Assuming it's a new thread
        });

        res.status(201).json(message);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});

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

// /**
//  * @openapi
//  * /forums:
//  *   post:
//  *     tags:
//  *       - Forums
//  *     summary: Creates a new Forum
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             $ref: '#/components/schemas/Forum'
//  *     responses:
//  *       201:
//  *         description: Forum created
//  *         content:
//  *           application/json:
//  *             schema:
//  *               $ref: '#/components/schemas/Forum'
//  *       400:
//  *         description: Invalid message
//  */
//
// router.post('/', async (req, res) => {
//     try {
//         const forum = await Forum.create(req.body);
//         res.json(forum);
//     } catch (error) {
//         res.status(400).json({ error: error.toString() });
//     }
// });



module.exports = router;