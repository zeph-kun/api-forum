module.exports = {
    components: {
        schemas: {
            Messages: {
                type: 'object',
                properties: {
                    id: { type: 'integer', format: 'int64' },
                    subject: { type: 'string' },
                    body: { type: 'string' },
                    userId: { type: 'integer', format: 'int64' },
                    replyToMessageId: { type: 'integer', format: 'int64' },
                }
            }
        }
    }
};