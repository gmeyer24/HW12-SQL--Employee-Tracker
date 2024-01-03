-- Active: 1703447745794@@127.0.0.1@3306@world
USE company_db;

INSERT INTO employees (first_name, last_name) VALUES ("Gavin", "Meyer");

SELECT * FROM employees;

INSERT INTO departments (name) VALUES ("Management");

SELECT * FROM departments;

SELECT id, name FROM departments


INSERT INTO roles (title, salary, department_id) VALUES ("Junior Developer", 100000, 4);

SELECT * FROM roles;

SELECT roles.id, roles.title, roles.salary, departments.id AS department_id, departments.name AS department_name
FROM roles
JOIN departments ON roles.department_id = departments.id;

SELECT CONCAT(first_name, ' ', last_name) AS manager_name FROM employees;

SELECT employees.id AS employee_id,
    employees.first_name,
    employees.last_name,
    roles.id AS role_id,
    roles.title AS role_title,
    roles.salary AS role_salary,
    departments.id AS department_id,
    departments.name AS department_name,
    managers.id AS manager_id,
    CONCAT(managers.first_name, ' ', managers.last_name) AS manager_name
FROM employees
JOIN roles ON employees.role_id = roles.id
JOIN departments ON roles.department_id = departments.id
LEFT JOIN employees AS managers ON employees.manager_id = managers.id OR employees.manager_id IS NULL;



SELECT CONCAT(first_name, ' ', last_name) AS employee_name FROM employees;

UPDATE employees SET role_id = (SELECT id FROM roles WHERE title = "Jr Developer") WHERE first_name = "Gavin" AND last_name = "Meyer";

SELECT * FROM employees;

UPDATE employees AS e1
INNER JOIN employees AS e2 ON e1.manager_id = e2.id
SET e1.manager_id = e2.id
WHERE e1.first_name = "Kurt" AND e1.last_name = "Warner"
AND e2.first_name = "Derek" AND e2.last_name = "Jeter";

SELECT e1.*, e2.* 
  FROM employees AS e1 
  INNER JOIN employees AS e2 ON e1.manager_id = e2.id 
  WHERE e1.first_name = "Derek" AND e1.last_name = "Jeter" AND e2.first_name = "Kurt" AND e2.last_name = "warner";

  UPDATE employees SET manager_id = 2 WHERE first_name = "Brett" AND last_name = "Favre";


