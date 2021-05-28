<?php 
## add new user to database unless someone else has the same username or email. ##
include_once "commonFunctions.php";

// start session so if the user is logged in can be tracked across pages
startSession();
// if user already loggeed in exit
if(isLoggedIn()){
    exit("You are already logged in!");
}
// create connection
$conn = createConnection();
// get info from post
$email = $_POST["email"];
$password = $_POST["password"];

// check if email and password are valid
$stmt = $conn->prepare("SELECT password FROM trader WHERE email = ? ");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();
$row = $result->fetch_assoc();
// if null that email is not in the database
if(is_null($row)){
    $conn->close();
    exit("Invalid email");
}else{
    // there can only be one row so no need to iterate
    // if password hash match then valid user
    
    if(password_verify($password, $row["password"])){
        // sets session variable to know user is logged in
        $_SESSION["login"] = true;
        $_SESSION["email"] = $email; 
        // Determine username for user and store as session['username']. Helpful for other pages.
        $conn -> close();
        exit("success");
    }else{
        $conn->close();
        exit("Invalid password!");
    }
}

?>

