const checkForTextOnlyInputs = (selector) => {
    const inputs = document.querySelectorAll(selector);

    inputs.forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key.match(/[^а-яёA-Za-z ]/ig)) {
                e.preventDefault();
            }
        });
    });
}

export default checkForTextOnlyInputs;