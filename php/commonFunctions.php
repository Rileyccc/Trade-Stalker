<?php

createConnection(){
    $url = '';
    $user = '';
    $pass = '';
    $dbname = '';
    $conn = new mysqli($url, $user, $password, $dbnmae);
}

function startSession(){
    if(session_status() != PHP_SESSION_ACTIVE){
        session_start();
    }
}

function isLoggedIn(){
    if(isset($_SESSION['login'] && $SESSION['login'] == true)){
        return true;
    }
    return false;
}



?>