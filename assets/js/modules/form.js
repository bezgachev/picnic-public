import checkUpperCaseTextInput from "./checkUpperCaseTextInput";
import checkRussianTextInputs from "./checkRussianTextInputs";
import checkAgeInputs from './checkAgeInputs';
import checkEmailInputs from "./checkEmailInputs";
import checkForTextOnlyInputs from "./checkForTextOnlyInputs";
import mask from './mask';
import postData from "../services/services";

function form(basicSelector, otherSelecor, timerCompleted, wallet) {

    const wrapperPayment = document.querySelector('.payment__wrapper'),
          wrapperProcess = document.querySelector('.payment__processing'),
          selectorStatus = 'processing__status',
          selectorProcessBtn = '.processing__button',
          sectionForms = document.querySelector('.register__wrapper .form__data'),
          selectorTotalAmount = document.querySelector('.payment__subtitle'),
          form = document.querySelector('.preparation'),
          formTransferPayment = document.querySelector('#payment-transfer-form'),
          textarea = document.querySelector('[name=message]'),
          numberAccount = wallet;
          
    let countItem = 0,
        costMain = 0,
        costOthers = 0,
        totalAmount = 0,
        objBasicData = {},
        objOtherData = {},
        formData,
        messageInterval,
        secondsInterval,
        formDataGoogle;
    
    const priceListMenu = {
        0: {
            price: 0,
            text: 'Выберите питание*',
            gram: ''
        },
        1: {
            price: 450,
            text: 'Плов из телятины',
            gram: '(350 гр.)'
        },
        2: {
            price: 320,
            text: 'Шашлык из курицы с овощами на шпажке',
            gram: '(150 гр.)'
        },
        3: {
            price: 400,
            text: 'Шашлык из филе кур. бедра',
            gram: '(200 гр.)'
        },
        4: {
            price: 450,
            text: 'Шашлык из свиной шейки',
            gram: '(180 гр.)'
        },
        5: {
            price: 50,
            text: 'Помидоры, огурцы, болг. перец',
            gram: '(100 гр.)'
        },

    }

    const message = {
        loading: 'Загрузка...',
        transferPayment: 'Перенаправление на сайт банка...',
        waitingPayment1: 'Ожидание получения<br/>ответа...',
        waitingPayment2: 'Не закрывайте веб-браузер.<br/>Делаем запрос в банк, чтобы подтвердить операцию',
        successPreparing: 'Внимание!<br/>Не закрывайте веб-браузер.<br/><br/>После платежа на сайте банка, нажмите на кнопку "Вернуться на сайт", чтобы продолжить процесс регистрации и отправки регистрационных данных',
        btnPreparing: 'Ок, продолжить',
        errorServer: 'Сервис не доступен. Произошла ошибка.<br/>Попробуйте снова или зайдите позже.<br/>Ваши данные временно сохранены,<br/>но не отправлены администратору',
        successBank: 'Платёж успешно получен!',
        errorBank: 'Сервис банка не доступен. Произошла ошибка.<br/>Попробуйте снова или зайдите позже.<br/>Ваши данные временно сохранены,<br/>но не отправлены администратору',
        timeOverRequest: 'Время закончилось!<br/>Мы не получили ответа от банка.<br/>Попробуйте снова.<br/><br/>Или если вы не завершили операцию на стороне банка и закрыли вкладку банка, нажмите на кнопку "Создать операцию"',
        sendingDataGoogle: 'Отправляем данные администратору...',
        successAdministrator: 'Успешно отправлено',
        sendDataUser: 'Отправляем вам на почту<br/>подтверждение регистрации...',
        successRegister: 'Успешная регистрация на пикник',
        successFinal: 'Ура, все данные успешно отправлены! 😉',
        btnErrorServer: 'Перезагрузить страницу',
        brtCreateOperation: 'Создать операцию',        
        registrClosed: 'Уважаемые гости!<br><br>Регистрация закрыта.<br>Увидимся в следующем году! 😉',
        fieldNameTextNotAll: 'Введите фамилию и имя полностью',
        fillAllFields: 'Заполните все поля',
        fieldPhoneTextNotAll: 'Телефон введен не полностью',
        fieldEmailTextNotAll: 'E-mail введен некорректно'
    };

    const path = {
        // app_google: 'https://script.google.com/macros/s/AKfycbwjvUpcZzT9ZpmhRoWacf65NnFAnhwBR_YakffoeqOi0l0r-Fg7yTWHzARbUsy6Ip9t/exec', // прод
        app_google: 'https://script.google.com/macros/s/AKfycbyEaC83v3nYCStQfMW5pzsqlOoYYR45n5CZaHRrzV4cc6mYg2RWF3zy55QxcEdqY8K1Xw/exec', //дев
        creating_operation_id: '/creating-operation-id.php',
        delete_operation_id: '/delete-operation-id.php',
        payment_verification: '/payment-verification.php',
        send_email: '/send.php'
    };

    const checkingAllFields = () => {
        let rowBasic = document.querySelector(basicSelector),
            rowsOther = document.querySelectorAll(otherSelecor),
            inputsBasic = rowBasic.querySelectorAll('input:not([type=radio])'),
            inputEmail = document.querySelector('[name=email]'),
            error = true;

        const info = document.querySelector('.payment__info');
        info.textContent = message.fillAllFields;

        const EMAIL_REGEXP = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;

        const isEmailValid = (value) => {
            return EMAIL_REGEXP.test(value);
        }

        inputsBasic.forEach(item => {
            let input = item;
            if (input.value == '') {
                input.classList.add('error');
                error = false;
            } else {
                if (input.name === 'phone' && input.value.replace(/\D/g, '').length !== 11) {
                    error = false;
                    info.textContent = message.fieldPhoneTextNotAll;
                    input.classList.add('error');
                } else if (input.name === 'name' && input.value.split(' ').length <= 1) {
                    error = false;
                    info.textContent = message.fieldNameTextNotAll;
                    input.classList.add('error');
                }
                else {
                    input.classList.remove('error');
                }
            }
        });

        if (inputEmail.value == '') {
            inputEmail.classList.add('error');
            error = false;
        } else {
            if (isEmailValid(inputEmail.value)) {
                inputEmail.classList.remove('error');
            } else {
                error = false;
                info.textContent = message.fieldEmailTextNotAll;
                inputEmail.classList.add('error');
            }
        }

        rowsOther.forEach(item => {
            let inputsItem = item.querySelectorAll('input');
            for (let i = 0; i < inputsItem.length; i++) {
                let input = inputsItem[i];
                if (input.value == '') {
                    input.classList.add('error');
                    error = false;
                } else {
                    if (input.name === 'name' && input.value.split(' ').length <= 1) {
                        error = false;
                        info.textContent = message.fieldNameTextNotAll;
                        input.classList.add('error');
                    }
                    else {
                        input.classList.remove('error');
                    }
                }
            }
            
            let select = item.querySelector('select');
            if (select.value == '') {
                select.classList.add('error');
                error = false;
            } else { select.classList.remove('error') }
        });

        error ? info.classList.remove('show') : info.classList.add('show');
        
        return error;
    }

    const addItemRow = (e) => {
        if (countItem < 11) {
            let item = document.createElement('div');
            item.className = 'form__input data-other';

            let selectOptions = '';
            for (let i = 0; i <= 4; i++) {
                let text = priceListMenu[i].text;
                let price = priceListMenu[i].price;
                selectOptions += `
                    <option value="${i == 0 ? '' : text}"
                        data-option="${i}">
                        ${i == 0 ? text : ''}
                        ${i !== 0 ? `${price} ₽ – ${text}` : ''}
                    </option>
                `;
            }

            let foodExtraArr = priceListMenu[5];
            item.innerHTML = `
                <div class="main-part">
                    <span class="el-1"></span>
                    <input placeholder="Фамилия имя*" name="name" type="text" autocomplete="off" class="el-2" />
                    <input placeholder="Возраст*" name="age" type="text" autocomplete="off" inputmode="numeric" class="el-3" />
                    <select name="food" class="select el-4">
                        ${selectOptions}
                    </select>
                    <div class="btn-remove el-5" title="Удалить строку" data-remove><svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13 1L1 13" stroke-width="2" stroke-linecap="round" /><path d="M1 1L13 13" stroke-width="2" stroke-linecap="round" /></svg></div>
                </div>

                <div class="secondary-part custom-checkbox">
                    <input type="checkbox" id="vegetables-optional-${countItem+1}" name="food_extra" value="0" data-option="5">
                    <label for="vegetables-optional-${countItem+1}"><span class="price">${foodExtraArr.price} ₽ <span class="line"> – </span><span class="text"> ${foodExtraArr.text}</span></label>
                </div>
            `;
    
            e.target.insertAdjacentElement('beforebegin', item);

        }
        if (countItem === 9) {
            let info = document.createElement('div');
            info.className = 'form__input info';
            info.textContent = 'Не более 10 человек';
            e.target.insertAdjacentElement('beforebegin', info);
            e.target.classList.add('hide');
        }
        initHandlers();
    }

    const removeItemRow = (e) => {
        const target = e.target;
        if (target && target.tagName === 'DIV') {
            target.parentNode.parentNode.remove();
            if (countItem <= 10) {
                let info = document.querySelector('.form__input.info');
                if (info) {
                    document.querySelector('[data-add]').classList.remove('hide');
                    document.querySelector('.form__input.info').remove();
                }
            }
            initHandlers();
        }
    }

    const changeTotalAmount = () => {
        let getCheckedRadio = document.querySelector('.data-basic [type="radio"]:checked');
        let getCheckboxMain = document.querySelector('.data-basic [type="checkbox"]:checked');
        
        let optionFoodNumber;
        if (!getCheckedRadio) {
            optionFoodNumber = 0;
        } else {
            optionFoodNumber = getCheckedRadio.getAttribute('data-option');
        }
        costMain = priceListMenu[optionFoodNumber].price;

        if (getCheckboxMain) {
            costMain += priceListMenu[5].price;
        }

        let rowOther = document.querySelectorAll('.data-other');
        let totalOthers = 0;
        
        rowOther.forEach(item => {
            let select = item.querySelector('[name="food"]');
            let checkbox = item.querySelector('[type="checkbox"]:checked');

            let option = select.options[select.selectedIndex];
            let optionFoodNumber = option.getAttribute('data-option');
    
            if (optionFoodNumber) {
                totalOthers += priceListMenu[optionFoodNumber].price;
                if (optionFoodNumber !== '0' && select.classList.contains('error')) {
                    select.classList.remove('error');
                }
            }

            if (checkbox) {
                totalOthers += priceListMenu[5].price;
            }

        });

        costOthers = totalOthers;
        totalAmount = costMain + costOthers;

        let spaceTextTotalAmount = (totalAmount * 1.000|0).toLocaleString('ru-RU');
        
        selectorTotalAmount.textContent = `${spaceTextTotalAmount} ₽`;

    }

    const getBasicData = (basicSelector, objBasicData) => {
        let rowBasic = document.querySelector(basicSelector),
            inputsBasic = rowBasic.querySelectorAll('input:not([type="radio"])'),
            inputEmail = document.querySelector('[name=email]'),
            getCheckedRadio = document.querySelector('.data-basic [type="radio"]:checked'),
            getCheckedСheckbox = document.querySelector('.data-basic [type="checkbox"]'),
            message = document.querySelector('.data-basic [name="message"]');
            
        for (let i = 0; i < inputsBasic.length; i++) {
            let input = inputsBasic[i];
            objBasicData[input.name] = input.value.trim();
        }

        objBasicData['food'] = getCheckedRadio.value;
        objBasicData[getCheckedСheckbox.name] = getCheckedСheckbox.value;

        message.value.length > 0 ? objBasicData[message.name] = message.value.trim() : objBasicData[message.name] = '0';
        objBasicData[inputEmail.name] = inputEmail.value.trim();
    
        return objBasicData;
    }

    const getAllOtherData = (otherSelecor, objOtherData) => {
        let rowsOther = document.querySelectorAll(otherSelecor);
        rowsOther.forEach((item, index) => {
            let data = {};

            let inputsItem = item.querySelectorAll('input:not([type="checkbox"])');
            for (let i = 0; i < inputsItem.length; i++) {
                let input = inputsItem[i];
                data[input.name] = input.value.trim();
            }
            
            let select = item.querySelector('select');
            let checkbox = item.querySelector('[type="checkbox"]');
            data['food'] = select.value;
            data[checkbox.name] = checkbox.value;
            
            objOtherData[index] = data;

        });

        return objOtherData;
    }
    
    if (form) {
        form.addEventListener('click', (e) => {

            let resultCheckFields = checkingAllFields(basicSelector, otherSelecor);
            if (!resultCheckFields) return;
    
            changeProcessSpinner(message.loading);
    
            e.target.classList.add('disabled');
            sectionForms.classList.add('disabled');
    
            formData = new FormData();
    
            objBasicData = getBasicData(basicSelector, objBasicData);
            for(let key in objBasicData) {
                formData.append(key, objBasicData[key]);
            }

            objOtherData = getAllOtherData(otherSelecor, objOtherData);
            formData.append('personsObject', JSON.stringify(objOtherData));
            formData.append('quantity', Object.keys(objOtherData).length);
            formData.append('cost', totalAmount);
    
            let json = JSON.stringify(Object.fromEntries(formData.entries()));
            localStorage.setItem('form-data', json);
    
            const randomValue = getRandomNumber();

            formData.append('operation-id', randomValue);
            setTimeout(() => {
                preparingForPayment(formData, randomValue);
            }, 2000);
        });
    }

    const preparingForPayment = (formData, operationId) => {
        changeStatus(message.successPreparing, 'prepared', message.btnPreparing);

        let processBtn =  document.querySelector(selectorProcessBtn);       
        processBtn.addEventListener('click', () => {
            postData(path.creating_operation_id, formData)
                .then(res => {
                    // console.log(res);
                    let status = res.result;
                    if (status === 'success') {
                        changeProcessSpinner(message.transferPayment);
                        setTimeout(() => {
                            formTransferPayment.querySelector('[name="receiver"]').value = numberAccount;
                            formTransferPayment.querySelector('[name="label"]').value = operationId;
                            formTransferPayment.querySelector('[name="sum"]').value = totalAmount;
                            formTransferPayment.submit();
                        }, 3000);
                        setTimeout(() => {
                            location.reload();
                        }, 5000);
                    } else if (status === 'error') {
                        errorFromServer();
                    }
                }).catch((err) => {
                    errorFromServer();
                    // console.log(err)
                }).finally();
        });

    }

    const errorFromServer = () => {
        changeStatus(message.errorServer, 'error', message.btnErrorServer);
        let processBtn =  document.querySelector(selectorProcessBtn);       
        processBtn.addEventListener('click', () => {
            setTimeout(() => {
                location.reload();
            }, 1000);
        });
    }

    const changeProcessSpinner = (textProcess) => {
        let processBtn =  document.querySelector(selectorProcessBtn);
        wrapperPayment.classList.add('hide');

        wrapperProcess.classList.remove('hide', 'success', 'error', 'prepared');
        wrapperProcess.classList.add('loading');

        processBtn.classList.add('hide');

        document.querySelector(`.${selectorStatus}`).remove();

        let temporaryElement = document.createElement('div');
        temporaryElement.className = selectorStatus;
        temporaryElement.innerHTML = textProcess;

        processBtn.insertAdjacentElement('beforebegin', temporaryElement);

    }

    const changeStatus = (textStatus, status, textBtn = false) => {
        let processBtn =  document.querySelector(selectorProcessBtn);
        document.querySelector(`.${selectorStatus}`).remove();
        wrapperProcess.classList.remove('loading');

        if (status === 'prepared') {
            wrapperProcess.classList.remove('success', 'error');
            wrapperProcess.classList.add('prepared');
        }
        else if (status === 'success') {
            wrapperProcess.classList.remove('error');
            wrapperProcess.classList.add('success');
        } else {
            wrapperProcess.classList.remove('success');
            wrapperProcess.classList.add('error');
        }

        if (textBtn) {
            processBtn.textContent = textBtn;
            processBtn.classList.remove('hide');
        }

        let temporaryElement = document.createElement('div');
        temporaryElement.className = selectorStatus;
        temporaryElement.innerHTML = textStatus;

        processBtn.insertAdjacentElement('beforebegin', temporaryElement);
        
    }
    
    const changeLayoutAndInsertingData = ({name, age, message, phone, email, quantity, personsObject}) => {
        let rowBasic = document.querySelector(basicSelector);

        rowBasic.querySelector('[name=name]').value = name;
        rowBasic.querySelector('[name=age]').value = age;
        rowBasic.querySelector('[name=phone]').value = phone;
        document.querySelector('[name=email]').value = email;

        if (message !== '0') {
            rowBasic.querySelector('[name=message]').value = message;
        }

        if(personsObject && quantity) {
            let dataOther = JSON.parse(personsObject);
            for (let i = 0; i < quantity; i++) {
                generatingLayoutRow(dataOther[i], i);
            }
        }
    }

    const generatingLayoutRow = ({name, age, food, food_extra}, index) => {
        let selectOptions = '';
        let item = document.createElement('div');
        item.className = 'form__input data-other';

        for (let i = 0; i <= 4; i++) {
            let text = priceListMenu[i].text;
            let price = priceListMenu[i].price;
            selectOptions += `
                <option value="${i == 0 ? '' : text}"
                    data-option="${i}"
                    ${food === text ? 'selected' : ''}>
                    ${i == 0 ? text : ''}
                    ${i !== 0 ? `${price} ₽ – ${text}` : ''}
                </option>
            `;
        }

        let foodExtraArr = priceListMenu[5];
        item.innerHTML = `
            <div class="main-part">
                <span class="el-1"></span>
                <input placeholder="Фамилия имя*" name="name" type="text" value="${name}" autocomplete="off" class="el-2" />
                <input placeholder="Возраст*" name="age" type="text" value="${age}" autocomplete="off" inputmode="numeric" class="el-3" />
                <select name="food" class="select el-4">
                    ${selectOptions}
                </select>
                <div class="btn-remove el-5" title="Удалить строку" data-remove><svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13 1L1 13" stroke-width="2" stroke-linecap="round" /><path d="M1 1L13 13" stroke-width="2" stroke-linecap="round" /></svg></div>
            </div> 

            <div class="secondary-part custom-checkbox">
                <input type="checkbox" id="vegetables-optional-${index+1}" name="food_extra" data-option="5" ${food_extra === 'Да' ? 'value="Да" checked>' : 'value="0">'}
                <label for="vegetables-optional-${index+1}"><span class="price">${foodExtraArr.price} ₽ </span><span class="line"> – </span><span class="text">${foodExtraArr.text}</span></label>
            </div>

        `;
        document.querySelector('[data-add]').insertAdjacentElement('beforebegin', item);
    }

    const paymentProcessing = (user_id) => {
        let processBtn =  document.querySelector(selectorProcessBtn);
        wrapperPayment.classList.add('hide');
        wrapperProcess.classList.remove('hide', 'success', 'error', 'prepared');
        wrapperProcess.classList.add('loading');
        processBtn.classList.add('hide');

        sectionForms.classList.add('disabled');
        document.querySelector(`.${selectorStatus}`).classList.add('hide');

        setTimeout(() => {
            document.querySelector('[href="#scrollToPayment"]').click();
        }, 300);
        
        let temporaryElement1 = document.createElement('div');
        temporaryElement1.className = `${selectorStatus}-temporary`;
        temporaryElement1.textContent = '60 сек';
        processBtn.insertAdjacentElement('beforebegin', temporaryElement1);

        let temporaryElement2 = document.createElement('div');
        temporaryElement2.className = `${selectorStatus}-temporary`;
        temporaryElement2.innerHTML = message.waitingPayment1;
        processBtn.insertAdjacentElement('beforebegin', temporaryElement2);
            
        let counterStagesMessage = 6,
        counterSeconds = 60;

        const fSecondsInterval = () => {
            if (counterSeconds === 0) {
                clearInterval(secondsInterval);
                temporaryElement1.remove();
                requestTimeEnded();
                return;
            }
            counterSeconds = counterSeconds - 1;
            temporaryElement1.textContent = `${counterSeconds} сек.`;
        }

        secondsInterval = setInterval(fSecondsInterval, 1000);

        const fMessageAndRequestInterval = () => {
            let getDataPaymentVerification = localStorage.getItem('payment_verification');

            if (getDataPaymentVerification === 'success' || getDataPaymentVerification === 'error') {
                clearInterval(messageInterval);
                clearInterval(secondsInterval);
                temporaryElement1.remove();
                temporaryElement2.remove();
                localStorage.removeItem('payment_verification');
                return;
            }
            
            counterStagesMessage--;

            if (counterStagesMessage === 0) {
                clearInterval(messageInterval);
                temporaryElement2.remove();
                return;
            } else {
                requestPaymentVerification(user_id);

                temporaryElement2.innerHTML = message.waitingPayment2;
                setTimeout(() => { temporaryElement2.innerHTML = message.waitingPayment1 }, 7000);
            }

        }

        messageInterval = setInterval(fMessageAndRequestInterval, 10000);

    }

    const requestTimeEnded = () => {
        let processBtn =  document.querySelector(selectorProcessBtn);
        changeStatus(message.timeOverRequest, 'error', message.btnErrorServer);

        let temporaryElement = document.createElement('div');
        temporaryElement.className = 'processing__button new-request';
        temporaryElement.textContent = message.brtCreateOperation;
        processBtn.insertAdjacentElement('afterend', temporaryElement);

        const restart = () => {
            setTimeout(() => {
                location.reload();
            }, 1000);
        }

        processBtn.addEventListener('click', restart);

        temporaryElement.addEventListener('click', () => {
            postData(path.delete_operation_id, '')
            .then(res => {
                temporaryElement.remove();
                processBtn.removeEventListener('click', restart);
                form.click();
            });
            
        });

    }

    const checkingLocalStorageAndCookie = (timerCompleted) => {
        let getDataLocalStorage = localStorage.getItem('form-data_0');
        let getStatusPayment = localStorage.getItem('payment_verification');
        let getStatusSentGoogleApp = localStorage.getItem('sent_google_app');

        if (getDataLocalStorage) {
            
            let data = JSON.parse(getDataLocalStorage);
            renderBasicFoodData(data);
            changeLayoutAndInsertingData(data);
            
            let getCookieUserOperation = getCookie('operation-id_0');

            if (getCookieUserOperation !== undefined && getStatusSentGoogleApp !== 'success') {
                sectionForms.classList.add('disabled');
                paymentProcessing(getCookieUserOperation);
            }
            else if (getCookieUserOperation !== undefined && getStatusSentGoogleApp === 'success') {
                sectionForms.classList.add('disabled');
                sendDataToEmail();
            } 

            initHandlers();

        } else if (!getDataLocalStorage && timerCompleted === 'true') {
            const registrationClosed = document.createElement("div");

            registrationClosed.className = `${sectionForms.parentNode.classList[0]} register__closed`;
            registrationClosed.innerHTML = message.registrClosed;
            sectionForms.parentNode.insertAdjacentElement('beforebegin', registrationClosed);

            sectionForms.parentNode.remove();
        }
        else {
            renderBasicFoodData();
            initHandlers();
        }

        if (getStatusPayment) {
            localStorage.removeItem('payment_verification');
        }

    }

    const requestPaymentVerification = (user_id) => {
        let FormDataUserId = new FormData();
        let userIdData = user_id;
        FormDataUserId.append('operation-id', userIdData);

        postData(path.payment_verification, FormDataUserId)
            .then(res => {
                // console.log(res);
                let status = res.result;
                if (status === 'success') {
                    let operationId = res.operation_id;
                    let amount = res.amount;
                    let spaceTextTotalAmount = (amount * 1.000|0).toLocaleString('ru-RU');

                    localStorage.setItem('payment_verification', 'success');
                    localStorage.setItem('transaction_id', operationId);

                    localStorage.setItem('transaction_amount', spaceTextTotalAmount);
                    hideTemporaryElements();
                    successfullyPaid(operationId, spaceTextTotalAmount);
                }
            }).catch((err) => {
                hideTemporaryElements();
                localStorage.setItem('payment_verification', 'error');
                errorPaymentReceipt();
                // console.log(`Error ${err}`);
            }).finally(() => {

            });
    }

    const hideTemporaryElements = () => {
        const temporaryElements = document.querySelectorAll(`.${selectorStatus}-temporary`);
        temporaryElements.forEach(element => {
            element.classList.add('hide');
        });
    }

    const errorPaymentReceipt = () => {
        let processBtn =  document.querySelector(selectorProcessBtn);
        changeStatus(message.errorBank, 'error', message.btnErrorServer)
        processBtn.addEventListener('click', () => {
            setTimeout(() => {
                location.reload();
            }, 1000);
        });
    }

    const successfullyPaid = (transaction, amount) => {
        changeProcessSpinner(message.successBank)
        selectorTotalAmount.classList.add('hide');
        setTimeout(() => {
            startSendingDataToGoogle(transaction, amount);
        }, 3000);
    }

    const startSendingDataToGoogle = (transaction, amount) => {
        changeProcessSpinner(message.sendingDataGoogle);
        
        formDataGoogle = new FormData();
        let getDataLocalStorage = localStorage.getItem('form-data');
        let obj = JSON.parse(getDataLocalStorage);
        formDataGoogle.append('transaction_id', transaction);
        formDataGoogle.append('cost', amount);
        
        for (let key in obj) {
            formDataGoogle.append(key, obj[key]);
        }
        
        setTimeout(() => {

            postData(path.app_google, formDataGoogle)
                .then(result => {
                    // console.log(result);
                    localStorage.setItem('sent_google_app', 'success');
                    // console.log(result);
                    successfullySent();
                }).catch((err) => {
                    localStorage.setItem('sent_google_app', 'error');
                    errorFromServer();
                    // console.log(`Error ${err}`);
                }).finally();
        }, 2000);
    }

    const successfullySent = () => {
        changeProcessSpinner(message.successAdministrator);
        setTimeout(() => {
            sendDataToEmail();
        }, 3000);
    }

    const sendDataToEmail = () => {
        changeProcessSpinner(message.sendDataUser);
        let formDataEmail = new FormData();
        let getDataLocalStorage = localStorage.getItem('form-data');
        let transactionIdLocalStorage = localStorage.getItem('transaction_id');
        let amountLocalStorage = localStorage.getItem('transaction_amount');

        let obj = JSON.parse(getDataLocalStorage);

        for (let key in obj) {
            formDataEmail.append(key, obj[key]);
        }
        formDataEmail.append('transaction_id', transactionIdLocalStorage);
        formDataEmail.append('cost', amountLocalStorage);

        postData(path.send_email, formDataEmail)
            .then(res => {
                // console.log(res);
                let status = res.result;
                if (status === 'success') {
                    changeStatus(message.successRegister, 'success');
                    startResetAllData();
                } else if (status === 'error') {
                    errorFromServer();
                }
            }).catch((err) => {
                errorFromServer();
                // console.log(`Error ${err}`);
            }).finally();
    }

    const startResetAllData = () => {
        setTimeout(() => changeStatus(message.successFinal, 'success'), 3000);

        localStorage.removeItem('payment_verification');
        localStorage.removeItem('sent_google_app');
        localStorage.removeItem('transaction_id');
        localStorage.removeItem('transaction_amount');
        localStorage.removeItem('form-data');

        let inputs = document.querySelectorAll('input:not([type=radio])');
        let rowsOther = document.querySelectorAll(otherSelecor);

        inputs.forEach(item => {
            item.value = '';
        })
        
        rowsOther.forEach(item => {
            item.remove();
        })

        document.querySelector('[name=message]').value = '';
        document.querySelectorAll('[type=radio]')[0].click();

        setTimeout(() => {
            wrapperProcess.classList.remove('success');
            wrapperProcess.classList.add('hide');
            wrapperPayment.classList.remove('hide');
            sectionForms.classList.remove('disabled');
            selectorTotalAmount.classList.remove('hide');
        }, 12000);

        postData(path.delete_operation_id, '');

    }

    const renderBasicFoodData = ({food, food_extra} = false) => {
        let selectsRadio = '';
        for (let i = 1; i <= 4; i++) {
            let text = priceListMenu[i].text;
            let price = priceListMenu[i].price;
            let gram = priceListMenu[i].gram;
            selectsRadio += `
                <div>
                    <input type="radio" name="food" id="food-${i}" value="${text}" data-option="${i}"
                    ${food && food === text ? ' checked' : '' }
                    ${!food && i === 1 ? ' checked' : ''}
                    />
                    <label for="food-${i}"><span class="price">${price} ₽ </span><span class="line"> – </span><span class="text">${text} ${gram}</span></label>
                </div>
            `;
        }

        let foodExtraArr = priceListMenu[5];
        let pattern = `
            <div class="form__input-food part-2 custom-radio">
                <div class="form__input-info">Выберите 1 питание:</div>
                ${selectsRadio}
            </div>
            <div class="form__input-food part-3 custom-checkbox">
                <div class="form__input-info">Добавить доп. в питание овощи?</div>
                <div>
                    <input type="checkbox" id="vegetables-optional" name="food_extra" data-option="5"
                    ${food_extra && food_extra === 'Да' ? ' value="Да" checked>' : ' value="0">' }
                    
                    <label for="vegetables-optional"><span class="price">${foodExtraArr.price} ₽ </span><span class="line"> – </span><span class="text">${foodExtraArr.text} ${foodExtraArr.gram}</span></label>
                </div>
            </div>
        `;

        document.querySelector('.form__input-personal').insertAdjacentHTML('afterend', pattern);

    }

    const changeCheckboxInput = (e) => {
        let target = e.target;
        if (target.checked) {
            target.value = "Да";
        } else {
            target.value = "0";
        }
    }

    const getRandomNumber = (min = 100000, max = 900000) => {
        return Math.round(Math.random() * (max - min) + min);
    }

    const getCookie = (name) => {
        let matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"));
        return matches ? decodeURIComponent(matches[1]) : undefined;
    }

    const changeUiMessage = (e) => {
        let type = e.type;
        type == 'focus' ? e.target.classList.add('active') : e.target.classList.remove('active');
    }

    const initHandlers = () => {
        const rowBasic = document.querySelector(basicSelector),
              rowOther = document.querySelectorAll(otherSelecor),
              addSelector = document.querySelector('[data-add]'),
              radioInput = rowBasic.querySelectorAll('input[type=radio]'),
              checkboxInput = rowBasic.querySelector('input[type="checkbox"]');
              
        addSelector ? addSelector.addEventListener('click', addItemRow) : null;
        checkboxInput ? checkboxInput.addEventListener('click', changeCheckboxInput) : null;
        checkboxInput ? checkboxInput.addEventListener('click', changeTotalAmount) : null;

        if (radioInput)  {
            changeTotalAmount();
            for (let i = 0; i < radioInput.length; i++) {
                radioInput[i].addEventListener('click', changeTotalAmount);
            }
        }

        checkForTextOnlyInputs('[name="name"]');
        checkRussianTextInputs('[name="name"]');
        checkUpperCaseTextInput('[name="name"]');
        
        checkAgeInputs('[name="age"]');

        mask('[name="phone"]');


        textarea.addEventListener('focus', changeUiMessage);
        textarea.addEventListener('blur', changeUiMessage);

        checkRussianTextInputs('[name="message"]');
        
        checkEmailInputs('[name=email]');
        countItem = 1;

        rowOther.forEach(item => {
            let removeSelector = item.querySelector('[data-remove]'),
                selectSelector = item.querySelectorAll('.data-other select'),
                checkboxSelector = item.querySelector('.data-other [type="checkbox"]');
                
            removeSelector ? removeSelector.addEventListener('click', removeItemRow) : null;
            
            if (selectSelector) {
                item.addEventListener('change', changeTotalAmount);
                item.addEventListener('click', changeTotalAmount);
            } 
            if (checkboxSelector) {
                checkboxSelector ? checkboxSelector.addEventListener('click', changeCheckboxInput) : null;
            }

            item.querySelector('span').innerHTML = `${++countItem}.`;

            checkForTextOnlyInputs('[name="name"]');
            checkRussianTextInputs('[name="name"]');
            checkUpperCaseTextInput('[name="name"]');
            
            checkAgeInputs('[name="age"]');

        });

    }

    checkingLocalStorageAndCookie(timerCompleted);

}

export default form;