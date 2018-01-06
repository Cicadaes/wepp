module.exports = {
    env: 'development',
    // set true in dev-mode for detail info
    detailedErrors: true,
    model: {
        defaultAdapter: 'mysql'
    },
    db: {
        mysql: {
            host: 'localhost',
            user: 'root',
            database: '',
            password: 'root',
        }
    }
}