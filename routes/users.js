const express = require('express');
const router = express.Router();
const { User, Message } = require('../models');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const Joi = require('joi');
const userSchema = Joi.object({
    firstName: Joi.string().alphanum().min(3).max(30).required(),
    lastName: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required()
});
const { Op } = require('sequelize');

function generateMessageUri(messageId) {
    return `/messages/${messageId}`;
}

/**
 * @openapi
 * /users/{id}:
 *   get:
 *     tags:
 *       - User
 *     summary: Recupère un utilisateur par son ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Détails de l'utilisateur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Utilisateur non trouvé
 *
 *
 */

router.get('/:id', async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id, {
            attributes: { exclude: ['password'] }
        });
        if (user) {
            res.json(user);
        } else {
            res.status(404).send('Utilisateur non trouvé');
        }
    } catch (error) {
        res.status(500).send(error.toString());
    }
});

/**
 * @openapi
 * /users:
 *   get:
 *     tags:
 *       - User
 *     summary: RÃ©cupÃ¨re une liste de tous les utilisateurs avec des options de filtrage, de tri et de pagination
 *     parameters:
 *       - in: query
 *         name: lastName
 *         schema:
 *           type: string
 *         description: Filtre par nom de famille
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         description: Filtre par email
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: Champ pour le tri
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Ordre de tri (ascendant ou descendant)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Limite le nombre de rÃ©sultats retournÃ©s
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *         description: Nombre de rÃ©sultats Ã  ignorer au dÃ©but
 *     responses:
 *       200:
 *         description: Liste des utilisateurs filtrÃ©e, triÃ©e et paginÃ©e
 *       500:
 *         description: Erreur serveur
 */

router.get('/', async (req, res) => {
    try {
        const filterOptions = {};
        if (req.query.lastName) {
            filterOptions.lastName = { [Op.like]: `${req.query.lastName}%` };
        }
        if (req.query.email) {
            filterOptions.email = { [Op.like]: `${req.query.email}%` };
        }
        const sortOptions = [];
        if (req.query.sortBy) {
            sortOptions.push([req.query.sortBy, req.query.sortOrder || 'asc']);
        }
        const limit = parseInt(req.query.limit, 10);
        const offset = parseInt(req.query.offset, 10);
        const users = await User.findAll({
            where: filterOptions,
            attributes: { exclude: ['password'] },
            include: [{ model: Message }],
            order: sortOptions.length ? sortOptions : undefined,
            limit: !isNaN(limit) ? limit : undefined,
            offset: !isNaN(offset) ? offset : undefined
        });
        const usersWithMessageUris = users.map(user => {
            const userJson = user.toJSON();
            if (userJson.Messages) {
                userJson.Messages = userJson.Messages.map(message => {
                    return { uri: generateMessageUri(message.id) };
                });
            }
            return userJson;
        });
        res.json(usersWithMessageUris);
    } catch (error) {
        res.status(500).send(error.toString());
    }
});

/**
 * @openapi
 * /users:
 *   post:
 *     tags:
 *       - User
 *     summary: CrÃ©e un nouvel utilisateur
 *     description: Enregistre un nouvel utilisateur dans la base de donnÃ©es.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - password
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: PrÃ©nom de l'utilisateur
 *               lastName:
 *                 type: string
 *                 description: Nom de famille de l'utilisateur
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Adresse email de l'utilisateur
 *               password:
 *                 type: string
 *                 description: Mot de passe
 *               roles:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["user", "admin"]
 *                 description: RÃ´les de l'utilisateur
 *     responses:
 *       201:
 *         description: Nouvel utilisateur crÃ©Ã© avec succÃ¨s
 *       400:
 *         description: DonnÃ©es invalides fournies
 */

router.post('/', async (req, res) => {
    try {
        const { error, value } = userSchema.validate(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }
        const existingUser = await User.findOne({ where: { email: req.body.email } });
        if (existingUser) {
            return res.status(400).send('Email déjà utilisé.');
        }
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
        const newUser = await User.create({
            ...req.body,
            password: hashedPassword
        });
        const userResponse = { ...newUser.toJSON() };
        delete userResponse.password;
        res.status(201).json(userResponse);

    } catch (error) {
        res.status(400).send(error.toString());
    }
});

/**
 * @openapi
 * /users/{id}:
 *   put:
 *     tags:
 *       - User
 *     summary: Met Ã  jour un utilisateur
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: "Jean"
 *               lastName:
 *                 type: string
 *                 example: "Dupont"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "jean.dupont@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "Password123!"
 *     responses:
 *       200:
 *         description: Utilisateur mis Ã  jour
 *       400:
 *         description: DonnÃ©es invalides ou email dÃ©jÃ  utilisÃ©
 *       404:
 *         description: Utilisateur non trouvÃ©
 */

router.put('/:id', async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).send('Utilisateur non trouvé');
        }
        const { error, value } = userSchema.validate(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }
        if (req.body.password) {
            req.body.password = await bcrypt.hash(req.body.password, saltRounds);
        }
        if (req.body.email && req.body.email !== user.email) {
            const existingUser = await User.findOne({ where: { email: req.body.email } });
            if (existingUser) {
                return res.status(400).send('Email déjà utilisé');
            }
        }
        await user.update(req.body);
        const updatedUser = user.get({ plain: true });
        delete updatedUser.password;
        res.json(updatedUser);
    } catch (error) {
        res.status(400).send(error.toString());
    }
});

/**
 * @openapi
 * /users/{id}:
 *   patch:
 *     tags:
 *       - User
 *     summary: Met Ã  jour partiellement un utilisateur
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Utilisateur mis Ã  jour
 *       400:
 *         description: DonnÃ©es invalides
 *       401:
 *         description: Non autorisÃ©
 *       403:
 *         description: AccÃ¨s interdit
 *       404:
 *         description: Utilisateur non trouvÃ©
 */

router.patch('/:id', async (req, res) => {
    try {

        const { error, value } = userSchema.validate(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).send('Utilisateur non trouvé');
        }
        if (req.body.password) {
            req.body.password = await bcrypt.hash(req.body.password, saltRounds);
        }
        await user.update(req.body);
        const updatedUser = { ...user.get({ plain: true }) };
        delete updatedUser.password;
        res.json(updatedUser);
    } catch (error) {
        res.status(500).send(error.toString());
    }
});

/**
 * @openapi
 * /users/{id}:
 *   delete:
 *     tags:
 *       - User
 *     summary: Supprime un utilisateur spÃ©cifiÃ© par ID
 *     description: Cette route permet de supprimer un utilisateur de la base de donnÃ©es.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Utilisateur supprimÃ© avec succÃ¨s
 *       404:
 *         description: Utilisateur non trouvÃ©
 *       500:
 *         description: Erreur interne du serveur
 */

router.delete('/:id', async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).send('Utilisateur non trouvé');
        }
        await user.destroy();
        res.send('Utilisateur supprimé');
    } catch (error) {
        console.error(`Erreur lors de la suppression de l'utilisateur: ${error}`);
        res.status(500).send('Erreur interne du serveur');
    }
});

module.exports = router;