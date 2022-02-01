-- Use this file to define your SQL tables
-- The SQL in this file will be executed when you run `npm run setup-db`
DROP TABLE IF EXISTS publishers, authors;

CREATE TABLE publishers (
        id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        name TEXT NOT NULL,
        city TEXT,
        state TEXT,
        country TEXT

    );

INSERT INTO publishers (name, city, state, country)
    VALUES (
        'Elijah Prosperie',
        'Seattle',
        'Washington',
        'United States'
    );

CREATE TABLE authors (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL,
  dob DATE,
  pob TEXT
);

INSERT INTO authors (name, dob, pob)
VALUES
    ('James Baldwin', '1924-08-02', 'New York City');
