<?php 
    include_once "commonFunctions.php";
    startSession();
    if(isLoggedIn()){
        exit("true");
    }
    exit("false");
?>