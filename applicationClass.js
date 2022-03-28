const inquirer = require("inquirer");
const db = require(`./sqlConnection`)
const { headerText } = require(`./helpers`);
require(`dotenv`).config()

class EmployeeCMS {
    constructor() {
        this.title = headerText;
        this.breakStyle = `\n=========================\n`;
    }

    welcomeMessage() {
        console.log(this.title);
        this.homeScreen();
    }

    async homeScreen() {
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

    async backToHome() {
        const backToHome = await inquirer.prompt([
            {
                message: `Press |Enter| to return to the main screen.`,
                type: `input`,
                name: `return`
            }
        ])
        console.clear();
        this.welcomeMessage();
        ;
    }

    async viewAllDepartments() {
        await db.promise().query('SELECT department.id, department.department_name FROM department')
            .then(([departments]) => {
                console.table(departments);
            });
        this.backToHome()
    }

    async viewAllJobs() {
        await db.promise().query('SELECT job_title.id, job_title.title, job_title.salary, department.department_name AS "Department Name" FROM job_title JOIN department ON job_title.department_id = department.id ORDER BY job_title.id')
            .then(([positions]) => {
                console.table(positions);
            })
        this.backToHome()
    }

    async viewAllEmployees() {
        await db.promise().query(`
        SELECT employee.id, 
        CONCAT(employee.first_name, ' ', employee.last_name) AS 'Employee Name', 
        job_title.title AS "Job Position", 
        job_title.salary AS "Salary",
        department.department_name AS 'Department'
        FROM employee 
        JOIN job_title ON employee.job_title_id = job_title.id
        JOIN department ON job_title.department_id = department.id
        ORDER BY employee.id`)
            .then(([employees]) => {
                console.table(employees);
            })
        this.backToHome();
    }

    addDepartment() {
        console.log(`You have chosen to add a department`);
    }

    addJobPosition() {
        console.log(`You have chosen to add a new job position`);

    }

    async addEmployee() {
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
        await db.promise().query(`SELECT job_title.id, job_title.title FROM job_title`).then(([data]) => {
            console.table(data);
        })
        const newEmployeeJT = await inquirer.prompt({
            message: `Please Select one of the existing Job Title ID numbers for this Employee`,
            type: `input`,
            name: `jobT`
        })

        await db.promise().query(`SELECT employee.id, CONCAT(employee.first_name, ' ', employee.last_name) AS 'Managers Name' FROM employee`).then(([data]) => { console.table(data) })

        const isManager = await inquirer.prompt({
            message: `Who is the Manager for the new employee? (Select an ID from the list above)\n *If the New Employee is a manager type NULL*\n`,
            type: `input`,
            name: `manager`
        })

        await db.promise().query(`INSERT INTO employee (first_name, last_name, job_title_id, manager_id)
        VALUES ('${newEmployeeName.firstName}','${newEmployeeName.lastName}',${newEmployeeJT.jobT},${isManager.manager});`)

        console.log(`${newEmployeeName.firstName} ${newEmployeeName.lastName} has been added to the database.`)

        this.backToHome();

    }

    async updateEmployee() {
        // displays the employees information so it can be references more easily
        await db.promise().query(`SELECT employee.id AS 'Employee ID', CONCAT(employee.first_name, ' ', employee.last_name) AS 'Employee Name' FROM employee ORDER BY employee.id`).then(([employees]) => { console.table(employees) })
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

    async changeEmployeeInformation(targetEmployee) {
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
        switch (newEmployeeInformation.changeHow) {
            case `Change Job Position`:
                await db.promise().query(`SELECT job_title.id, job_title.title FROM job_title`)
                    .then(([data]) => { console.table(data) })
                inquirer.prompt([{
                    message: `Please Select an existing job title to assign this individual (Choose By ID)`,
                }]);
                break;
            case `Change First Name`:
                console.log(`you have chosen to change the first name of ${targetEmployee}`);
                break;
            case `Change Last Name`:
                console.log(`you have chosen to change the last name of ${targetEmployee}`);
                break;
            case `Change Their Manager`:
                console.log(`you have chosen to change the manager of ${targetEmployee}`);
                break;
            default: console.log(`something went wrong with your selection`);
                break;
        }
        console.log(`you have chosen to change the employee with the id number of: ${targetEmployee}`)
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

const test = new EmployeeCMS();

test.welcomeMessage();


// module.exports = EmployeeCMS;

/*
WHEN  i chose to view all roles, 
    THEN i am presented with the job  title, role id, the department that the role belongs to, and the salary for that role
WHEN i choose to view all employees
    THEN i am presented with a formatted table showing employee data, including employee IDs, first names, last names, job titles, departments, salaries, and managers that the employees report to.
WHEN i choose to add a department
    THEN i am prompted to enter the name of the department and then that is added to the database
WHEN i choose to add a role
    THEN i am prompted to enter the the name, salary, and the department for the role and that role is added to the database
WHEN i choose to add an employee
    THEN i am prompted to enter the employee's first name, last name, role, and manager, and that employee is added to the database
WHEN i choose to update an employee's Role
    THEN i am prompted to select an employee to update and their new role and this information is updated into the database.
*/

/* 
THINGS THAT ARE STILL KIND OF BROKEN
For whatever reason the relationships i have set up in the database do not seem to want to be talking to one another.
*/