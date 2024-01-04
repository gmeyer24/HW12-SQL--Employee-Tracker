-- Active: 1703447745794@@127.0.0.1@3306@world
INSERT INTO departments (name)
VALUES ("Service"),
        ("Sales"),
        ("Finance"),
        ("Engineering"),
        ("Legal"),
        ("Management");

INSERT INTO roles (title, salary)
VALUES ("Developer", 100000),
        ("Customer Service", 60000),
        ("Analyst", 70000);

INSERT INTO employees (first_name, last_name)
VALUES ("Gavin", "Meyer"),
        ("Joe", "Dybdal"),
        ("Peter", "Skinner"),
        ("Kevin", "Schwartz");