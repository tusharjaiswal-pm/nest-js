// src/config/database.config.ts
export default () => ({
    database: {
        host: process.env.DATABASE_HOST,
        port: process.env.DATABASE_PORT ? parseInt(process.env.DATABASE_PORT, 10) : 5432,
        username: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASS,
        name: process.env.DATABASE_NAME,
        apiKey: process.env.API_KEY,
    },
});
