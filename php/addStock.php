<?php
## Add a new stock to Database ##

include_once "commonFunctions.php";

// start session so if the user is logged in can be tracked across pages
// session_status means there is no session started
startSession();
// if user not already loggeed in exit
if(!isLoggedIn()){
    exit("You must be logged in");
}
$email = $_SESSION["email"];
// get info from post
$ticker = $_POST["ticker"];
$quantity = $_POST["quantity"];
$purchasePrice = $_POST["purchasePrice"];
$currency = $_POST["currency"];

if(isset($_POST["crypto"])){
    $crypto = 1;
}else{
    $crypto = 0;
}

// create connection
$conn = createConnection();
// add stock to database
$stmt = $conn->prepare("INSERT INTO stock (email, ticker, quantity, purchasePrice, currency, crypto) VALUES (?, ?, ?, ?, ?, ?)");
$stmt->bind_param("ssssss", $email, $ticker, $quantity, $purchasePrice, $currency, $crypto);
if($stmt->execute()){
    $conn->close();
    exit("success");
}else{
    $conn->close();
    exit("Something went wrong at our end try again");
}
?>
