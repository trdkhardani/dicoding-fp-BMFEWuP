/**
 * ========================================================
 * Expense Tracker App — main.js
 * ========================================================
 * Tulis seluruh kode JavaScript kamu di sini.
 */

// TODO [Basic] Buat variabel array untuk menyimpan semua data transaksi, contoh: let transactions = []

// TODO [Basic] Buat fungsi untuk menghasilkan ID unik secara otomatis, contoh: gunakan +new Date()

/**
 * ========================================================
 * Kriteria 1: Memanipulasi DOM untuk Form dan Daftar Transaksi
 * ========================================================
 */
// TODO [Basic] Ambil elemen kontainer incomeList dan expenseList dari DOM

/**
 * TODO [Basic]:
 * Buat fungsi untuk menampilkan (render) semua transaksi ke layar:
 *  - Kosongkan kontainer terlebih dahulu sebelum mengisi ulang
 *  - Gunakan perulangan, buat setiap elemen kartu dengan document.createElement()
 *  - Pastikan setiap elemen memiliki atribut data-testid yang sesuai (lihat panduan di rubrik)
 *  - Masukkan kartu ke kontainer yang tepat: income → incomeList, expense → expenseList
 */

// TODO [Basic] Tambahkan event listener 'submit' pada form, panggil e.preventDefault() di dalamnya
// TODO [Basic] Di dalam handler submit, ambil nilai input lalu tambahkan sebagai objek transaksi baru ke array

/**
 * TODO [Skilled]:
 * Tambahkan validasi input sebelum menyimpan data:
 *  - Tampilkan alert() dan hentikan proses jika judul kosong
 *  - Tampilkan alert() dan hentikan proses jika nominal kurang dari 1
 */

/**
 * TODO [Advanced]:
 * Setiap kali data transaksi berubah, perbarui Panel Dasbor:
 *  - Hitung total pemasukan, total pengeluaran, dan saldo (pemasukan - pengeluaran)
 *  - Tampilkan hasilnya ke elemen yang sesuai di HTML
 */

/**
 * ========================================================
 * Kriteria 2: Mengelola Penyimpanan Data (Web Storage API)
 * ========================================================
 */
/**
 * TODO [Basic]:
 * Data transaksi disimpan ke localStorage menggunakan JSON.stringify(), dan dimuat kembali saat halaman dibuka menggunakan JSON.parse().
 *  - Tombol "Hapus" berfungsi: transaksi yang dihapus langsung hilang dari layar dan dari localStorage.
 */

/**
 * TODO [Skilled]:
 * Tombol "Edit" berfungsi: saat ditekan, formulir (#transactionForm) secara otomatis terisi dengan data transaksi yang dipilih.
 *  - Pengguna dapat mengubah data lalu menyimpan perubahan.
 *  - Formulir kembali ke mode "Tambah" setelah pembaruan selesai.
 */

/**
 * TODO [Advanced]:
 * Gunakan Custom Event sebagai penghubung antara perubahan data dan pembaruan tampilan:
 *  - Kirim sinyal dengan document.dispatchEvent(new Event('transaction:updated')) setiap kali data berubah
 *  - Pasang satu listener untuk event tersebut yang memanggil fungsi render dan update dasbor
 */

/**
 * ========================================================
 * Kriteria 3: Fitur Interaktif (Pindah Kategori dan Pencarian)
 * ========================================================
 */
/**
 * TODO [Basic]:
 * Tambahkan tombol "Ubah Tipe" pada setiap kartu transaksi:
 *  - Saat diklik, ubah tipe transaksi: 'income' → 'expense' atau 'expense' → 'income'
 *  - Simpan perubahan ke localStorage dan perbarui tampilan
 */

/**
 * TODO [Skilled]:
 * Tambahkan event listener 'input' pada kolom pencarian:
 *  - Filter array transaksi berdasarkan kecocokan kata kunci dengan judul transaksi
 *  - Tampilkan hanya transaksi yang judulnya mengandung kata kunci tersebut
 */

/**
 * TODO [Advanced]:
 * Pastikan fitur pencarian berjalan dengan baik di semua kondisi:
 *  - Saat kolom pencarian dikosongkan, tampilkan kembali seluruh daftar transaksi
 */

/**
 * @readonly
 * @enum {string}
 */
const TrxType = {
  INCOME: "income",
  EXPENSE: "expense",
};

/**
 * @typedef {Object} Transaction
 * @property {string} id
 * @property {string} title
 * @property {number} amount
 * @property {Date} date
 * @property {TrxType} type
 */

/** @type {Transaction[]} */
let transactions = [];

// DUMMY TRANSACTIONS DATA (DELSOON)
transactions.push(
  {
    id: `${generateId()}__1`,
    title: "dummy-inc-1",
    amount: 20000,
    date: '2026-08-31',
    type: TrxType.INCOME,
  },
  {
    id: `${generateId()}__2`,
    title: "dummy-inc-2",
    amount: 20000,
    date: '2026-08-31',
    type: TrxType.INCOME,
  },
  {
    id: `${generateId()}__3`,
    title: "dummy-exp-1",
    amount: 5000,
    date: '2026-08-31',
    type: TrxType.EXPENSE,
  },
  {
    id: `${generateId()}__4`,
    title: "dummy-exp-2",
    amount: 5000,
    date: '2026-08-31',
    type: TrxType.EXPENSE,
  },
);

const transactionsDataKey = 'TRANSACTIONS_DATA';
const editModeKey = 'EDIT_MODE';
const editTrxIdKey = 'EDIT_TRX_ID';
const TRANSACTION_UPDATED_EVENT = 'transaction:updated';

function rupiahFormatter(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
  }).format(amount);
}

function checkStorage() {
  return typeof (Storage) !== 'undefined';
}

if (!localStorage.getItem(transactionsDataKey)) {
  localStorage.setItem(transactionsDataKey, JSON.stringify(transactions));
}
console.log(JSON.parse(localStorage.getItem(transactionsDataKey)) || []);

function generateId() {
  return +new Date();
}

const incomeList = document.querySelector("#incomeList");
const expenseList = document.querySelector("#expenseList");

const clearForm = () => {
  document.getElementById('transactionFormTitleInput').value = '';
  document.getElementById('transactionFormAmountInput').value = '';
  document.getElementById('transactionFormDateInput').value = '';
  document.getElementById('transactionFormTypeSelect').value = 'income';
}

document.addEventListener(TRANSACTION_UPDATED_EVENT, () => {
  incomeList.innerHTML = "";
  expenseList.innerHTML = "";
  clearForm();
  displayTransactions();
  displayTotal();
});

/**
 * @param {Element} trxTypeElementId
 * @param {Transaction[]} transactions
 */
const setTransactionsDisplay = (trxTypeElementId, transactions) => {
  for (const trx of transactions) {
    const trxItemContainer = document.createElement('div');
    trxItemContainer.setAttribute('data-transactionid', trx.id);
    trxItemContainer.setAttribute('data-testid', 'transactionItem');
    trxItemContainer.classList.add('tracker-transaction-item')

    // expense/income icon
    const trxTypeIcon = document.createElement("div");
    trxTypeIcon.classList.add('tracker-transaction-item__icon');
    trxTypeIcon.classList.add(`tracker-transaction-item__icon--${trxTypeElementId === incomeList ? 'income' : 'expense'}`);
    const signIcon = document.createElement('p');
    signIcon.innerText = trx.type === TrxType.INCOME ? '+' : '-';

    const moneyIcon = document.createElement('img');
    moneyIcon.src = './images/money-icon.png';
    moneyIcon.width = 24;

    trxTypeIcon.appendChild(signIcon);
    trxTypeIcon.appendChild(moneyIcon);

    trxItemContainer.appendChild(trxTypeIcon);

    // detail wrapper (title and date)
    const detailWrapper = document.createElement('div');
    detailWrapper.classList.add('tracker-transaction-item__detail');
    trxItemContainer.appendChild(detailWrapper);

    const trxTitle = document.createElement("h4");
    trxTitle.classList.add('tracker-transaction-item__title');
    trxTitle.setAttribute('data-testid', 'transactionItemTitle');
    trxTitle.innerText = trx.title;
    detailWrapper.appendChild(trxTitle);

    const trxDate = document.createElement("p");
    trxDate.classList.add('tracker-transaction-item__date');
    trxDate.setAttribute('data-testid', 'transactionItemDate');
    trxDate.innerText = trx.date;
    detailWrapper.appendChild(trxDate);

    // transaction type (hidden)
    const trxTypeIdentifier = document.createElement('p');
    trxTypeIdentifier.setAttribute('data-testid', 'transactionItemType');
    trxTypeIdentifier.innerText = trx.type === TrxType.INCOME ? 'Pemasukan' : 'Pengeluaran';
    trxTypeIdentifier.style.display = 'none';
    detailWrapper.appendChild(trxTypeIdentifier);

    // right side wrapper (amount and actions)
    const rightSide = document.createElement('div');
    rightSide.classList.add('tracker-transaction-item__right');
    trxItemContainer.appendChild(rightSide)

    const trxAmount = document.createElement("p");
    trxAmount.classList.add('tracker-transaction-item__amount');
    trxAmount.classList.add(`tracker-transaction-item__amount--${trxTypeElementId === incomeList ? 'income' : 'expense'}`);
    trxAmount.setAttribute('data-testid', 'transactionItemAmount');
    trxAmount.innerText = rupiahFormatter(trx.amount);
    // trxItemContainer.appendChild(trxAmount);
    rightSide.appendChild(trxAmount);

    // wrapper for buttons
    const actionsWrapper = document.createElement('div');
    actionsWrapper.classList.add('tracker-transaction-item__actions');
    rightSide.appendChild(actionsWrapper);
    // trxItemContainer.appendChild(actionsWrapper);

    const switchTypeButton = document.createElement('button');
    switchTypeButton.classList.add('tracker-transaction-item__btn');
    switchTypeButton.classList.add('btn-switch-type');
    switchTypeButton.setAttribute('data-testid', 'transactionItemEditTypeButton');
    switchTypeButton.innerText = 'Ubah Tipe';
    switchTypeButton.addEventListener('click', () => {
      changeTrxType(trx.id);
    });
    actionsWrapper.appendChild(switchTypeButton);

    const editButton = document.createElement('button');
    editButton.classList.add('tracker-transaction-item__btn');
    editButton.classList.add('btn-edit');
    editButton.setAttribute('data-testid', 'transactionItemEditButton');
    editButton.innerText = 'Edit';
    editButton.addEventListener('click', () => {
      window.location.replace(`${window.location.origin}/#form-heading`)
      changeFormForUpdate(trx.id);
    });
    actionsWrapper.appendChild(editButton);

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('tracker-transaction-item__btn');
    deleteButton.classList.add('btn-delete');
    deleteButton.setAttribute('data-testid', 'transactionItemDeleteButton');
    deleteButton.innerText = 'Hapus';
    deleteButton.addEventListener('click', () => {
      deleteTransaction(trx.id);
    });
    actionsWrapper.appendChild(deleteButton);

    trxTypeElementId.appendChild(trxItemContainer);
  }

  return;
}

/**
 * @param {Element} trxTypeElementId
 * @param {Transaction[]} transactions
 */
function calculateTotal(transactions) {
  let total = 0;

  for (const trx of transactions) {
    total += Number(trx.amount)
  }

  return Number(total);
}

function displayTotal() {
  if (checkStorage()) {
    /**@type {Transaction[]} */
    const transactions = JSON.parse(localStorage.getItem(transactionsDataKey));

    const income = transactions.filter((trx) => trx.type === TrxType.INCOME);
    const expenses = transactions.filter((trx) => trx.type === TrxType.EXPENSE);

    const incomeTotal = calculateTotal(income);
    const expensesTotal = calculateTotal(expenses);
    const currentBalance = incomeTotal - expensesTotal;

    const incomeTotalElement = document.querySelector('.tracker-summary__stat-amount--income');
    const expenseTotalElement = document.querySelector('.tracker-summary__stat-amount--expense');
    const currentBalanceElement = document.querySelector('.tracker-summary__balance-amount');

    incomeTotalElement.innerText = rupiahFormatter(incomeTotal);
    expenseTotalElement.innerText = rupiahFormatter(expensesTotal);
    currentBalanceElement.innerText = rupiahFormatter(currentBalance);
  } else {
    return alert('Browser tidak support web storage');
  }
}

function displayTransactions(searchTitle = '') {
  if (checkStorage()) {
    transactions = JSON.parse(localStorage.getItem(transactionsDataKey));

    let incomes = transactions.filter((trx) => trx.type === TrxType.INCOME);
    let expenses = transactions.filter((trx) => trx.type === TrxType.EXPENSE);

    if (searchTitle.length > 0) {
      incomes = incomes.filter((incomeTrx) => incomeTrx.title.trim().toLowerCase().includes(searchTitle.trim().toLowerCase()));
      expenses = expenses.filter((expenseTrx) => expenseTrx.title.trim().toLowerCase().includes(searchTitle.trim().toLowerCase()));
    }

    setTransactionsDisplay(incomeList, incomes);
    setTransactionsDisplay(expenseList, expenses);
  } else {
    return alert('Browser tidak support web storage');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.dispatchEvent(new Event(TRANSACTION_UPDATED_EVENT));

  const transactionForm = document.getElementById('transactionForm');
  console.log(localStorage.getItem(editModeKey));
  console.log(localStorage.getItem(editModeKey) == 'true');

  transactionForm.addEventListener('submit', (ev) => {
    console.log('add bwangg');
    ev.preventDefault();
    localStorage.getItem(editModeKey) == 'true' ? updateTransaction() : addTransaction();
  });

  const searchTransactionFormTitleInput = document.getElementById('searchTransactionFormTitleInput');
  searchTransactionFormTitleInput.addEventListener('input', () => {
    incomeList.innerHTML = "";
    expenseList.innerHTML = "";
    searchTransactions();
  })
})

function saveChangesToStorage(transactions) {
  localStorage.setItem(transactionsDataKey, JSON.stringify(transactions));
}

function addTransaction() {
  const input = {
    title: document.getElementById('transactionFormTitleInput').value,
    amount: document.getElementById('transactionFormAmountInput').value,
    date: document.getElementById('transactionFormDateInput').value,
    type: document.getElementById('transactionFormTypeSelect').value,
  }

  // validation
  if (input.title === '' || !input.title)
    return alert('Keterangan tidak boleh kosong');

  if (Number(input.amount) < 0)
    return alert('Nominal tidak boleh negatif');

  // if (input.date == {})
  //   return alert('Tanggal tidak boleh kosong');

  transactions = JSON.parse(localStorage.getItem(transactionsDataKey));
  transactions.push({
    id: generateId(),
    title: input.title,
    amount: input.amount,
    date: input.date,
    type: input.type
  });

  // save transactions data with newly added one
  localStorage.setItem(transactionsDataKey, JSON.stringify(transactions));

  document.dispatchEvent(new Event(TRANSACTION_UPDATED_EVENT));
}

function deleteTransaction(trxId) {
  /**@type {Transaction[]} */
  const transactions = JSON.parse(localStorage.getItem(transactionsDataKey));

  const trxIndex = transactions.findIndex((trx) => trx.id === trxId);

  transactions.splice(trxIndex, 1);

  saveChangesToStorage(transactions);

  document.dispatchEvent(new Event(TRANSACTION_UPDATED_EVENT));
}

function changeFormForUpdate(trxId) {
  localStorage.setItem(editModeKey, true);

  transactions = JSON.parse(localStorage.getItem(transactionsDataKey));

  const trx = transactions.find((trx) => trx.id === trxId);

  // update form heading and submit btn texts
  const formHeading = document.getElementById('form-heading');
  formHeading.innerText = 'Ubah Pencatatan';

  const submitButton = document.querySelector('.tracker-form__submit');
  submitButton.innerText = 'Perbarui';

  // fill id to local storage
  localStorage.setItem(editTrxIdKey, trx.id);

  // prepopulate
  document.getElementById('transactionFormTitleInput').value = trx.title;
  document.getElementById('transactionFormAmountInput').value = trx.amount;
  document.getElementById('transactionFormDateInput').value = trx.date;
  document.getElementById('transactionFormTypeSelect').value = trx.type;
}

function updateTransaction() {
  const input = {
    title: document.getElementById('transactionFormTitleInput').value,
    amount: document.getElementById('transactionFormAmountInput').value,
    date: document.getElementById('transactionFormDateInput').value,
    type: document.getElementById('transactionFormTypeSelect').value,
  }

  // validation
  if (input.title === '' || !input.title)
    return alert('Keterangan tidak boleh kosong');

  if (Number(input.amount) < 0)
    return alert('Nominal tidak boleh negatif');

  // if (input.date == {})
  //   return alert('Tanggal tidak boleh kosong');

  /**@type {Transaction[]} */
  const transactions = JSON.parse(localStorage.getItem(transactionsDataKey));
  console.log(transactions);

  const trx = transactions.find((trx) => trx.id == localStorage.getItem(editTrxIdKey));
  console.log('editTrxIdKey');
  console.log(localStorage.getItem(editTrxIdKey));
  console.log(trx);

  trx.title = input.title;
  trx.amount = input.amount;
  trx.date = input.date;
  trx.type = input.type;
  // transactions.splice(trxIndex, 1, {
  //   id:
  //   title: input.title,
  //   amount: input.amount,
  //   date: input.date,
  //   type: input.type,
  // });

  // change existing transaction data with newly edited one
  localStorage.setItem(transactionsDataKey, JSON.stringify(transactions));

  const formHeading = document.getElementById('form-heading');
  formHeading.innerText = 'Tambah Pencatatan Baru';

  localStorage.removeItem(editModeKey);
  localStorage.removeItem(editTrxIdKey);

  document.dispatchEvent(new Event(TRANSACTION_UPDATED_EVENT));
}

function changeTrxType(trxId) {
  console.log('well hello from ubah tipe');
  transactions = JSON.parse(localStorage.getItem(transactionsDataKey));
  console.log(transactions);
  const trx = transactions.find((trx) => trx.id === trxId);
  console.log(trx);
  console.log(trx.type === TrxType.EXPENSE);
  // trx.title = 'we macam mana pula kau ini';
  trx.type === TrxType.EXPENSE ? trx.type = TrxType.INCOME : trx.type = TrxType.EXPENSE;

  saveChangesToStorage(transactions);

  document.dispatchEvent(new Event(TRANSACTION_UPDATED_EVENT));
}

function searchTransactions() {
  const searchInput = document.getElementById('searchTransactionFormTitleInput').value;
  displayTransactions(searchInput);
}