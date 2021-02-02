DROP TABLE user;
DROP TABLE video;
DROP TABLE job;

CREATE TABLE user (
  id SERIAL PRIMARY KEY,
  firstname VARCHAR(255),
  username VARCHAR(255) UNIQUE
);

CREATE TABLE video (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  url VARCHAR(255),
  description VARCHAR(255),
  note VARCHAR(255),
  user_id INT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES user (id)
);

CREATE TABLE job (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  url VARCHAR(255),
  note VARCHAR(255),
  user_id INT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES user (id)
);

SELECT * FROM video JOIN user ON video.user_id = user.id;
SELECT * FROM job JOIN user ON job.user_id = user.id;