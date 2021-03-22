'use strict';

// Data
const account1 = {
  owner: 'Lionel Delamare',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
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


const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = ''; // Overwrite the initial content

  // We don't override the base array
  // (a, b) : a = current value || b = next value
  const movs = sort ? acc.movements.slice().sort((a, b) => a - b) : acc.movements;

  movs.forEach(function (currentMovement, index) {
    const type = currentMovement > 0 ? 'deposit' : 'withdrawal';
    const date = new Date(acc.movementsDates[index]);

    const day = `${date.getDate()}`.padStart(2, 0);
    const month = `${date.getMonth() + 1}`.padStart(2, 0);
    const year = `${date.getFullYear()}`;
    const displayDate = `${day}/${month}/${year}`;

    const html = `
    <div class="movements__row">
          <div class="movements__type movements__type--${type}">${index + 1} ${type}</div>
          <div class="movements__date">${displayDate}</div>
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
  labelSumIn.textContent = `${incomes.toFixed(2)} €`;

  const out = acc.movements
      .filter(mov => mov < 0)
      .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out).toFixed(2)} €`;

  const interest = acc.movements
      .filter(mov => mov > 0)
      .map(deposit => deposit * acc.interestRate / 100)
      .filter((int, i, arr) => int >= 1)   // int = interest
      .reduce((acc, int) => acc + int) // int = interest
  labelSumInterest.textContent = `${interest.toFixed(2)} €`;
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
  displayMovements(acc);

  // Display Balance
  calcAndDisplayBalance(acc);

  // Display Summary
  calcAndDisplaySummary(acc);
}

// Event Handlers
let currentAccount;

currentAccount = account1;
updateUI(currentAccount);
containerApp.style.opacity = 100;

// Implementing date
const now = new Date();
const day = `${now.getDate()}`.padStart(2, 0);
const month = `${now.getMonth() + 1}`.padStart(2, 0);
const year = now.getFullYear();
const hour = now.getHours();
const minute = now.getMinutes();

labelDate.textContent = `${day}/${month}/${year}, ${hour}:${minute}`;

// Get user and account summary
btnLogin.addEventListener('click', function (event) {
  // Prevent form from submitting
  event.preventDefault();

  currentAccount = accounts.find(acc => acc?.userInitials === inputLoginUsername.value)   // acc = account
  if (currentAccount?.pin === +inputLoginPin.value) {
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

  const amount = +inputTransferAmount.value;
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

// Loan Features
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  // Loan granted only if the deposit >= 10 % of the requested amount of loan
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount / 10)) {
    // Add the movement
    currentAccount.movements.push(amount);

    // Update UI
    updateUI(currentAccount);
  }

  // Clear Field
  inputLoanAmount.value = '';
  inputLoanAmount.blur();
});

// Delete User Account
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (inputCloseUsername.value === currentAccount.userInitials && +inputClosePin.value === currentAccount.pin) {
    const index = accounts.findIndex(acc => acc.userInitials === currentAccount.userInitials); // Find user index
    accounts.splice(index, 1) // Select the index and remove only one element (Delete Account)
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = '';
  inputClosePin.value = '';
  inputClosePin.blur();
});

// Sorting amounts
let sorted = false; // Variable to preserve the sorted state to false
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted; // Flip the sorted variable
});


const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);
