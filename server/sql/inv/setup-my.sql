DROP TABLE IF EXISTS inv_entry;
DROP TABLE IF EXISTS inv_target_entry;

CREATE TABLE inv_entry(
  id INT PRIMARY KEY AUTO_INCREMENT,
  valid INT DEFAULT 1,
  name VARCHAR(60) NOT NULL,
  producer VARCHAR(60),
  market VARCHAR(60),
  weight INT,
  kcal INT,
  expirationDate TIMESTAMP NOT NULL,
  price DECIMAL(5,2),
  note VARCHAR(255));

CREATE TABLE inv_target_entry(
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(60),
  amount INT NOT NULL
);