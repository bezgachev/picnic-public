function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {

    const {name, age, food, food_extra, phone, cost, email, quantity, message, transaction_id} = e.parameter;
    const sheet = SpreadsheetApp.getActiveSheet();
    const lastRow = sheet.getLastRow() + 1;

    sheet.getRange(`A${lastRow}`).setValue(name);
    sheet.getRange(`B${lastRow}`).setValue(age);
    sheet.getRange(`C${lastRow}`).setValue(food);

    if (food_extra !== '0') {
      sheet.getRange(`D${lastRow}`).setValue(food_extra);
    }

    sheet.getRange(`E${lastRow}`).setValue(phone);
    sheet.getRange(`F${lastRow}`).setValue(cost);
    sheet.getRange(`F${lastRow}`).setBackgroundColor("#B2E264");

    if (quantity !== '0') {
      sheet.getRange(`G${lastRow}`).setValue(quantity);
    }
  
    sheet.getRange(`H${lastRow}`).setValue(email);

    if (message !== '0') {
      sheet.getRange(`I${lastRow}`).setValue(message);
    }

    sheet.getRange(`J${lastRow}`).setValue(new Date());
    sheet.getRange(`K${lastRow}`).setValue(transaction_id);

    if (quantity !== '0') {

      const {personsObject} = e.parameter;
      const persons = JSON.parse(personsObject);

      for (let i = 0; i < quantity; i++) {
        const newLastRow = sheet.getLastRow() + 1;
        sheet.getRange(`A${newLastRow}`).setValue(persons[i].name);
        sheet.getRange(`B${newLastRow}`).setValue(persons[i].age);
        sheet.getRange(`C${newLastRow}`).setValue(persons[i].food);

        let foodExtra = persons[i].food_extra;
        if (foodExtra !== '0') {
          sheet.getRange(`D${newLastRow}`).setValue(foodExtra);
        }
      }

    }

    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'success'}))
      .setMimeType(ContentService.MimeType.JSON);
  }

  catch (e) {
    
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'error', 'error': e.message}))
      .setMimeType(ContentService.MimeType.JSON);
  }

  finally {
    lock.releaseLock();
  }

}