module.exports = {
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  port: process.env.DB_PORT || 5432,
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "eshop",
};
