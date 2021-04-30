CREATE TABLE trader(
    email VARCHAR(75),
    password VARCHAR(200),
    PRIMARY KEY(email)
);
CREATE TABLE Stock(
    email VARCHAR(75),
    ticker VARCHAR(10),
    quanity int,
    purchasePrice decimal(10,2),
    currency VARCHAR(3),
    PRIMARY KEY(email, ticker),
    FOREIGN KEY (email) REFERENCES trader(email)
	    ON DELETE CASCADE ON UPDATE CASCADE
);
