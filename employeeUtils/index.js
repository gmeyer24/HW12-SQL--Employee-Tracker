const inquirer = require("inquirer");
const db = require("../config/mysql");

// add new employee
const addEmployee = (menu) => {
  // Get available roles from the database
  db.query("SELECT id, title FROM roles", (roleErr, roleResults) => {
    if (roleErr) {
      console.error("Error fetching roles:", roleErr);
      return;
    }

    const roleChoices = roleResults.map((row) => row.title);

    // Get available managers from the database
    db.query(
      "SELECT id, CONCAT(first_name, ' ', last_name) AS manager_name FROM employees",
      (managErr, managResults) => {
        if (managErr) {
          console.error("Error fetching managers:", managErr);
          return;
        }

        const managerChoices = managResults.map((row) => row.manager_name);

        // Add a "No Manager" option at the beginning of the choices
        managerChoices.unshift("No Manager");

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
              text: "Select Employee Role",
              name: "title",
              choices: roleChoices,
            },
            {
              type: "list",
              text: "Select Employee Manager",
              name: "manager",
              choices: managerChoices,
            },
          ])

          .then((employee) => {
            console.log(employee);

            // Get the role ID based on the selected role name
            const selectedRole = roleResults.find(
              (role) => role.title === employee.title
            );
            const roleId = selectedRole ? selectedRole.id : null;

            // Get the manager ID based on the selected manager name
            const selectedManager = managResults.find(
              (manager) => manager.manager_name === employee.manager
            );
            const managerId = selectedManager ? selectedManager.id : null;

            db.query(
              "INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?);",
              [employee.firstName, employee.lastName, roleId, managerId],
              (employeeErr, result) => {
                if (employeeErr) {
                  console.error("Error adding employee", employeeErr);
                } else {
                  console.log("SUCCESS! Employee added to database.");
                }
                menu();
              }
            );
          });
      }
    );
  });
};

//   view all employees
const viewEmployees = (menu) => {
  const query =
    "SELECT employees.id AS employee_id, employees.first_name, employees.last_name, roles.title AS role_title, roles.salary AS role_salary, departments.name AS department_name, CONCAT(managers.first_name, ' ', managers.last_name) AS manager_name FROM employees LEFT JOIN roles ON employees.role_id = roles.id LEFT JOIN departments ON roles.department_id = departments.id LEFT JOIN employees AS managers ON employees.manager_id = managers.id;";

  db.query(query, (viewErr, employees) => {
    if (viewErr) {
      console.error("There is a problem with the DB", viewErr);
    } else {
      console.table(employees);
    }
    menu();
  });
};

// update employee role
const updateEmployeeRole = (menu) => {
  // Fetch employees from the database to populate choices
  db.query(
    "SELECT CONCAT(first_name, ' ', last_name) AS employee_name FROM employees",
    (employeeErr, employeeResults) => {
      if (employeeErr) {
        console.error("Error fetching employees:", employeeErr);
        return;
      }

      const employeeChoices = employeeResults.map((row) => row.employee_name);

      // Fetch roles from the database to populate role choices
      db.query("SELECT title FROM roles", (roleErr, roleResults) => {
        if (roleErr) {
          console.error("Error fetching roles:", roleErr);
          return;
        }

        const roleChoices = roleResults.map((row) => row.title);

        inquirer
          .prompt([
            {
              type: "list",
              text: "Select Employee to update their role",
              name: "employee",
              choices: employeeChoices,
            },
            {
              type: "list",
              text: "Select new Employee Role",
              name: "newRole",
              choices: roleChoices,
            },
          ])

          .then((employeeRole) => {
            console.log(employeeRole);

            // Update the employee's role in the database
            const [firstName, lastName] = employeeRole.employee.split(" ");

            db.query(
              "UPDATE employees SET role_id = (SELECT id FROM roles WHERE title = ?) WHERE first_name = ? AND last_name = ?;",
              [employeeRole.newRole, firstName, lastName],
              (updateErr, result) => {
                if (updateErr) {
                  console.error("Error updating employee role.", updateErr);
                } else {
                  console.log("SUCCESS! Employee Role updated.");
                }
                menu();
              }
            );
          });
      });
    }
  );
};

// update employee manager
const updateEmployeeManager = (menu) => {
  // Get employees from the database to populate choices
  db.query(
    "SELECT CONCAT(first_name, ' ', last_name) AS employee_name FROM employees",
    (employeeErr, employeeResults) => {
      if (employeeErr) {
        console.error("Error fetching employees:", employeeErr);
        return;
      }

      // create new array of employees
      const employeeChoices = employeeResults.map((row) => row.employee_name);

      // Get available managers from the database
      db.query(
        "SELECT id, CONCAT(first_name, ' ', last_name) AS manager_name FROM employees",
        (managErr, managResults) => {
          if (managErr) {
            console.error("Error fetching managers:", managErr);
            return;
          }

          // create new array of managers
          const managerChoices = managResults.map((row) => row.manager_name);

          // Add a "No Manager" option at the beginning of the choices
          managerChoices.unshift("No Manager");

          inquirer
            .prompt([
              {
                type: "list",
                text: "Select Employee to update their manager",
                name: "employee",
                choices: employeeChoices,
              },
              {
                type: "list",
                text: "Select new Employee Manager",
                name: "newManager",
                choices: managerChoices,
              },
            ])

            .then((employeeManager) => {
              console.log(employeeManager);

              // Extract first and last name from the selected employee
              const [firstName, lastName] = employeeManager.employee.split(" ");

              // Extract first and last name from the selected new manager
              const [newManagerFirstName, newManagerLastName] =
                employeeManager.newManager.split(" ");

              // Fetch the ID of the new manager
              db.query(
                "SELECT id FROM employees WHERE first_name = ? AND last_name = ?",
                [newManagerFirstName, newManagerLastName],
                (idErr, managerResults) => {
                  if (idErr) {
                    console.error("Error fetching manager ID:", idErr);
                    return;
                  }

                  if (managerResults.length > 0) {
                    const newManagerID = managerResults[0].id;

                    // Update the employee's manager in the database
                    // use aliases when dealing with the same table. have to use inner join as well otherwise you get an error.. e1 = employee to update manager & e2 = new manager
                    db.query(
                      "UPDATE employees SET manager_id = ? WHERE first_name = ? AND last_name = ?",
                      [newManagerID, firstName, lastName],
                      (updateErr, result) => {
                        if (updateErr) {
                          console.log(
                            "Error updating employee's manager:",
                            updateErr
                          );
                        } else {
                          console.log("SUCCESS! Employee's manager updated.");
                          console.log(`Employee: ${firstName} ${lastName}`);
                          console.log(
                            `New Manager: ${newManagerFirstName} ${newManagerLastName}`
                          );
                        }
                        menu();
                      }
                    );
                  } else {
                    console.error("Error: New manager not found.");
                    menu();
                  }
                }
              );
            });
        }
      );
    }
  );
};

// view employees by manager
const viewEmployeesByManager = (menu) => {
  // Get available managers from the database
  db.query(
    "SELECT id, CONCAT(first_name, ' ', last_name) AS manager_name FROM employees",
    (managErr, managResults) => {
      if (managErr) {
        console.error("Error fetching managers:", managErr);
        return;
      }

      const managerChoices = managResults.map((row) => row.manager_name);

      inquirer
        .prompt([
          {
            type: "list",
            text: "Select Manager to view their employees",
            name: "selectedManager",
            choices: managerChoices,
          },
        ])

        .then((selectedManager) => {
          // Get first and last name from the selected manager
          const [managerFirstName, managerLastName] =
            selectedManager.selectedManager.split(" ");

          // Gets employees under the selected manager
          const query =
            "SELECT employees.id AS employee_id, employees.first_name, employees.last_name, roles.title AS role_title, roles.salary AS role_salary, departments.name AS department_name, CONCAT(managers.first_name, ' ', managers.last_name) AS manager_name FROM employees LEFT JOIN roles ON employees.role_id = roles.id LEFT JOIN departments ON roles.department_id = departments.id LEFT JOIN employees AS managers ON employees.manager_id = managers.id WHERE managers.first_name = ? AND managers.last_name = ?;";

          db.query(
            query,
            [managerFirstName, managerLastName],
            (viewEmployeesErr, employees) => {
              if (viewEmployeesErr) {
                console.error("Error fetching employees:", viewEmployeesErr);
              } else {
                console.table(employees);
              }
              menu();
            }
          );
        });
    }
  );
};

// view employees by department
const viewEmployeesByDepartment = (menu) => {
  // get available departments
  db.query(
    "SELECT id, name AS department_name FROM departments",
    (deptErr, deptResults) => {
      if (deptErr) {
        console.error("Error fetching departments:", deptErr);
        return;
      }
      const departmentChoices = deptResults.map((row) => row.department_name);

      inquirer
        .prompt([
          {
            type: "list",
            text: "Select Department to view its employees",
            name: "selectedDepartment",
            choices: departmentChoices,
          },
        ])

        .then((selectedDepartment) => {
          // Get the selected department name
          const departmentName = selectedDepartment.selectedDepartment;

          // Retrieve employees belonging to the selected department
          const query = `
              SELECT 
                employees.id AS employee_id, employees.first_name, employees.last_name, roles.title AS role_title, roles.salary AS role_salary, departments.name AS department_name, CONCAT(managers.first_name, ' ', managers.last_name) AS manager_name FROM employees LEFT JOIN 
                roles ON employees.role_id = roles.id LEFT JOIN departments ON roles.department_id = departments.id LEFT JOIN employees AS managers ON employees.manager_id = managers.id WHERE departments.name = ?;`;

          db.query(query, [departmentName], (viewEmployeesErr, employees) => {
            if (viewEmployeesErr) {
              console.error("Error fetching employees:", viewEmployeesErr);
            } else {
              console.table(employees);
            }
            menu();
          });
        });
    }
  );
};

module.exports = {
  addEmployee,
  viewEmployees,
  updateEmployeeRole,
  updateEmployeeManager,
  viewEmployeesByManager,
  viewEmployeesByDepartment
};
