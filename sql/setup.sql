-- Use this file to define your SQL tables
-- The SQL in this file will be executed when you run `npm run setup-db`
DROP TABLE IF EXISTS reviewers;

CREATE TABLE reviewers (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name varchar(140) NOT NULL,
    company varchar(140) NOT NULL
);

-- INSERT INTO reviewers (name, company) VALUES('Dano', 'Destruction');