// import the packages that are required for the functionality of this code.
const sql = require(`mysql2`);
const inquirer = require(`inquirer`);
require(`dotenv`).config();

// Creates the settings for the sql connection to the database, the user, password, and the database name are all being pulled from an external env file so that the information can be more secure.
const sqlConnection = sql.createConnection({
    host: `localhost`,
    port: 3006,
    user: process.env.USERNAME,
    password: process.env.PASSWORD,
    database: process.env.DB_NAME
});