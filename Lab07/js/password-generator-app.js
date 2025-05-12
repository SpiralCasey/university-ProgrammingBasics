const passwordEl = document.getElementById('password-text');
const copyBtn = document.getElementById('copy');
const copiedText = document.getElementById('copied');
const lengthEl = document.getElementById('length');
const lengthValueEl = document.getElementById('lengthValue');
const strengthLabel = document.getElementById('strengthLabel');

// Get all strength bars
const bars = ['bar1', 'bar2', 'bar3', 'bar4'].map(id => document.getElementById(id));

// Character sets
const upperSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const lowerSet = 'abcdefghijklmnopqrstuvwxyz';
const numberSet = '0123456789';
const symbolSet = '!@#$%^&*(){}[]=<>/,.|~?';

function generatePassword() {
  const length = +lengthEl.value;

  // Check which options are selected
  const options = {
    upper: document.getElementById('uppercase').checked,
    lower: document.getElementById('lowercase').checked,
    numbers: document.getElementById('numbers').checked,
    symbols: document.getElementById('symbols').checked
  };

  // Build the full character set based on selected options
  let charSet = '';
  if (options.upper) charSet += upperSet;
  if (options.lower) charSet += lowerSet;
  if (options.numbers) charSet += numberSet;
  if (options.symbols) charSet += symbolSet;

  // Return early if no options selected
  if (!charSet) {
    passwordEl.textContent = 'Select options!';
    return;
  }

  // Generate password
  let password = '';
  for (let i = 0; i < length; i++) {
    password += charSet[Math.floor(Math.random() * charSet.length)];
  }
  passwordEl.textContent = password;

  // Evaluate strength
  evaluateStrength(length, options);
}

function evaluateStrength(length, { upper, lower, numbers, symbols }) {
  let score = [upper, lower, numbers, symbols].filter(Boolean).length;

  if (length < 6) score = 1;
  else if (length < 10) score = Math.min(score, 2);
  else if (length < 14) score = Math.min(score, 3);

  // Reset strength bar classes
  bars.forEach(bar => bar.className = 'bar');

  // Assigning strength label and color
  const config = {
    1: { text: 'TOO WEAK', class: 'red', count: 1 },
    2: { text: 'WEAK', class: 'orange', count: 2 },
    3: { text: 'MEDIUM', class: 'yellow', count: 3 },
    4: { text: 'STRONG', class: 'green', count: 4 }
  };

  const level = config[score];
  strengthLabel.textContent = level.text;
  for (let i = 0; i < level.count; i++) {
    bars[i].classList.add('active', level.class);
  }
}

// Copy password to clipboard and show animation
function copyToClipboard() {
  const password = passwordEl.textContent;
  navigator.clipboard.writeText(password).then(() => {
    copyBtn.style.opacity = "0";
    copiedText.style.opacity = "1";

    setTimeout(() => {
      copyBtn.style.opacity = "1";
      copiedText.style.opacity = "0";
    }, 1000);
  });
}

// Updating character length label when slider moves
lengthEl.addEventListener('input', () => {
  lengthValueEl.textContent = lengthEl.value;
});

// Generating password on page load
generatePassword();