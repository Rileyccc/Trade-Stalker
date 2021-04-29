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
$stmt = $conn->prepare("SELECT ticker, quantity, purchasePrice, currency FROM stock WHERE email=?");
$stmt->bind_param("s", $email);
$stmt->execute() or die("something went wrong");
$result = $stmt->get_result();
echo '{\n "Stocks": {\n';
$count = 0;
while ($row = mysqli_fetch_array($result)){
    echo '"$count":{\n';
    echo '"ticker": '.$row['ticker'] . ",\n ".'"quantity": ' . $row['quantity'] . ",\n ". '"purchasePrice"' . $row['purchasePrice'] . ",\n ". '"currency"' . $row['currency']. "\n },\n";
    $count++;
}
echo "} \n }";

?>