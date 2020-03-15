const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const outputPath = path.resolve(__dirname, "templates", "team.html");

const render = require("./lib/htmlRenderer");

let teamMembers = [];
let employeeId = [];

console.log("Welcome to the Team Builder. Please start by entering your team manager's information.");

const validateId = (data) => {
  if (isNaN(data)) {
      return "Employee ID's should be 4-digits. Please re-enter your employee's ID.";
  }
  for (i = 0; i < employeeId.length; i++) {
      if (data === employeeId[i]) {
          return "ID number in use. Please enter different ID."
      }
  }
  return true;
}

const generateEmployees = function() {
    inquirer.prompt([
        {
        type: "input",
        message: "Enter team manager's name:",
        name: "name"
        },
        {
        type: "number",
        message: "Enter their 4-digit ID number:",
        name: "id",
        validate: validateId
        },
        {
        type: "input",
        message: "Enter email address:",
        name: "email"
        },
        {
        type: "number",
        message: "Enter office phone number:",
        name: "officeNumber"
        },
    ]).then((response) => {

        const newManager = new Manager(response.name, response.id, response.email, response.officeNumber);

        teamMembers.push(newManager);
        employeeId.push(response.id);

        addEmployees();
    });
};

const engineer = function () {
  inquirer.prompt([
    {
      type: "input",
      message: "Enter engineer's name:",
      name: "name"
    },
    {
      type: "number",
      message: "Enter their 4-digit ID number:",
      name: "id",
      validate: validateId
    },
    {
      type: "input",
      message: "Enter email address:",
      name: "email"
    },
    {
      type: "input",
      message: "Enter GitHub user name:",
      name: "github"
    }
  ]).then(function(response) {
    const newEngineer = new Engineer(response.name, response.id, response.email, response.github);

    teamMembers.push(newEngineer);
    employeeId.push(response.id);

    addEmployees();
  });
};

const intern = () => {
  inquirer.prompt([
    {
      type: "input",
      message: "Enter Intern's name:",
      name: "name"
    },
    {
      type: "number",
      message: "Interns's 4-digit ID number:",
      name: "id",
      validate: validateId
    },
    {
      type: "input",
      message: "Interns's email address:",
      name: "email"
    },
    {
      type: "input",
      message: "Where is your intern attending school?",
      name: "school"
    }
  ]).then((response) => {
    const newIntern = new Intern(response.name, response.id, response.email, response.school);

    teamMembers.push(newIntern);
    employeeId.push(response.id);

    addEmployees();
  });
};

const addEmployees = () => {
  inquirer.prompt([
    {
      type: "list",
      message: "Would you like to add another employee?",
      choices: ["Engineer", "Intern", "No thanks, my team is complete."],
      name: "newEmployee"
    }
  ]).then((response) => {
    switch (response.newEmployee) {
      case "Engineer":
        engineer();
        break;
      case "Intern":
        intern();
        break;
      default:
        fs.writeFile(outputPath, render(teamMembers), function (err) {
          if (err) {
            throw err;
          }
        });
        console.log("Your team page has been created!");
        break;
    }
  });
};

generateEmployees();