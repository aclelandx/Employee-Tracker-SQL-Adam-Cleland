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

// module.exports = EmployeeCMS;