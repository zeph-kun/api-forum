const express = require('express');
const userRoutes = require('./routes/users');
const messageRoutes = require('./routes/messages');
const themesRoutes = require('./routes/themes');
const forumsRoutes = require('./routes/forums');
const app = express();
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const swaggerOptions = require('./config/swaggerConfig');
const { sequelize } = require('./models');
const port = 3000;


app.use(express.json());
app.use(express.static('public'));
app.use('/users', userRoutes);
app.use('/messages', messageRoutes);
app.use('/themes', themesRoutes);
app.use('/forums', forumsRoutes);


sequelize.sync().then(() => {
    console.log('Les modèles ont été synchronisés avec la base de données.');
});

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.listen(port, () => {
    console.log(`Serveur lancé sur http://localhost:${port}`);
});