const inquirer = require("inquirer");
const db = require("./config/mysql");
const { addEmployee, viewEmployees, updateEmployeeRole, updateEmployeeManager, viewEmployeesByManager } = require("./employeeUtils");
const { viewDepartments, addDepartment } = require("./departmentUtils");
const { addRole, viewRoles } = require("./roleUtils");

// Display all options
const menu = () => {
  inquirer
    .prompt([
      {
        type: "list",
        text: "What would you like to do?",
        name: "action",
        choices: [
          { name: "View all Departments", value: "departmentList" },
          { name: "View all Roles", value: "rolesList" },
          { name: "View all Employees", value: "employeesList" },
          { name: "View Employees by Manager", value: "employeesByManager" },
          { name: "Add a Department", value: "addDepartment" },
          { name: "Add a Role", value: "addRole" },
          { name: "Add an Employee", value: "addEmployee" },
          { name: "Update an Employee Role", value: "updateEmployeeRole" },
          { name: "Update an Employee Manager", value: "updateEmployeeManager" },
        ],
      },
    ])
    .then((answer) => {
      switch (answer.action) {
        case "employeesList":
          viewEmployees(menu);
          break;
        case "employeesByManager":
          viewEmployeesByManager(menu);
          break;
        case "addEmployee":
          addEmployee(menu);
          break;
        case "updateEmployeeRole":
          updateEmployeeRole(menu);
          break;
        case "updateEmployeeManager":
          updateEmployeeManager(menu);
          break;
        case "departmentList":
          viewDepartments(menu);
          break;
        case "addDepartment":
          addDepartment(menu);
          break;
        case "rolesList":
          viewRoles(menu);
          break;
        case "addRole":
          addRole(menu);
          break;
        default:
          menu();
      }
    });
};

menu();
