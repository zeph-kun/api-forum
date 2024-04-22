module.exports = {
    components: {
        schemas: {
            Forum: {
                type: 'object',
                properties: {
                    id: { type: 'integer', format: 'int64' },
                    title: { type: 'string' },
                    description: { type: 'string' },
                    themeId: { type: 'integer', format: 'int64' },
                }
            }
        }
    }
};