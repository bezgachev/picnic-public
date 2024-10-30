<?php
// Local
define("DB_HOST", "localhost");
define("DB_USER", "");
define("DB_PASSWORD", "");
define("DB_NAME", "");
$connect = mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);
$connect->set_charset("utf8mb4");