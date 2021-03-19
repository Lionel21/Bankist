'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Lionel Delamare',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');


const displayMovements = function (movements) {
  containerMovements.innerHTML = ''; // Overwrite the initial content
  movements.forEach(function (currentMovement, index) {
    const type = currentMovement > 0 ? 'deposit' : 'withdrawal';
    const html = `
    <div class="movements__row">
          <div class="movements__type movements__type--${type}">${index + 1} ${type}</div>
          <div class="movements__value">${currentMovement} €</div>
        </div>
        `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
}

// Calculate Total Balance
const calcAndDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, value) => acc + value, 0);
  labelBalance.textContent = `${acc.balance} €`;
}

// Calculate and display account summary
const calcAndDisplaySummary = function (acc) {  // We pass in the entire account
  const incomes = acc.movements
      .filter(mov => mov > 0)
      .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes} €`;

  const out = acc.movements
      .filter(mov => mov < 0)
      .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)} €`;

  const interest = acc.movements
      .filter(mov => mov > 0)
      .map(deposit => deposit * acc.interestRate / 100)
      .filter((int, i, arr) => int >= 1)   // int = interest
      .reduce((acc, int) => acc + int) // int = interest
  labelSumInterest.textContent = `${interest} €`;
}


// Get user name intials
const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.userInitials = acc.owner.toLowerCase().split(' ').map(letter =>
        `${letter.charAt(0)}`
    ).join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  // Display Movements
  displayMovements(acc.movements);

  // Display Balance
  calcAndDisplayBalance(acc);

  // Display Summary
  calcAndDisplaySummary(acc);
}

// Event Handlers
let currentAccount;

// Get user and account summary
btnLogin.addEventListener('click', function (event) {
  // Prevent form from submitting
  event.preventDefault();

  currentAccount = accounts.find(acc => acc?.userInitials === inputLoginUsername.value)   // acc = account
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and Welcome Message
    labelWelcome.textContent = `Welcome Back, ${currentAccount.owner.split(' ')[0]}`; // Only the Firstname Selected
    containerApp.style.opacity = 100;

    // Clear Fields
    inputLoginUsername.value = '';
    inputLoginPin.value = '';
    inputLoginPin.blur(); // Lose field focus

    // Update the user interface
    updateUI(currentAccount);
  }
});

// Transfer money from a user to an other user
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const receiverAccount = accounts.find(acc => acc?.userInitials === inputTransferTo.value);

  // Check if the current user has enough money in his account and not transfer to the same account
  if (amount > 0 && currentAccount.balance >= amount && receiverAccount?.userInitials !== currentAccount.userInitials) {
    // Doing the transfer
    currentAccount.movements.push(-amount); // Add negative amount for the current user
    receiverAccount.movements.push(amount); // Add positive amount for the receiver

    // Clear Fields
    inputTransferTo.value = '';
    inputTransferAmount.value = '';
    inputTransferAmount.blur();

    // Update the user interface
    updateUI(currentAccount);
  }
});

// Delete User Account
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (inputCloseUsername.value === currentAccount.userInitials && Number(inputClosePin.value) === currentAccount.pin) {
    const index = accounts.findIndex(acc => acc.userInitials === currentAccount.userInitials); // Find user index
    accounts.splice(index, 1) // Select the index and remove only one element (Delete Account)
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = '';
  inputClosePin.value = '';
  inputClosePin.blur();
});


const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);
