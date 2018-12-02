DROP TABLE IF EXISTS fin_constraint;
DROP TABLE IF EXISTS fin_transaction;
DROP TABLE IF EXISTS fin_planned_transaction;
DROP TABLE IF EXISTS fin_account;
DROP TABLE IF EXISTS fin_category;
DROP TABLE IF EXISTS fin_interval_type;

CREATE TABLE fin_interval_type(
  id SERIAL PRIMARY KEY,
  name VARCHAR(255)
);

CREATE TABLE fin_category (
  id SERIAL PRIMARY KEY,
  name VARCHAR(63) NOT NULL,
  active INT(1) NOT NULL,
  valid INT(1) NOT NULL DEFAULT 1
);

CREATE TABLE fin_account(
  id INT(4) PRIMARY KEY ON UPDATE CASCADE,
  name VARCHAR(127),
  note VARCHAR(255),
  parent_account INT(4) REFERENCES fin_account(id) ON UPDATE CASCADE,
  category_id INT REFERENCES fin_category(id),
  valid INT(1) NOT NULL DEFAULT 1,
  created_on TIMESTAMP DEFAULT NOW()
);

CREATE TABLE fin_planned_transaction(
  id SERIAL PRIMARY KEY ,
  account INT(4) REFERENCES fin_account(id) ON UPDATE CASCADE,
  contra_account INT(4) REFERENCES fin_account(id) ON UPDATE CASCADE,
  amount DECIMAL(30, 2) NOT NULL,
  note VARCHAR(255),
  start TIMESTAMP NOT NULL,
  finish TIMESTAMP NOT NULL,
  interval_length INT NOT NULL,
  interval_type_id INT REFERENCES fin_interval_type(id),
  deactivated INT(1) NOT NULL DEFAULT 0,
  planned_on TIMESTAMP DEFAULT NOW()
);

CREATE TABLE fin_transaction(
  id SERIAL PRIMARY KEY,
  account INT(4) REFERENCES fin_account(id) ON UPDATE CASCADE,
  contra_account INT(4) REFERENCES fin_account(id) ON UPDATE CASCADE,
  amount DECIMAL(30, 2) NOT NULL,
  note VARCHAR(255),
  planned_transaction_id INT REFERENCES fin_planned_transaction(id),
  created_on TIMESTAMP DEFAULT NOW(),
  valid INT(1) NOT NULL DEFAULT 1,
  executed_on TIMESTAMP DEFAULT NOW()
);

CREATE TABLE fin_constraint(
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  definition VARCHAR(21000) CHARACTER SET utf8,
  message VARCHAR(255),
  created_on TIMESTAMP DEFAULT NOW(),
  valid INT(1) NOT NULL DEFAULT 1
);
