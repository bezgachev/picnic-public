const checkAgeInputs = (selector) => {
    const inputs = document.querySelectorAll(selector);

    inputs.forEach(input => {

        const checkInput = (e) => {
            let value = e.target.value;
            let number = value.replace(/\D/, '');

            if (number.length > 2) {
                number = number.slice(0, -1);
            }

            e.target.value = number;

            if (value !== '' && e.target.classList.contains('error')) {
                e.target.classList.remove('error');
            }
        }

        input.addEventListener('input', checkInput);
        input.addEventListener('focus', checkInput);
        input.addEventListener('blur', checkInput);

    });
}

export default checkAgeInputs;