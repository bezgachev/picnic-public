<?php
    if ($_POST['operation_id'] == 'test-notification') {
        $file_post = $_SERVER["DOCUMENT_ROOT"] . "/post-test.log";
        
        if (!empty($_POST)) {
            $fw = fopen($file_post, "a");
            fwrite($fw, "POST " . var_export($_POST, true));
            fclose($fw);
        }

        http_response_code(200);
    } else {
        $list = '';
        $notification_secret = '';
        $list .= $_POST['notification_type'] . '&'. $_POST['operation_id']. '&' . $_POST['amount'] . '&'. $_POST['currency'] . '&' . $_POST['datetime'] . '&'. $_POST['sender'] . '&' . $_POST['codepro'] . '&' . $notification_secret. '&' . $_POST['label'];

        $sha1 = hash('sha1', $list);

        if ($sha1 == $_POST['sha1_hash'] ) {

            require(dirname(__FILE__) . '/connecting.php');

            $label_id = mysqli_real_escape_string($connect, $_POST['label']);
            $unaccepted = mysqli_real_escape_string($connect, $_POST['unaccepted']);
            $operation_id = mysqli_real_escape_string($connect, $_POST['operation_id']);
            $sum = mysqli_real_escape_string($connect, $_POST['withdraw_amount']);
            $datetime = mysqli_real_escape_string($connect, $_POST['datetime']);
            $date = date("d.m.Y H:m:s", strtotime($datetime));

            if (isset($label_id)) {
                $check_operation = mysqli_query($connect, "SELECT * FROM `payments_received` WHERE `operation_id` = '$label_id'");
                $result_operation = mysqli_num_rows($check_operation);
        
                if ($result_operation > 0) {
                    mysqli_query($connect, "UPDATE `payments_received` SET `unaccepted`='$unaccepted' WHERE `operation_id` = '$label_id'" );
                    mysqli_query($connect, "UPDATE `payments_received` SET `transaction`='$operation_id' WHERE `operation_id` = '$label_id'" );
                    mysqli_query($connect, "UPDATE `payments_received` SET `sum`='$sum' WHERE `operation_id` = '$label_id'" );
                    mysqli_query($connect, "UPDATE `payments_received` SET `datetime`='$date' WHERE `operation_id` = '$label_id'" );
                }
                else {
                    mysqli_query($connect, "INSERT INTO `payments_received` (`operation_id`, `unaccepted`, `transaction`, `sum`, `datetime`) VALUES ('{$label_id}', '{$unaccepted}', '{$operation_id}', '{$sum}', '{$date}')");
                }
                
            }

            $file_post = $_SERVER["DOCUMENT_ROOT"] . "/post-success.log";
        
            if (!empty($_POST)) {
                $fw = fopen($file_post, "a");
                fwrite($fw, "POST " . var_export($_POST, true));
                fclose($fw);
            }
            http_response_code(200);
        } else {
            $file_post = $_SERVER["DOCUMENT_ROOT"] . "/post-error.log";
        
            if (!empty($_POST)) {
                $fw = fopen($file_post, "a");
                fwrite($fw, "POST " . var_export($_POST, true));
                fclose($fw);
            }
            http_response_code(400);
        }

    }
    exit();