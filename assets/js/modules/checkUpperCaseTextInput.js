const checkUpperCaseTextInput = (selector) => {
    const inputs = document.querySelectorAll(selector);

    const toUpperCaseText = (e) => {
        let value = e.target.value;
        let str = value.toLowerCase()
            .split(' ')
            .map(function(i) {
                if (i[0] !== undefined) {
                    return i[0].toUpperCase() + i.substr(1);
                }
            })
            .join(' ');
        e.target.value = str;

        if (value !== '' && e.target.classList.contains('error')) {
            e.target.classList.remove('error');
        }
    }

    inputs.forEach(input => {
        input.addEventListener('input', toUpperCaseText);
    });

};

export default checkUpperCaseTextInput;