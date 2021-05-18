CREATE TABLE trader(
    email VARCHAR(75),
    password VARCHAR(255),
    PRIMARY KEY(email)
);
CREATE TABLE Stock(
    email VARCHAR(75),
    ticker VARCHAR(10),
    quantity decimal (30,8),
    purchasePrice decimal(10,2),
    currency VARCHAR(3),
    crypto BOOLEAN,
    PRIMARY KEY(email, ticker),
    FOREIGN KEY (email) REFERENCES trader(email)
	    ON DELETE CASCADE ON UPDATE CASCADE
);
