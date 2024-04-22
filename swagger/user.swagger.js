module.exports = {
    components: {
        schemas: {
            User: {
                type: 'object',
                properties: {
                    id: { type: 'integer', format: 'int64' },
                    firstName: { type: 'string' },
                    lastName: { type: 'string' },
                    email: { type: 'string', format: 'email' },
                }
            }
        }
    }
};