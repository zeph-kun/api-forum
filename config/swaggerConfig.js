const userSwagger = require('../swagger/user.swagger');
const forumSwagger = require('../swagger/forum.swagger');
const themeSwagger = require('../swagger/theme.swagger');
const messageSwagger = require('../swagger/message.swagger');
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API de Forum',
            version: '1.0.0',
            description: 'API du Forum avec Node.js et Express',
        },
        servers: [{ url: 'http://localhost:3000', description: 'Serveur de Développement' }],
            components: {
                schemas: {
                    ...userSwagger.components.schemas,
                    ...themeSwagger.components.schemas,
                    ...messageSwagger.components.schemas,
                    ...forumSwagger.components.schemas
                }
            }
    },
    apis: ['./routes/*.js'],
};
module.exports = swaggerOptions;