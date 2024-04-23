module.exports = {
    components: {
        schemas: {
            Message: {
                type: 'object',
                properties: {
                    id: { type: 'integer', format: 'int64' },
                    subject: { type: 'string' },
                    body: { type: 'string' },
                    userId: { type: 'integer', format: 'int64' },
                    forumId: { type: 'integer', format: 'int64' },
                    replyToMessageId: { type: 'integer', format: 'int64' },
                }
            }
        }
    }
};