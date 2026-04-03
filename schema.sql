CREATE TABLE Users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE Items (
    item_id INT PRIMARY KEY AUTO_INCREMENT,
    seller_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    condition ENUM('New', 'Used', 'Refurbished'),
    status ENUM('Available', 'Sold', 'Bidding', 'Donated', 'Lended') DEFAULT 'Available',
    listing_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (seller_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

CREATE TABLE FixedPriceSales (
    sale_id INT PRIMARY KEY AUTO_INCREMENT,
    item_id INT NOT NULL UNIQUE,
    price DECIMAL(10,2) NOT NULL,
    buyer_id INT,
    sale_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (item_id) REFERENCES Items(item_id) ON DELETE CASCADE,
    FOREIGN KEY (buyer_id) REFERENCES Users(user_id) ON DELETE SET NULL
);


CREATE TABLE Auctions (
    auction_id INT PRIMARY KEY AUTO_INCREMENT,
    item_id INT NOT NULL UNIQUE,
    base_price DECIMAL(10,2) NOT NULL,
    start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_date TIMESTAMP NOT NULL,
    highest_bid DECIMAL(10,2) DEFAULT 0.00,
    highest_bidder_id INT DEFAULT NULL,
    FOREIGN KEY (item_id) REFERENCES Items(item_id) ON DELETE CASCADE,
    FOREIGN KEY (highest_bidder_id) REFERENCES Users(user_id) ON DELETE SET NULL
);


CREATE TABLE Bids (
    bid_id INT PRIMARY KEY AUTO_INCREMENT,
    auction_id INT NOT NULL,
    bidder_id INT NOT NULL,
    bid_amount DECIMAL(10,2) NOT NULL,
    bid_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (auction_id) REFERENCES Auctions(auction_id) ON DELETE CASCADE,
    FOREIGN KEY (bidder_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

CREATE TABLE Donations (
    donation_id INT PRIMARY KEY AUTO_INCREMENT,
    item_id INT NOT NULL UNIQUE,
    donor_id INT NOT NULL,
    receiver_id INT DEFAULT NULL,
    donation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('Available', 'Accepted') DEFAULT 'Available',
    FOREIGN KEY (item_id) REFERENCES Items(item_id) ON DELETE CASCADE,
    FOREIGN KEY (donor_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES Users(user_id) ON DELETE SET NULL
);


CREATE TABLE Lending (
    lending_id INT PRIMARY KEY AUTO_INCREMENT,
    item_id INT NOT NULL UNIQUE,
    lender_id INT NOT NULL,
    borrower_id INT DEFAULT NULL,
    base_price DECIMAL(10,2) NOT NULL,
    duration_days INT NOT NULL,
    start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_date TIMESTAMP DEFAULT NULL,
    status ENUM('Available', 'Lended', 'Returned') DEFAULT 'Available',
    FOREIGN KEY (item_id) REFERENCES Items(item_id) ON DELETE CASCADE,
    FOREIGN KEY (lender_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (borrower_id) REFERENCES Users(user_id) ON DELETE SET NULL
);


CREATE TABLE LendingAuctions (
    lend_auction_id INT PRIMARY KEY AUTO_INCREMENT,
    item_id INT NOT NULL UNIQUE,
    lender_id INT NOT NULL,
    base_price DECIMAL(10,2) NOT NULL,
    duration_days INT NOT NULL,
    start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_date TIMESTAMP NOT NULL,
    highest_bid DECIMAL(10,2) DEFAULT 0.00,
    highest_bidder_id INT DEFAULT NULL,
    FOREIGN KEY (item_id) REFERENCES Items(item_id) ON DELETE CASCADE,
    FOREIGN KEY (lender_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (highest_bidder_id) REFERENCES Users(user_id) ON DELETE SET NULL
);


CREATE TABLE LendingBids (
    lend_bid_id INT PRIMARY KEY AUTO_INCREMENT,
    lend_auction_id INT NOT NULL,
    bidder_id INT NOT NULL,
    bid_amount DECIMAL(10,2) NOT NULL,
    bid_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (lend_auction_id) REFERENCES LendingAuctions(lend_auction_id) ON DELETE CASCADE,
    FOREIGN KEY (bidder_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

CREATE TABLE Transactions (
    transaction_id INT PRIMARY KEY AUTO_INCREMENT,
    item_id INT NOT NULL,
    seller_id INT NOT NULL,
    buyer_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    transaction_type ENUM('Fixed Sale', 'Auction Sale', 'Lending'),
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (item_id) REFERENCES Items(item_id) ON DELETE CASCADE,
    FOREIGN KEY (seller_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (buyer_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

CREATE TABLE Reviews (
    review_id INT PRIMARY KEY AUTO_INCREMENT,
    reviewer_id INT NOT NULL,
    reviewed_user_id INT NOT NULL,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    review_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (reviewer_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (reviewed_user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);
