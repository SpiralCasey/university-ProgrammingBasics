// Automatically formats card number input as 'XXXX XXXX XXXX XXXX'
document.getElementById('card-number').addEventListener('input', function (e) {
    const value = e.target.value.replace(/\D/g, '').slice(0, 16); // Remove all non-digits
    e.target.value = value.replace(/(.{4})/g, '$1 ').trim(); // Add space every 4 digits
});

// Function to delay execution for real-time validation
function debounce(fn, delay) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn.apply(this, args), delay);
    };
}

// Cache input and error elements
const fields = {
    name: document.getElementById('card-name'),
    number: document.getElementById('card-number'),
    mm: document.getElementById('exp-mm'),
    yy: document.getElementById('exp-yy'),
    cvc: document.getElementById('cvc')
};

const errors = {
    name: document.getElementById('error-name'),
    number: document.getElementById('error-number'),
    date: document.getElementById('error-date'),
    cvc: document.getElementById('error-cvc')
};

// Real-time name validation
fields.name.addEventListener('input', debounce(() => {
    const value = fields.name.value.trim();
    const latin = /^[A-Za-z\s]+$/;
    const properCase = /^[A-Z][a-z]+ [A-Z][a-z]+$/;
    const fullCaps = /^[A-Z]+ [A-Z]+$/;

    if (!latin.test(value)) {
        errors.name.textContent = "Use only Latin letters (A–Z, a–z) and a space.";
        fields.name.classList.add('error-border');
    } else if (!(properCase.test(value) || fullCaps.test(value))) {
        errors.name.textContent = "Enter first and last name with capital letters (e.g. John Smith or JOHN SMITH).";
        fields.name.classList.add('error-border');
    } else {
        errors.name.textContent = "";
        fields.name.classList.remove('error-border');
    }
}, 1250));

// Real-time card number validation
fields.number.addEventListener('input', debounce(() => {
    const valid = /^\d{4} \d{4} \d{4} \d{4}$/.test(fields.number.value.trim());
    errors.number.textContent = valid ? "" : "Card number must be 16 digits in groups of 4.";
    fields.number.classList.toggle('error-border', !valid);
}, 1250));

// Real-time expiry date validation
[fields.mm, fields.yy].forEach(input =>
    input.addEventListener('input', debounce(() => {
        const monthValid = +fields.mm.value >= 1 && +fields.mm.value <= 12;
        const yearValid = /^\d{2}$/.test(fields.yy.value);
        const isValid = monthValid && yearValid;

        errors.date.textContent = isValid ? "" : "Enter a valid expiry date (MM/YY).";
        fields.mm.classList.toggle('error-border', !monthValid);
        fields.yy.classList.toggle('error-border', !yearValid);
    }, 1250))
);

// Real-time CVC validation
fields.cvc.addEventListener('input', debounce(() => {
    const valid = /^\d{3}$/.test(fields.cvc.value.trim());
    errors.cvc.textContent = valid ? "" : "CVC must be exactly 3 digits.";
    fields.cvc.classList.toggle('error-border', !valid);
}, 1250));

// Form submission with validation
document.getElementById('payment-form').addEventListener('submit', function (e) {
    e.preventDefault();

    // Reset previous error messages
    Object.values(fields).forEach(f => f.classList.remove('error-border'));
    Object.values(errors).forEach(span => span.textContent = '');

    // Validation rules
    const nameValid = /^[A-Za-z\s]{2,}$/.test(fields.name.value.trim());
    const numberValid = /^\d{4} \d{4} \d{4} \d{4}$/.test(fields.number.value.trim());
    const cvcValid = /^\d{3}$/.test(fields.cvc.value.trim());
    const mmValid = +fields.mm.value >= 1 && +fields.mm.value <= 12;
    const yyValid = /^\d{2}$/.test(fields.yy.value);

    let valid = true;

    if (!nameValid) {
        errors.name.textContent = "Enter a valid name (letters and spaces only).";
        fields.name.classList.add('error-border');
        valid = false;
    }

    if (!numberValid) {
        errors.number.textContent = "Card number must be 16 digits in groups of 4.";
        fields.number.classList.add('error-border');
        valid = false;
    }

    if (!mmValid || !yyValid) {
        errors.date.textContent = "Enter a valid expiry date (MM/YY).";
        fields.mm.classList.add('error-border');
        fields.yy.classList.add('error-border');
        valid = false;
    }

    if (!cvcValid) {
        errors.cvc.textContent = "CVC must be exactly 3 digits.";
        fields.cvc.classList.add('error-border');
        valid = false;
    }

    if (!valid) return;

    // Update visible card preview with submitted values
    document.getElementById('display-name').textContent = fields.name.value.toUpperCase();
    document.getElementById('display-number').textContent = fields.number.value;
    document.getElementById('display-date').textContent = `${fields.mm.value}/${fields.yy.value}`;
    document.getElementById('display-cvc').textContent = fields.cvc.value;

    // Simulate sending the form
    const submitBtn = document.querySelector('button[type="submit"]');
    submitBtn.textContent = "Submitting...";
    setTimeout(() => {
        document.getElementById('form-container').classList.add('hidden');
        document.getElementById('thank-you').classList.remove('hidden');
        submitBtn.textContent = "Confirm";
    }, 1500);
});

// Reset form and UI to default state
function resetForm() {
    const form = document.querySelector('.payment-form');
    form.reset();
    form.classList.remove('hidden');
    document.getElementById('thank-you').classList.add('hidden');

    // Reset card preview fields
    document.getElementById('display-name').textContent = "JANE APPLESEED";
    document.getElementById('display-number').textContent = "0000 0000 0000 0000";
    document.getElementById('display-date').textContent = "00/00";
    document.getElementById('display-cvc').textContent = "000";

    // Clear all errors
    document.querySelectorAll('.error').forEach(e => e.textContent = '');
    document.querySelectorAll('input').forEach(input => input.classList.remove('error-border'));
}

