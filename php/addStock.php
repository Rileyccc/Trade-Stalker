<?php
## Add a new stock to Database ##

include_once "commonFunctions.php";

// start session so if the user is logged in can be tracked across pages
// session_status means there is no session started
startSession();
// if user already loggeed in exit
if(isLoggedIn()){
    exit("You are already logged in!");
}

// get info from post
$ticker = $_POST["ticker"];
$quantity = $_POST["quantity"];
$purchasePrice = $_POST["purchasePrice"];
$currency = $_POST["currency"];

// create connection
$conn = createConnection();
// add stock to database
$stmt = $conn->prepare("INSERT INTO stock (ticker, quantity, purchasePrice,currency) VALUES(?, ?, ?, ?)");
$stmt->bind_param("ssss", $ticker, $quantity, $purchasePrice, $currency);
if($stmt->execute()){
    $conn->close();
    exit("success");
}else{
    $conn->close();
    exit("Something went wrong at our end try again");
}
?>
