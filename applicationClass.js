// imports the node packages that are integral for the functionality of the application
const inquirer = require("inquirer");
// import the database from the connection that we have set up in the sql connection file
const db = require(`./sqlConnection`)
require(`dotenv`).config()

// importing the header text from the helpers file.
const { headerText } = require(`./helpers`);

// Defines a new class called EmployeeCMS, all of the functionality of the application will deriver from here
class EmployeeCMS {
    constructor() {
        // Defines a title to be used for the start of the application
        this.title = headerText;
        this.breakStyle = `\n=========================\n`;
    }
    // Method for showing the Welcome screen, this includes the title of the program along with it directing the application to the homeScreen method next
    welcomeMessage() {
        console.log(this.title);
        this.homeScreen();
    }
    // The homeScreen method is asynchronous so the inquirer information can be stored inside of a constant variable as opposed to relying of .then statements.
    // The homeScreen is the primary navigation for that application, giving the user all the choices for any functionality it has to offer
    async homeScreen() {
        // start the inquirer prompt with the navigation choices
        const homeNavigation = await inquirer.prompt([
            {
                message: `Welcome to the Inner Employee CMS System.\n What would you like to do today?`,
                name: `homepage`,
                type: `list`,
                choices: [
                    `View All Departments`, `View All Jobs`, `View All Employee's`, `Add A Department`, `Add a Job Position`, `Add an Employee`, `Update Existing Employee`, `Quit`
                ]
            }
        ])
        // direct the navigation selection to the proper method
        switch (homeNavigation.homepage) {
            case `View All Departments`:
                this.viewAllDepartments();
                break;
            case `View All Jobs`:
                this.viewAllJobs();
                break;
            case `View All Employee's`:
                this.viewAllEmployees();
                break;
            case `Add A Department`:
                this.addDepartment();
                break;
            case `Add a Job Position`:
                this.addJobPosition();
                break;
            case `Add an Employee`:
                this.addEmployee();
                break;
            case `Update Existing Employee`:
                this.updateEmployee();
                break;
            case `Quit`:
                console.log(`GoodBye!`)
                process.exit();
            default: console.log(`something went wrong with your selection`);
                break;
        }
    }
    // used as a redirect and a console.clear so the application doesn't grow longer and longer in length (basically this is a stall point).
    async backToHome() {
        const backToHome = await inquirer.prompt([
            {
                message: `Press |Enter| to return to the main screen.`,
                type: `input`,
                name: `return`
            }
        ])
        // cleans the console window.
        console.clear();
        // redirect back to the welcomeMessage Method
        this.welcomeMessage();
        ;
    }
    // queries into the database to see all of the current departments that are stored inside of it.
    async viewAllDepartments() {
        await db.promise().query('SELECT department.id, department.department_name FROM department ORDER BY department.id')
            .then(([departments]) => {
                console.table(departments);
            });
        // sends to redirect back to the home screen via the backToHome method
        this.backToHome()
    }
    // Queries into the database to see all of the current jobs that are stored inside of it.
    async viewAllJobs() {
        await db.promise().query('SELECT job_title.id, job_title.title, job_title.salary, department.department_name AS "Department Name" FROM job_title JOIN department ON job_title.department_id = department.id ORDER BY job_title.id')
            .then(([positions]) => {
                console.table(positions);
            })
        // sends to redirect back to the home screen via the backToHome method
        this.backToHome()
    }
    // queries into the database to see all of the current employees that are stored inside of it. They are joined together via the relationships that have been set up in the schema so all the relevant information can be viewed in one centralized location.
    async viewAllEmployees() {
        await db.promise().query(`
        SELECT employee.id, 
        CONCAT(employee.first_name, ' ', employee.last_name) AS 'Employee Name', 
        job_title.title AS "Job Position", 
        job_title.salary AS "Salary",
        department.department_name AS 'Department',
        CONCAT(Manager.first_name, ' ', Manager.last_name) AS Manager
        FROM employee 
        LEFT JOIN employee Manager on Manager.id = employee.manager_id
        JOIN job_title ON employee.job_title_id = job_title.id
        JOIN department ON job_title.department_id = department.id
        ORDER BY employee.id`)
            .then(([employees]) => {
                console.table(employees);
            })
        // sends to redirect back to the home screen via the backToHome method
        this.backToHome();
    }
    // allows the user to add a custom department into the database.
    async addDepartment() {
        // takes in the users input for a new department to be added.
        const newDepartment = await inquirer.prompt([
            {
                message: `What is the Name of the new Department?`,
                type: `input`,
                name: `name`
            }
        ])
        // Takes the information from the inquirer prompt and queries into the database to insert a new item into the department table
        await db.promise().query(`INSERT INTO department (department_name) VALUES ('${newDepartment.name}');`);
        console.log(`New Department Has Been Added`);
        // Redirects to the viewAllDepartments method to show the newly updated information
        this.viewAllDepartments();
    }
    // allows the user to add a custom job position into the database.
    async addJobPosition() {
        // takes in the users information for the name of the position, along with the salary for the position.
        const newJobPosition = await inquirer.prompt([
            {
                message: `What is the name of the new job position?`,
                type: `input`,
                name: `title`
            },
            {
                message: `What is the Salary for this position?`,
                type: `input`,
                name: `salary`
            },
        ])
        // since the third parameter for the new job position is asking about which department that it belongs to, The Id and the name of all the departments that are currently located inside of the database are listed out so the user can pick which one that it fits into with ease.
        await db.promise().query(`SELECT * FROM department ORDER BY department.id`).then(([data]) => console.table(data))
        // grab the users input for which department the new job is located in.
        const departmentOwner = await inquirer.prompt({
            message: `Which Department does this position belong to? (please an id from the list above)`,
            type: `input`,
            name: `name`
        })
        // Takes all of the information provided by the user and queries into the database to insert into the job_title table to add the newly defined custom job.
        await db.promise().query(`INSERT INTO job_title (title, salary, department_id) 
        VALUES ('${newJobPosition.title}', ${newJobPosition.salary}, ${departmentOwner.name});`);
        console.log(`The job position of ${newJobPosition.title} has been added to the database`);
        // redirects back to the jobs screen so the newly added job can be seen along with the ones that have existed before.
        this.viewAllJobs();
    }
    // allows the user to add a new employee into the roster / team.
    async addEmployee() {
        // allows the user to input the information  for the first and last name for the new employee. This information is then saved inside of a constant variable called newEmployeeName
        const newEmployeeName = await inquirer.prompt([
            {
                message: `What is the new Employee's First name?`,
                type: `input`,
                name: `firstName`
            },
            {
                message: `What is the new Employee's last name?`,
                type: `input`,
                name: `lastName`
            }
        ])
        // because the third parameter for the employee is required to have a job title set for them, all of the current job titles that exist inside of the database are displayed so the user is able to pick one by id with ease.
        await db.promise().query(`SELECT job_title.id, job_title.title FROM job_title`).then(([data]) => {
            console.table(data);
        })
        // grabs the users selection of which job to assign this employee.
        const newEmployeeJT = await inquirer.prompt({
            message: `Please Select one of the existing Job Title ID numbers for this Employee`,
            type: `input`,
            name: `jobT`
        })
        // because the final parameter for an employee to be added is dependant on the managers ID, all of the current employees id and name are grabbed so the user can pick one with ease (I decided to not make this restricted to only those who's manager title is set to null, because managers can have managers as well.)
        await db.promise().query(`SELECT employee.id, CONCAT(employee.first_name, ' ', employee.last_name) AS 'Managers Name' FROM employee`).then(([data]) => { console.table(data) })
        // grabs the users selection for the ID of which employee is going to be set to the manager for the New employee.
        const isManager = await inquirer.prompt({
            message: `Who is the Manager for the new employee? (Select an ID from the list above)\n *If the New Employee is a manager type NULL*\n`,
            type: `input`,
            name: `manager`
        })
        // Takes all the information provided by the user and queries into the database to insert the new employee into the employee database.
        await db.promise().query(`INSERT INTO employee (first_name, last_name, job_title_id, manager_id)
        VALUES ('${newEmployeeName.firstName}','${newEmployeeName.lastName}',${newEmployeeJT.jobT},${isManager.manager});`)

        console.log(`${newEmployeeName.firstName} ${newEmployeeName.lastName} has been added to the database.`)
        // sends to redirect back to the home screen via the backToHome method
        this.backToHome();

    }
    // allows the user to change information of an individual employee
    async updateEmployee() {
        // displays the employees information so it can be references more easily
        await db.promise().query(`SELECT employee.id AS 'Employee ID', CONCAT(employee.first_name, ' ', employee.last_name) AS 'Employee Name' FROM employee ORDER BY employee.id`).then(([employees]) => { console.table(employees) })
        // grabs the users selection of the employee that they wish to edit, along with asking them if they would like to update said employee or delete them from the database
        const changeEmployee = await inquirer.prompt([
            {
                message: `Which Employee Will you be changing? (Please input the Associated ID number)`,
                name: `changeWho`,
                type: `input`,
            },

            {
                message: `What would you like to do with this Employee?`,
                name: `changeHow`,
                type: `list`,
                choices: [
                    `Update Information`, `Delete Employee`
                ],
                default: `Update Information`
            }
        ])
        // switch case in order to direct the selection to the proper method according to the users input
        switch (changeEmployee.changeHow) {
            case `Update Information`:
                this.changeEmployeeInformation(changeEmployee.changeWho)
                break;
            case `Delete Employee`:
                this.removeEmployee(changeEmployee.changeWho)
                break;
            default: console.log(`Something went wrong with your selection`);
                break;
        }
    }
    // allows the user to specify what they would like to change about the selected employee
    async changeEmployeeInformation(targetEmployee) {
        // grabs the users selection for what they will be changing
        const newEmployeeInformation = await inquirer.prompt([
            {
                message: `What would you like to change for employee id : ${targetEmployee}?`,
                name: `changeHow`,
                type: `list`,
                choices: [
                    `Change Job Position`, `Change First Name`, `Change Last Name`, `Change Their Manager`
                ]
            }
        ])
        // directs the selection to the proper function to be executed
        switch (newEmployeeInformation.changeHow) {
            case `Change Job Position`:
                await db.promise().query(`SELECT job_title.id, job_title.title FROM job_title`)
                    .then(([data]) => { console.table(data) })
                const jobUpdate = await inquirer.prompt([{
                    message: `Please Select an existing job title to assign this individual (Choose By ID)`,
                    type: `input`,
                    name: `newJob`
                }]);
                await db.promise().query(`UPDATE employee SET job_title_id = ${jobUpdate.newJob} 
                WHERE id = ${targetEmployee}`)
                console.log(`Employees job title has been updated`)
                this.backToHome();
                break;
            case `Change First Name`:
                const fNameUpdate = await inquirer.prompt({ message: `What is the new first name for this employee?`, type: `input`, name: `fName` });
                await db.promise().query(`UPDATE employee SET first_name = '${fNameUpdate.fName}' WHERE employee.id = ${targetEmployee}`)
                console.log(`First name has been updated`);
                this.backToHome();
                break;
            case `Change Last Name`:
                const lNameUpdate = await inquirer.prompt({ message: `What is the new Last name for this employee?`, type: `input`, name: `lname` });
                await db.promise().query(`UPDATE employee SET last_name = '${lNameUpdate.lname}' WHERE employee.id = ${targetEmployee}`)
                console.log(`last name has been updated`);
                this.backToHome();
                break;
            case `Change Their Manager`:
                await db.promise().query(`SELECT employee.id, CONCAT(employee.first_name, ' ', employee.last_name) AS 'Employee Name' FROM employee ORDER BY employee.id`).then(([data]) => {
                    console.table(data)
                })
                const updatedManager = await inquirer.prompt({
                    message: `What is the new manager id for this individual? (please select a number from the list above)`,
                    type: `input`,
                    name: `newManager`
                })
                await db.promise().query(`UPDATE employee SET manager_id = ${updatedManager.newManager} WHERE employee.id = ${targetEmployee}`)
                console.log(`The manager for the selected employee has been updated`);
                this.backToHome();
                break;
            default: console.log(`something went wrong with your selection`);
                break;
        }
    }

    async removeEmployee(targetEmployee) {
        await db.promise().query(`SELECT id, CONCAT(first_name, ' ', last_name) As 'Employee Name' FROM employee WHERE id = ?`, targetEmployee).then((data) => { console.table(data[0]) })
        const deleteConfirm = await inquirer.prompt([{
            message: `Are you Sure you want to Delete this Employee?`,
            type: `confirm`,
            name: `confirmDelete`
        }])
        if (deleteConfirm.confirmDelete) {
            await db.promise().query(`DELETE FROM employee WHERE id = ?`, targetEmployee)
            console.log(`Employee Has been Successfully Deleted from the Database.`)
            this.backToHome();
        } else {
            this.welcomeMessage();
        }
    }
}

module.exports = EmployeeCMS