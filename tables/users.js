const Sequelize = require('sequelize')

module.exports = {
    name: 'users',
    definition: {
        user_id: {
            type: Sequelize.STRING,
            unique: true
        },
        name: {
            type: Sequelize.STRING
        },
        message_count: {
            type: Sequelize.STRING
        }
    },
    methods: {
        
    }
}