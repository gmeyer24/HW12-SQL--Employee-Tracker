const inquirer = require("inquirer");
const db = require("../config/mysql");

// add new department
const addDepartment = (menu) => {
    inquirer
      .prompt([
        {
          type: "input",
          text: "Enter name of Department",
          name: "name",
        },
      ])
  
      .then((department) => {
        console.log(department);
        db.query(
          "INSERT INTO departments (name) VALUES ( ? );", [department.name],
          (newDepartmentErr, result) => {
            if (newDepartmentErr) {
              console.error("Error adding new department", newDepartmentErr);
            } else {
              console.log("SUCCESS! Department added to database.");
            }
            menu();
          }
        );
      });
  };
  
//   view all departments
  const viewDepartments = (menu) => {
    db.query("SELECT * FROM departments", (viewDepartmentErr, departments) => {
      if (viewDepartmentErr) {
        console.error("There is a problem with the DB", viewDepartmentErr);
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