module.exports = {
    components: {
        schemas: {
            Theme: {
                type: 'object',
                properties: {
                    id: { type: 'integer', format: 'int64' },
                    name: { type: 'string' },
                    description: { type: 'string' },
                }
            }
        }
    }
};