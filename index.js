// import the application from the local file it is stored in.
const EmployeeCMS = require(`./applicationClass`)

// create a new instance of the application
const beginCMS = new EmployeeCMS()

// invoke the applications starting function to allow the program to begin running.
beginCMS.welcomeMessage();