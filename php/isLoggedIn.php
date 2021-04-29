<?php 
    include_once "commonFunctions.php";

    if(isLoggedIn()){
        exit("true");
    }
    exit("false");
?>