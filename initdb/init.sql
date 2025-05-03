CREATE TABLE branches (
    id SERIAL PRIMARY KEY,             
    name VARCHAR(100) NOT NULL,         
    location VARCHAR(255) NOT NULL 
);


CREATE TABLE employees (
    id SERIAL PRIMARY KEY,           
    first_name VARCHAR(100) NOT NULL,     
    last_name VARCHAR(100) NOT NULL,      
    role VARCHAR(50) NOT NULL,       
    branch_id INT REFERENCES branches(id)
);