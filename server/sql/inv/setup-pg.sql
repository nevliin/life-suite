DROP TABLE IF EXISTS inv_entry;
DROP TABLE IF EXISTS inv_target_entry;
DROP TABLE IF EXISTS inv_stock;
DROP TABLE IF EXISTS inv_constants;

CREATE TABLE inv_stock(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    created_on TIMESTAMP,
    target_kcal DECIMAL(32,3)
);

CREATE TABLE inv_constants(
    key VARCHAR(255),
    value VARCHAR(255)
);

CREATE TABLE inv_target_entry(
  id SERIAL PRIMARY KEY,
  stock_id INT REFERENCES inv_stock(id),
  name VARCHAR(255),
  amount INT NOT NULL
);

CREATE TABLE inv_entry(
  id SERIAL PRIMARY KEY,
  valid INT DEFAULT 1,
  stock_id INT REFERENCES inv_stock(id),
  target_id INT REFERENCES inv_target_entry(id),
  name VARCHAR(255) NOT NULL,
  producer VARCHAR(60),
  market VARCHAR(60),
  weight_in_g DECIMAL(32,3),
  kcal DECIMAL(32,3),
  expiration_date TIMESTAMP NOT NULL,
  price DECIMAL(5,2),
  note VARCHAR(255),
  created_on TIMESTAMP
);
