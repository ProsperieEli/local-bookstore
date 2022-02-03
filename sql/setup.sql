-- Use this file to define your SQL tables
-- The SQL in this file will be executed when you run `npm run setup-db`
DROP TABLE IF EXISTS publishers, authors, reviewers, books, books_authors, reviews;


CREATE TABLE reviewers (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name varchar(140) NOT NULL,
    company varchar(140) NOT NULL
);

INSERT INTO reviewers (name, company) VALUES('Dano', 'Destruction');

CREATE TABLE reviews (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  rating INT CHECK (rating > 0 AND rating < 6),
  reviewer TEXT REFERENCES reviewers (id),
  review varchar(140) NOT NULL,
  book INT REFERENCES books (id)
);

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

CREATE TABLE books (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title TEXT NOT NULL,
  publisher BIGINT REFERENCES publishers (id),
  released NUMERIC(4) NOT NULL
);

INSERT INTO books (title, publisher, released)
VALUES
    ('Coffee Memoirs', (SELECT id FROM publishers WHERE name = 'Elijah Prosperie'), 2021);

CREATE TABLE books_authors (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  book_id BIGINT REFERENCES books (id),
  author_id BIGINT REFERENCES authors (id)
);

