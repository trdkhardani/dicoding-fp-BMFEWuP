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
    id: generateId(),
    title: "dummy-inc-1",
    amount: 20000,
    date: new Date(),
    type: TrxType.INCOME,
  },
  {
    title: "dummy-inc-2",
    amount: 20000,
    date: new Date(),
    type: TrxType.INCOME,
    id: generateId(),
  },
  {
    title: "dummy-exp-1",
    amount: 5000,
    date: new Date(),
    type: TrxType.EXPENSE,
    id: generateId(),
  },
  {
    title: "dummy-exp-2",
    amount: 5000,
    date: new Date(),
    type: TrxType.EXPENSE,
    id: generateId(),
  },
);
console.log(transactions);

function generateId() {
  return +new Date();
}

const incomeList = document.querySelector("#incomeList");
const expenseList = document.querySelector("#expenseList");

/**
 * @param {Element} trxTypeElementId
 * @param {Transaction[]} transactions
 */
const setTransactionsDisplay = (trxTypeElementId, transactions, amountColor) => {
  for (const trx of transactions) {
    const trxItemContainer = document.createElement('div');
    trxItemContainer.id = `transaction-${trx.id}`;
    trxItemContainer.classList.add('tracker-transaction-item')

    const trxTitle = document.createElement("h2");
    trxTitle.innerText = trx.title;
    trxItemContainer.appendChild(trxTitle);

    const trxAmount = document.createElement("p");
    trxAmount.style.color = amountColor;
    trxAmount.innerText = trx.amount;
    trxItemContainer.appendChild(trxAmount);

    const trxDate = document.createElement("p");
    trxDate.innerText = `${trx.date.getDate()}/${trx.date.getMonth()}/${trx.date.getFullYear()}`;
    trxItemContainer.appendChild(trxDate);

    const trxType = document.createElement("p");
    trxType.innerText = trx.type;
    trxItemContainer.appendChild(trxType);

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
  const income = transactions.filter((trx) => trx.type === TrxType.INCOME);
  const expenses = transactions.filter((trx) => trx.type === TrxType.EXPENSE);

  const incomeTotal = calculateTotal(income);
  const expensesTotal = calculateTotal(expenses);
  const currentBalance = incomeTotal - expensesTotal;

  const incomeTotalElement = document.querySelector('.tracker-summary__stat-amount--income');
  const expenseTotalElement = document.querySelector('.tracker-summary__stat-amount--expense');
  const currentBalanceElement = document.querySelector('.tracker-summary__balance-amount');

  incomeTotalElement.innerText = `Rp${incomeTotal}`;
  expenseTotalElement.innerText = `Rp${expensesTotal}`;
  currentBalanceElement.innerText = `Rp${currentBalance}`;
}

function displayTransactions() {
  incomeList.innerHTML = "";
  expenseList.innerHTML = "";

  const element = document.documentElement;

  const colorIncome = getComputedStyle(element).getPropertyValue('--color-income')
  const colorExpense = getComputedStyle(element).getPropertyValue('--color-expense')

  const incomes = transactions.filter((trx) => trx.type === TrxType.INCOME);
  const expenses = transactions.filter((trx) => trx.type === TrxType.EXPENSE);

  setTransactionsDisplay(incomeList, incomes, colorIncome);
  setTransactionsDisplay(expenseList, expenses, colorExpense);
}

document.addEventListener('DOMContentLoaded', () => {
  displayTransactions();
  displayTotal();

  const trxForm = document.getElementById('transactionForm');
  trxForm.addEventListener('submit', (ev) => {
    ev.preventDefault();
    addTransaction();
  })
})

function addTransaction() {
  const input = {
    title: document.getElementById('transactionFormTitleInput').value,
    amount: document.getElementById('transactionFormAmountInput').value,
    date: new Date(document.getElementById('transactionFormDateInput').value),
    type: document.getElementById('transactionFormTypeSelect').value,
  }

  // validation
  if (input.title === '' || !input.title)
    return alert('Keterangan tidak boleh kosong');

  if (Number(input.amount) < 0)
    return alert('Nominal tidak boleh negatif');

  // if (input.date == {})
  //   return alert('Tanggal tidak boleh kosong');

  transactions.push({
    id: generateId(),
    title: input.title,
    amount: input.amount,
    date: input.date,
    type: input.type
  });

  displayTransactions();
  displayTotal();
}