CREATE TABLE IF NOT EXISTS reviews (
 id TEXT PRIMARY KEY, entity TEXT NOT NULL, route TEXT,
 experience_date TEXT NOT NULL, speed INTEGER CHECK(speed BETWEEN 1 AND 5),
 ease INTEGER CHECK(ease BETWEEN 1 AND 5), support INTEGER CHECK(support BETWEEN 1 AND 5),
 transfer_hours REAL CHECK(transfer_hours BETWEEN 0 AND 8760), release_hours REAL CHECK(release_hours BETWEEN 0 AND 8760),
 operation_status TEXT NOT NULL CHECK(operation_status IN ('completed','pending','rejected')),
 comment TEXT NOT NULL CHECK(length(comment)<=1000), browser_hash TEXT NOT NULL,
 status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','approved','rejected')),
 created_at TEXT NOT NULL, UNIQUE(entity,browser_hash)
);
CREATE INDEX IF NOT EXISTS reviews_public ON reviews(entity,status,experience_date);
CREATE TABLE IF NOT EXISTS limits (key TEXT PRIMARY KEY, count INTEGER NOT NULL, expires_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS reports (id TEXT PRIMARY KEY, review_id TEXT NOT NULL REFERENCES reviews(id), created_at TEXT NOT NULL);
