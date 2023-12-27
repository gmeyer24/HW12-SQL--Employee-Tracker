const inquirer = require("inquirer");
const db = require("../config/mysql")

// add new employee
const addEmployee = (menu) => {
    inquirer
      .prompt([
        {
          type: "input",
          text: "Enter Employee First Name",
          name: "firstName",
        },
        {
          type: "input",
          text: "Enter Employee Last Name",
          name: "lastName",
        },
        {
          type: "list",
          text: "Enter Employee Role",
          name: "title",
          choices: ["Developer", "Customer Service", "Analyst"],
        },
        {
          type: "list",
          text: "Enter Employee Manager",
          name: "manager",
          choices: ["John Smith", "Aaron Judge", "Derek Jeter"],
        },
      ])
  
      .then((employee) => {
        console.log(employee);
        db.query(
          "INSERT INTO employees (first_name, last_name) VALUES (? , ?);",
          (err, result) => {
            if (err) {
              console.log(err);
            } else {
              console.log("SUCCESS!");
            }
            menu();
          }
        );
      });
  };
  
//   view all employees
  const viewEmployees = (menu) => {
    db.query("SELECT * FROM employees", (err, employees) => {
      if (err) {
        console.log("There is a problem with the DB");
      } else {
        console.table(employees);
      }
      menu();
    });
  };

  module.exports = {
    addEmployee,
    viewEmployees
  }