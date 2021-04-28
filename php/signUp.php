<?php
// add new user to database unless someone else has the same  email.
// if account registration correct set session varable 'login' to true and session holds email.
include_once "commonFunctions.php";

// start session so if the user is logged in can be tracked across pages
// session_status means there is no session started
startSession();
// if user already loggeed in exit
if(isLoggedIn()){
    exit("You are already logged in!");
}

// get info from post
$email = $_POST["email"];
$password = $_POST["password"];

// encrypt password
$hash = password_hash($password,
          PASSWORD_DEFAULT);


// create connection
$conn = createConnection();
// check if email is in database
$stmt = $conn->prepare("SELECT email password FROM trader WHERE email = ? ");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();
$row = $result->fetch_assoc();
// if not null that email is in the database and they cannot use that email.
if(!is_null($row)){
    $conn->close();
    exit("Invalid email");
}

$stmt = $conn->prepare("INSERT INTO trader (email, password) VALUES(?, ?)");
$stmt->bind_param("ss", $email, $hash);
if($stmt->execute()){
    $_SESSION["login"] = true;
    $_SESSION["email"] = $email;
    // Determine username for user and store as session['username']. Helpful for other pages.
    $stmt->close();
    $conn->close();
    exit("success");
}else{
    $conn->close();
    exit("Something went wrong at our end try again");
}
?>
