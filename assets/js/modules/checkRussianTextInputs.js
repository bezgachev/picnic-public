const checkRussianTextInputs = (selector) => {
    const inputs = document.querySelectorAll(selector);
    const keyboard_layout = {
        "q":"й","w":"ц","e":"у","r":"к","t":"е","y":"н","u":"г","i":"ш","o":"щ","p":"з","[":"х","]":"ъ","a":"ф","s":"ы","d":"в","f":"а","g":"п","h":"р","j":"о","k":"л","l":"д",";":"ж","\'":"э","z":"я","x":"ч","c":"с","v":"м","b":"и","n":"т","m":"ь",",":",",".":".","Q":"Й","W":"Ц","E":"У","R":"К","T":"Е","Y":"Н","U":"Г","I":"Ш","O":"Щ","P":"З","{":"Х","}":"Ъ","A":"Ф","S":"Ы","D":"В","F":"А","G":"П","H":"Р","J":"О","K":"Л","L":"Д",":":"Ж","\"":"Э","Z":"Я","X":"Ч","C":"С","V":"М","B":"И","N":"Т","M":"Ь","<":"Б",">":"Ю",
    };

    const replacingLettersRussian = (e) => {
            let target = e.target;
            let val = '';
            let ss = target.selectionStart;
            for (let i = 0; i < target.value.length; i++) {
                if(keyboard_layout[target.value[i]]) {
                    val+=keyboard_layout[target.value[i]];
                }
                else {
                    val+=target.value[i];
                }
            }
            target.value = val;
            target.selectionStart = ss;
            target.selectionEnd = ss;
    }

    inputs.forEach(input => {
        input.addEventListener('input', replacingLettersRussian);
    });

};

export default checkRussianTextInputs;