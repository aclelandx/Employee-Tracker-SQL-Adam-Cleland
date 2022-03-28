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
        await db.promise().query('SELECT department.id, department.department_name FROM department ORDER BY department.id')
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
        this.backToHome();
    }

    async addDepartment() {
        const newDepartment = await inquirer.prompt([
            {
                message: `What is the Name of the new Department?`,
                type: `input`,
                name: `name`
            }
        ])
        await db.promise().query(`INSERT INTO department (department_name) VALUES ('${newDepartment.name}');`);
        console.log(`New Department Has Been Added`);
        this.viewAllDepartments();
    }

    async addJobPosition() {
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
        await db.promise().query(`SELECT * FROM department ORDER BY department.id`).then(([data]) => console.table(data))
        const departmentOwner = await inquirer.prompt({
            message: `Which Department does this position belong to? (please an id from the list above)`,
            type: `input`,
            name: `name`
        })

        await db.promise().query(`INSERT INTO job_title (title, salary, department_id) 
        VALUES ('${newJobPosition.title}', ${newJobPosition.salary}, ${departmentOwner.name});`);
        console.log(`The job position of ${newJobPosition.title} has been added to the database`);
        this.viewAllJobs();
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