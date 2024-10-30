<?php
    require(dirname(__FILE__) . '/connecting.php');

    $result = 'error';
    $transaction = '';
    $amount = 0;
    $label = $_POST['operation-id'];

    $operation_id = mysqli_real_escape_string($connect, $label);

    if (isset($operation_id)) {
        $check_operation = mysqli_query($connect, "SELECT * FROM `payments_received` WHERE `operation_id` = '$operation_id'");
        $result = mysqli_num_rows($check_operation);

        if ($result > 0) {
            $sql_unaccepted = mysqli_query($connect, "SELECT `unaccepted` FROM `payments_received`  WHERE `operation_id` = '$operation_id'");
            $row_unaccepted = mysqli_fetch_array($sql_unaccepted);
            $payment_error = $row_unaccepted[0];

            if ($payment_error === 'false') {
                $sql_transaction = mysqli_query($connect, "SELECT `transaction` FROM `payments_received`  WHERE `operation_id` = '$operation_id'");
                $row_transaction = mysqli_fetch_array($sql_transaction);
                $get_transaction = $row_transaction[0];

                $sql_sum = mysqli_query($connect, "SELECT `sum` FROM `payments_received`  WHERE `operation_id` = '$operation_id'");
                $row_sum = mysqli_fetch_array($sql_sum);
                $get_sum = $row_sum[0];

                $transaction = $get_transaction;
                $amount = $get_sum;
                $relult = 'success';

                $received_to_user = mysqli_query($connect, "UPDATE `payments_received` SET `received_to_user`='1' WHERE `operation_id` = '$operation_id'" );
            } else {
                $relult = 'error';
            }
        } else {
            $relult = 'error';
        }
        
    }

echo json_encode(array(
    'result' => $relult,
    'operation_id' => $transaction,
    'amount' => $amount
));