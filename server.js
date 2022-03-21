// import the packages that are required for the functionality of this code.
const sql = require(`mysql2`);
const inquirer = require(`inquirer`);
require(`dotenv`).config();

// import the packages required for the express server, also set the port to be defaulted to 3001 if it is not on a server
const express = require(`express`);
const PORT = process.env.PORT || 3001;
const app = express();

// mounting the express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Creates the settings for the sql connection to the database, the user, password, and the database name are all being pulled from an external env file so that the information can be more secure.
const database = sql.createConnection({
    host: `localhost`,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
},
    console.log(`connected to the specified Database`)
);

// sets up the default response for any other request that does not match something in the server (error code 404).
app.use((req, res) => { res.status(404).end() });

// tells the application which port to be listening on.
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
