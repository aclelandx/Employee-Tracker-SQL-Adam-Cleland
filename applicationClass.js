const inquirer = require("inquirer");
const sql = require(`mysql2`);

class EmployeeCMS {
    constructor() {
        this.headerName = `------EMPLOYEE CMS------`;
        this.breakStyle = `\n=========================\n`;
    }

    homeScreen() {
        console.log(this.breakStyle, this.headerName, this.breakStyle,
            `ello Govna`)
    }

    methodTwo() {

    }

    methodThree() {

    }
}

const test = new EmployeeCMS();

test.homeScreen();

const welcomeText = `
 ______                 _                        _____ __  __  _____ 
|  ____|               | |                     /  ____|  |/  |/ ____|
| |__   _ __ ___  _ __ | | ___  _   _  ___  ___| |    | ||-| | (___  
|  __| | '_ - _ || '_ || |/ _ || | | |/ _ |/ _ | |    | |  | |L___ | 
| |____| | | | | | |_) | | (_) | |_| |  __/  __/ |____| |  | |____) |
|______|_| |_| |_| .__/|_||___/|__, ||___||___||______|_|  |_|_____/ 
                 | |             __/ |         
 ________________|_|____________|___/_______________________________
|_______Developed By Adam Cleland || An OSU Boot Camp Project_______|                                
`;

console.log(welcomeText);



// module.exports = EmployeeCMS;

/*
ACCEPTANCE CRITERIA
GIVEN a command line application that accepts users input

WHEN i start the application /
    THEN i am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role.
WHEN i choose to view all departments
    THEN i a presented with a formatted table showing department names and department ID's
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
THINGS THAT I WANT TO GET DONE TONIGHT 3/21/2022
    1. Create the home screen for the application and make a switch case attached to the object for delegation purposes.
    2. Create the method names for each function that will need to play out have a console log to indicate that is it working correctly.
    3. Create Some dummy seed data that will already be in the system to be able to be interacted with.
    4. Make one insert query to be used as reference.
    5. create the base connection and get it to work.
*/