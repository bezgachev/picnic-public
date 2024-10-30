const checkEmailInputs = (selector) => {
    const input = document.querySelector(selector);
    const EMAIL_REGEXP = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;

    const isEmailValid = (value) => {
        return EMAIL_REGEXP.test(value);
    }

    const checkInput = (e) => {
        let value = e.target.value;

        if (isEmailValid(value)) {
            input.classList.remove('error');
          } else {
            input.classList.add('error');
          }
    }

    input.addEventListener('blur', checkInput);

}

export default checkEmailInputs;