<?php
$relult = 'error';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    $operation = 'operation-id';

    if (!isset($_COOKIE[$operation]) ) {
        if (!empty($_POST[$operation])){

            require(dirname(__FILE__) . '/connecting.php');

            $label = $_POST['operation-id'];

            $operation_id = mysqli_real_escape_string($connect, $label);
            $name = mysqli_real_escape_string($connect, $_POST['name']);
            $phone = mysqli_real_escape_string($connect, $_POST['phone']);
            $email = mysqli_real_escape_string($connect, $_POST['email']);
            $sum = mysqli_real_escape_string($connect, $_POST['cost']);
            
            if (isset($operation_id)) {
                $check_operation = mysqli_query($connect, "SELECT * FROM `incoming_data` WHERE `operation_id` = '$operation_id'");
                $result = mysqli_num_rows($check_operation);

                if (!$result > 0) {
                    $sql = mysqli_query($connect, "INSERT INTO `incoming_data` (`operation_id`, `name`, `phone`, `email`, `sum`, `datetime`) VALUES ('{$operation_id}', '{$name}', '{$phone}', '{$email}', '{$sum}', now())");
                    if ($sql) {
                        $value = htmlspecialchars($_POST[$operation]);
                        setcookie($operation, $value, time() + 172800, '/');
                        $relult = 'success';
                    }
                }
            }            

            $file_post = $_SERVER["DOCUMENT_ROOT"] . "/incoming-data.log";
        
            if (!empty($_POST)) {
                $fw = fopen($file_post, "a");
                fwrite($fw, "POST " . var_export($_POST, true));
                fclose($fw);
            }
            
        }
    }
}

echo json_encode(array('result' => $relult));