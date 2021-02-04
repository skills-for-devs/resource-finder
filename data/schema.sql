DROP TABLE profile;
DROP TABLE video;
DROP TABLE job;

CREATE TABLE profile (
  id SERIAL PRIMARY KEY,
  firstname VARCHAR(255),
  username VARCHAR(255) UNIQUE
);

CREATE TABLE video (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  url VARCHAR(255),
  description VARCHAR(255),
  image VARCHAR(255),
  note VARCHAR(255),
  profile_id INT NOT NULL,
  FOREIGN KEY (profile_id) REFERENCES profile (id)
);

CREATE TABLE job (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  url VARCHAR(255),
  logo VARCHAR(255),
  note VARCHAR(255),
  profile_id INT NOT NULL,
  FOREIGN KEY (profile_id) REFERENCES profile (id)
);

SELECT * FROM video JOIN profile ON video.profile_id = profile.id;
SELECT * FROM job JOIN profile ON job.profile_id = profile.id;