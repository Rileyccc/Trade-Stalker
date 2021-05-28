<?php 
## add new user to database unless someone else has the same username or email. ##
include_once "commonFunctions.php";

// start session so if the user is logged in can be tracked across pages
startSession();
// if user already loggeed in exit
if(!isLoggedIn()){
    exit("not logged in");
}
// create connection
$conn = createConnection();
// get info from post
$ticker = $_POST["ticker"];
$email = $_SESSION["email"];


// check if email and password are valid
$stmt = $conn->prepare("DELETE FROM stock WHERE email = ? and ticker = ?");
$stmt->bind_param("ss", $email, $ticker);
$stmt->execute();

if($stmt == true){
    exit("Stock deleted!");
}else{
    exit("Unable to delete stock");
}


?>