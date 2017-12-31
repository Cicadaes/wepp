var path = require('path');

var config = {
    // Default to development
    env: 'development',
    // Number of worker-processes to spawn
    workers: 2,
    // Prot to listen on
    port: 6000,
    // Set stdout to debug log-level
    debug: false,
    // List of files to watch in order to restart wepp on changes in development.
    // Set these in config/development.js
    watch: {
        files: [],
        include: '',
        exclude: ''
    },
    // Used anywhere you need to refer to the app
    appName: 'Wepp App',
    // Default to null, accept connections directed to any IPv4 address,
    host: null,
    // Project path
    __App__: path.normalize(process.env.INIT_CWD),
    // Wepp path
    __Root__: path.normalize(process.cwd()),
    // Default logfile location
    logPath: path.normalize(process.env.INIT_CWD + '/log'),
    // How long for a full rotation
    rotationWindow: 2 * 60 * 60 * 1000,
    // set true in dev-mode for detail info
    detailedErrors: true
}

module.exports = config;