use cms_db

INSERT INTO department (department_name)
VALUES 
    ('Leadership'),
    ('Design'),
    ('Engineering'),
    ('Marketing');

INSERT INTO job_title (title, salary, department_id)
VALUES
    ('Lead Developer', 180000, 3),
    ('Front End Developer', 100000, 3), 
    ('Back End Develepor', 120000, 3),
    ('Lead Designer', 85000, 2),
    ('Graphic Designer', 65000, 2),
    ('Head of Marketing', 140000, 4),
    ('Marketing Team Member', 60000, 4),
    ('CEO', 350000, 1),
    ('CCO', 300000, 1),
    ('CTO', 300000, 1);

INSERT INTO employee (first_name, last_name, job_title_id, manager_id)
VALUES
    ('Steve', 'Jobs', 8, NULL),
    ('Bob', 'Ross', 9, NULL),
    ('Kyle', 'Brofloski', 10, NULL),
    ('Adam', 'Cleland', 1, 3),
    ('Stan', 'Marsh', 2, 3),
    ('Randy', 'Marsh', 3, 3),
    ('Eric', 'Cartman', 4, 2),
    ('Kenny', 'McCormick', 5, 2),
    ('Mackenzie', 'Mason', 6, 1),
    ('Pablo', 'Escobar', 7, 1),
    ('Steven', 'Rocker', 7, 1);