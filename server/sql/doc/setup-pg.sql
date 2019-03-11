DROP TABLE IF EXISTS doc_document_tag;
DROP TABLE IF EXISTS doc_document;
DROP TABLE IF EXISTS doc_tag;
DROP TABLE IF EXISTS doc_folder;

CREATE TABLE doc_tag (
    id SERIAL PRIMARY KEY,
    name TEXT,
    created_on TIMESTAMP DEFAULT NOW()
);

CREATE TABLE doc_folder (
    id SERIAL PRIMARY KEY,
    name TEXT,
    location TEXT,
    created_on TIMESTAMP DEFAULT NOW()
);

CREATE TABLE doc_document(
  id SERIAL PRIMARY KEY,
  title TEXT,
  description TEXT,
  pages INT DEFAULT 1,
  received_on TIMESTAMP,
  created_on TIMESTAMP DEFAULT NOW(),
  file_name TEXT NOT NULL,
  folder INT REFERENCES doc_folder(id) ON DELETE SET NULL
);

CREATE TABLE doc_document_tag(
  doc_id INT REFERENCES doc_document(id) ON DELETE CASCADE,
  tag_id INT REFERENCES doc_tag(id) ON DELETE CASCADE,
  created_on TIMESTAMP DEFAULT NOW()
);
