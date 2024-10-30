<?php

if (isset($_COOKIE['operation-id'])) {
    setcookie('operation-id', '', time() - 172800, '/');
}

echo json_encode(array('result' => 'success'));