DROP TABLE IF EXISTS fin_constraint;
DROP TABLE IF EXISTS fin_transaction;
DROP TABLE IF EXISTS fin_planned_transaction;
DROP TABLE IF EXISTS fin_account;
DROP TABLE IF EXISTS fin_category;
DROP TABLE IF EXISTS fin_interval_type;

CREATE TABLE fin_interval_type(
  id SERIAL PRIMARY KEY,
  name TEXT
);

CREATE TABLE fin_category (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  active INT NOT NULL,
  valid INT NOT NULL DEFAULT 1
);

CREATE TABLE fin_account(
  id INT PRIMARY KEY ON UPDATE CASCADE,
  name TEXT,
  note TEXT,
  parent_account INT REFERENCES fin_account(id) ON UPDATE CASCADE,
  category_id INT REFERENCES fin_category(id),
  valid INT NOT NULL DEFAULT 1,
  created_on TIMESTAMP DEFAULT NOW()
);

CREATE TABLE fin_planned_transaction(
  id SERIAL PRIMARY KEY ,
  account INT REFERENCES fin_account(id) ON UPDATE CASCADE,
  contra_account INT REFERENCES fin_account(id) ON UPDATE CASCADE,
  amount DECIMAL(30, 2) NOT NULL,
  note TEXT,
  start TIMESTAMP NOT NULL,
  finish TIMESTAMP NOT NULL,
  interval_length INT NOT NULL,
  interval_type_id INT REFERENCES fin_interval_type(id),
  deactivated INT NOT NULL DEFAULT 0,
  planned_on TIMESTAMP DEFAULT NOW()
);

CREATE TABLE fin_transaction(
  id SERIAL PRIMARY KEY,
  account INT REFERENCES fin_account(id) ON UPDATE CASCADE,
  contra_account INT REFERENCES fin_account(id) ON UPDATE CASCADE,
  amount DECIMAL(30, 2) NOT NULL,
  note TEXT,
  planned_transaction_id INT REFERENCES fin_planned_transaction(id),
  created_on TIMESTAMP DEFAULT NOW(),
  valid INT NOT NULL DEFAULT 1,
  executed_on TIMESTAMP DEFAULT NOW()
);

CREATE TABLE fin_constraint(
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  definition TEXT,
  message TEXT,
  created_on TIMESTAMP DEFAULT NOW(),
  valid INT NOT NULL DEFAULT 1
);
