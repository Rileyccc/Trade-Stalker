<?php
Session_start();
Session_destroy();
$_SESSION["login"] = false;
$_SESSION["email"] = '';
header("Location: ../index.html");
?>