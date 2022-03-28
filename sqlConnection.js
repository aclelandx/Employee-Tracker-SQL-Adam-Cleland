// import the packages that are required for the functionality of this code.
const sql = require(`mysql2`);
require('dotenv').config()

// Creates the connection to the database and saves it in a constant variable named database.
const database = sql.createConnection({
    host: `localhost`,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
},
    console.log(`connected to the specified Database`)
);

// connect to the database, if an error occurs throw the error
database.connect((err) => {
    if (err) throw (err)
});

// Exports the database connection so that it can be utilized elsewhere in the application
module.exports = database