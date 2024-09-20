CREATE TABLE IF NOT EXISTS task (
      id BIGSERIAL PRIMARY KEY,
      date DATE NOT NULL,
      day_of_week VARCHAR(10) NOT NULL,
      time TIME NOT NULL,
      name VARCHAR(100) NOT NULL,
      status VARCHAR(100) NOT NULL
  );