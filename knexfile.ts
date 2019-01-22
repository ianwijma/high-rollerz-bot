import * as path from 'path';

module.exports = {

    development: {
        client: 'sqlite3',
        connection: {
            filename: 'database/database.sqlite'
        },
        useNullAsDefault: true,
        migrations: {
            directory: path.join(__dirname, 'migrations'),
        },
    }
}