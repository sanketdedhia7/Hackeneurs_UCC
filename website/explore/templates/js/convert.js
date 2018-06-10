const bodyEl = document.querySelector('body');
const resultEl = document.querySelector('#result');
const currencyFromSelect = document.querySelector('#currencyFrom');
const amountFromInput = document.querySelector('#amountFrom');
const currencyToSelect = document.querySelector('#currencyTo');

let currencyFromValue = currencyFromSelect.value;
let amountFromValue = amountFrom.value;
let currencyToValue = currencyToSelect.value;

currencyFromSelect.addEventListener('change', () => {
    currencyFromValue = currencyFromSelect.value;
    bodyEl.className = '';
    bodyEl.classList.add(currencyFromSelect.value);
    validate();
});

amountFromInput.addEventListener('change', () => {
    amountFromValue = amountFromInput.value;
    validate();
});

currencyToSelect.addEventListener('change', () => {
    currencyToValue = currencyToSelect.value;
    validate();
});


/**
 * Check input values and submit or show message.
 */
function validate() {
    if (
        currencyFromValue !== '' &&
        amountFromValue !== '' &&
        currencyToValue !== ''
    ) {
        submit();
    } else {
        resultEl.innerText = 'Select some currencies and an amount to convert';
    }
}



/**
 * Multiplies two floats without losing precision.
 */
function multFloats(x, y) {
    debugger;
    if (String(x).length > 1 && String(y).length > 1) {
        const xP = String(x).split('.')[1].length;
        const yP = String(y).split('.')[1].length;
        const _x = x * (Math.pow(10, xP));
        const _y = y * (Math.pow(10, yP));  
        return (_x * _y) / Math.pow(10, xP + yP);
    } else {
        return x * y;
    }  
}

/**
 * Setup variables with result info and do request.
 */
function submit() {
    const url = 
          `https://min-api.cryptocompare.com/data/price?fsym=${currencyFromValue}&tsyms=${currencyToValue}`;

    fetch(url)
        .then(res => res.json())
        .then(data => {
            const fromText = `${amountFromValue} ${currencyFromValue}`;
            const inputAmount = parseFloat(amountFromValue);
            const dataAmount = parseFloat(data[currencyToValue]);
            const resultAmount = multFloats(inputAmount, dataAmount);
            const toText = `${resultAmount} ${currencyToValue}`;
            result.innerText = `${fromText} = ${toText}`;
        })
        .catch(err => {
            console.error(err);
        });
}