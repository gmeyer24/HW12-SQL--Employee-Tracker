const inquirer = require("inquirer");
const db = require("./config/mysql");
const { addEmployee, viewEmployees } = require("./employeeUtils");
const { viewDepartments, addDepartment } = require("./departmentUtils");

// Display all options
const menu = () => {
  inquirer
    .prompt([
      {
        type: "list",
        text: "What would you like to do?",
        name: "action",
        choices: [
          { name: "View all Departments", value: "list" },
          { name: "View all Roles", value: "list" },
          { name: "View all Employees", value: "list" },
          { name: "Add a Department", value: "add" },
          { name: "Add a Role", value: "add" },
          { name: "Add an Employee", value: "add" },
          { name: "Update an Employee Role", value: "update" },
        ],
      },
    ])
    .then((answer) => {
      switch (answer.action) {
        case "list":
          viewEmployees(menu);
          break;
        case "add":
          addEmployee(menu);
          break;
        case "list":
          viewDepartments(menu);
          break;
        case "add":
          addDepartment(menu);
        default:
          menu();
      }
    });
};

menu();
