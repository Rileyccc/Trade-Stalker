<?php

function createConnection(){
    $url = '';
    $user = '';
    $password = '';
    $dbname = '';
    $conn = new mysqli($url, $user, $password, $dbname);
    return $conn;
}

function startSession(){
    if(session_status() != PHP_SESSION_ACTIVE){
        session_start();
    }
}

function isLoggedIn(){
    if(isset($_SESSION['login']) && $_SESSION['login'] == true){
        return true;
    }
    return false;
}



?>