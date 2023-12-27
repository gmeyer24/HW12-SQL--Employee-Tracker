const inquirer = require("inquirer");
const db = require("../config/mysql");

// add new department
const addDepartment = (menu) => {
    inquirer
      .prompt([
        {
          type: "input",
          text: "Enter name of Department",
          name: "departmentName",
        },
      ])
  
      .then((department) => {
        console.log(department);
        db.query(
          "INSERT INTO departments (name) VALUES ( ? );",
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
  
//   view all departments
  const viewDepartments = (menu) => {
    db.query("SELECT * FROM departments", (err, departments) => {
      if (err) {
        console.log("There is a problem with the DB");
      } else {
        console.table(departments);
      }
      menu();
    });
  };

  module.exports = {
    addDepartment,
    viewDepartments
  }