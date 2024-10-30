<?php
// Файлы phpmailer
require 'phpmailer/PHPMailer.php';
require 'phpmailer/SMTP.php';
require 'phpmailer/Exception.php';

# проверка, что ошибки нет
if (!error_get_last()) {

    // Переменные, которые отправляет пользователь
    $emailClient = $_POST['email'];
    $name = $_POST['name'] ;
    $phone = $_POST['phone'];
    $age = $_POST['age'];
    $food = $_POST['food'];
    $food_extra = $_POST['food_extra'];
    $quantity = $_POST['quantity'];
    $cost = $_POST['cost'];
    $message = $_POST['message'];
    $transactionId = $_POST['transaction_id'];
    $processedPhone = preg_replace('/[^0-9+]/', '', $phone);
    
    // Формирование самого письма
    $titleClient = "Успешная регистрация на пикник 2024 | Сила Воскресения г.Казань";
    $titleAdmin = "Регистрация пикник 2024 | Заявка";

    $messageClient = '
        Здравствуйте, ' . $name . '! <br/><br/>
        
        Вы успешно зарегистрированы на общецерковный пикник, который состоится <b>4 августа в 11:00</b><br/>
        <b>Место встречи:</b> Мира, 49а (п. Красницский, Зеленодольский район, Республика Татарстан)<br/><br/>

        <b>Построить маршрут: </b>&nbsp;
        <a href="https://go.2gis.com/l9gnn">2ГИС</a>&nbsp;&nbsp;&nbsp;&nbsp;
        <a href="https://yandex.ru/maps/-/CDGqz6ot">Яндекс.Карты</a><br/><br/>

        <b>Тел. для справок: </b>&nbsp;
        <a href="tel:+7">+7 </a> – Имя и тел. скрыты

        <br/><br/>
        Ваши данные:<br/><br/>';

    $universalBlock = '
        <table>
            <tr>
                <td style="padding: 10px; border: #e9e9e9 1px solid;"><b>Имя:</b></td>
                <td style="padding: 10px; border: #e9e9e9 1px solid;">' . $name . '</td>
            </tr>
            <tr>
                <td style="padding: 10px; border: #e9e9e9 1px solid;"><b>Тел.:</b></td>
                <td style="padding: 10px; border: #e9e9e9 1px solid;"><a href="tel:'.$processedPhone.'">'.$phone.'</a></td>
            </tr>
    ';
    $messageClient .= $universalBlock;

    $messageClient .= '
            <tr>
                <td style="padding: 10px; border: #e9e9e9 1px solid;"><b>Возраст:</b></td>
                <td style="padding: 10px; border: #e9e9e9 1px solid;">' . $age . '</td>
            </tr>
            <tr>
                <td style="padding: 10px; border: #e9e9e9 1px solid;"><b>Питание:</b></td>
                <td style="padding: 10px; border: #e9e9e9 1px solid;">' . $food . '</td>
            </tr>
            <tr>
                <td style="padding: 10px; border: #e9e9e9 1px solid;"><b>Доп. овощи:</b></td>
                <td style="padding: 10px; border: #e9e9e9 1px solid;">'. $food_extra .'</td>
            </tr>
        </table>';


    $quantityBlockAdmin = '';
    $listPersonsBlockAdmin = '';
    if (!empty($quantity)) {
        
        $personsObj = $_POST['personsObject'];
        $persons = json_decode($personsObj, true);
        $messageClient .= '<br/>Доп. участники мероприятия:<br/><br/>';
        
        $list = '';
        foreach ($persons as $item) {
            $col = '';
            foreach ($item as $key => $value) {
                $col .= '<td style="padding: 10px; border: #e9e9e9 1px solid"';
                $key === 'name' ? $col .= '>' : $col .= ' align="center">';
                $col .= $value.'</td>';
            }
            $list .= '<tr>'.$col.'</tr>';
        }
        
        $tablePersons = '
            <table>
                <tr>
                    <th style="padding: 10px; border: #e9e9e9 1px solid;">Имя</th>
                    <th style="padding: 10px; border: #e9e9e9 1px solid;">Возраст</th>
                    <th style="padding: 10px; border: #e9e9e9 1px solid;">Питание</th>
                    <th style="padding: 10px; border: #e9e9e9 1px solid;">Доп. овощи</th>
                </tr>
                '.$list.'
            </table>
        ';
        
        $messageClient .= $tablePersons;

        $quantityBlockAdmin = '
            <tr>
                <td style="padding: 10px; border: #e9e9e9 1px solid;"><b>Кол-во доп. людей:</b></td>
                <td style="padding: 10px; border: #e9e9e9 1px solid;">'.$quantity.'</td>
            </tr>
        ';
        $listPersonsBlockAdmin = '
            <br/><br/>
                Общая таблица:
            <br/><br/>
            
            <table>
                <tr>
                    <th style="padding: 10px; border: #e9e9e9 1px solid;">Имя</th>
                    <th style="padding: 10px; border: #e9e9e9 1px solid;">Возраст</th>
                    <th style="padding: 10px; border: #e9e9e9 1px solid;">Питание</th>
                    <th style="padding: 10px; border: #e9e9e9 1px solid;">Доп. овощи</th>
                </tr>
                <tr>
                    <td style="padding: 10px; border: #e9e9e9 1px solid;">'.$name.'</td>
                    <td style="padding: 10px; border: #e9e9e9 1px solid;" align="center">'.$age.'</td>
                    <td style="padding: 10px; border: #e9e9e9 1px solid;" align="center">'.$food.'</td>
                    <td style="padding: 10px; border: #e9e9e9 1px solid;" align="center">'.$food_extra.'</td>
                </tr>
                '.$list.'
            </table>
        ';
    }

    $messageClient .= '
        <br/><br/><b>РАСПИСАНИЕ ПИКНИКА:</b><br/><br/>

        11:00 - 12:00 — Подтверждение регистрации <br/>
        12:00 - 14:00 — Богослужение <br/>
        14:00 - 15:00 — Обед <br/>
        15:00 - 16:00 — Игровые зоны / свободное время <br/>
        16:00 - 16:15 — Кофе-брейк <br/>
        16:15 - 16:40 — Батл поколений <br/>
        16:40 - 17:40 — Вечер хвалы <br/>
    ';

    $messageAdmin = '
            Поступила новая регистрация на пикник 2024
            <br/><br/>

        '.$universalBlock.'
            <tr>
                <td style="padding: 10px; border: #e9e9e9 1px solid;"><b>E-mail:</b></td>
                <td style="padding: 10px; border: #e9e9e9 1px solid;"><a href="mailto:'.$emailClient.'">'.$emailClient.'</a></td>
            </tr>
            <tr>
                <td style="padding: 10px; border: #e9e9e9 1px solid;"><b>Оплачено:</b></td>
                <td style="padding: 10px; border: #e9e9e9 1px solid;">' . $cost . ' ₽</td>
            </tr>
            <tr>
                <td style="padding: 10px; border: #e9e9e9 1px solid;"><b>№ операции:</b></td>
                <td style="padding: 10px; border: #e9e9e9 1px solid;">'.$transactionId.'</td>
            </tr>
            '.$quantityBlockAdmin.'		
            <tr>
                <td style="padding: 10px; border: #e9e9e9 1px solid;"><b>Комментарий:</b></td>
                <td style="padding: 10px; border: #e9e9e9 1px solid;">'.$message.'</td>
            </tr>
        </table>
        
        '.$listPersonsBlockAdmin.'
    ';

    $messageAdmin .= '<br/><br/>
        Пользователь, подающий заявку на регистрацию, тоже уведомлен об успешной регистрации.<br/><br/>
        Приходящие данные являются, как резервным вариантом для получения информации регистрирующих.<br/>
        Основной список зарегистрированных расположен в <a href="https://docs.google.com/spreadsheets/d/.../">Google Таблице</a>.<br/><br/>
        Если не хотите засорять почтовый ящик письмами, создайте папку или ярлык, настройте фильтр,<br/>
        чтобы входящие письма с темой "Регистрация пикник 2024 | Заявка" отправлялись в определенную папку или ярлык.
    ';

    $universalTextFooter = '
        <br/><br/><br/><br/><br/><br/>
        Это письмо сформировано автоматически. Пожалуйста, не отвечайте на него.
    ';
    $messageAdmin .= $universalTextFooter;
    $messageClient .= $universalTextFooter;

    // Настройки PHPMailer
    $mail = new PHPMailer\PHPMailer\PHPMailer();
    
    $mail->isSMTP();   
    $mail->CharSet = "UTF-8";
    $mail->SMTPAuth   = true;
    // $mail->SMTPDebug = 2; // в продакте закоментировать
    $mail->Debugoutput = function($str, $level) {$GLOBALS['data']['debug'][] = $str;};
    
    // Настройки вашей почты
    $emailAdmin = ''; // email
    $mail->Host       = 'smtp.gmail.com'; // SMTP сервера вашей почты
    $mail->Username   = $emailAdmin; // Логин на почте
    $mail->Password   = ''; // Пароль приложения
    $mail->SMTPSecure = 'ssl';
    $mail->Port       = 465;
    $mail->setFrom($emailAdmin, 'Сила Воскресения'); // Адрес самой почты и имя отправителя от кого письмо
    
    // Отправка сообщения админу
    
    $mail->isHTML(true);
    $mail->AddAddress($emailAdmin);  
    $mail->Subject = $titleAdmin;
    $mail->Body = $messageAdmin;
    $mail->Send();

    $mail->ClearAddresses();

    // Отправка сообщения клиенту
    $mail->AddAddress($emailClient);  
    $mail->Subject = $titleClient;
    $mail->Body = $messageClient;

    // Проверяем отправленность сообщения
    if ($mail->send()) {
        $data['result'] = "success";
        $data['info'] = "Сообщение успешно отправлено!";
    } else {
        $data['result'] = "error";
        $data['info'] = "Сообщение не было отправлено. Ошибка при отправке письма";
        $data['desc'] = "Причина ошибки: {$mail->ErrorInfo}";
    }
    
} else {
    $data['result'] = "error";
    $data['info'] = "В коде присутствует ошибка";
    $data['desc'] = error_get_last();
}

// Отправка результата
header('Content-Type: application/json');
echo json_encode($data);

?>