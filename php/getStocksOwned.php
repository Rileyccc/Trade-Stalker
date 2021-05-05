<?php
## get all users stocks from data base then return json repersentation of data ##
include_once "commonFunctions.php";

// session_status means there is no session started
startSession();
// if user not already loggeed in exit
if(!isLoggedIn()){
    exit("You must be logged in");
}
$email = $_SESSION["email"];

$conn = createConnection();
$stmt = $conn->prepare("SELECT ticker, quantity, purchasePrice, currency, crypto FROM stock WHERE email=?");
$stmt->bind_param("s", $email);
$stmt->execute() or die("something went wrong");
$result = $stmt->get_result();
echo '{ "stocks": [';
$count = 0;
// make json output use do while to ensure no comma after the last stock
do{
    if($count >= 2){
        echo ",";
    }
    if($count >= 1){
        echo '{';
        echo '"ticker":"'.$row['ticker'] . '",' .'"quantity":"' . $row['quantity'] . '", '. '"purchasePrice":"' . $row['purchasePrice'] . '", '. '"currency":"' . $row['currency']. '", '. '"crypto":"'. $row['crypto'] . '"}';
    }
    $count++;
}while ($row = mysqli_fetch_array($result));
echo "] }";

?>