// ====== System Navigation ======
function showSection(id) {
  document.querySelectorAll(".section").forEach(s => {
    s.style.display = "none";
  });

  let section = document.getElementById(id);
  if (section) section.style.display = "block";

  if (id === "inventory") tampilBarang();
  if (id === "laporan") tampilLaporan();
}

// ====== Inventory System ======
let inventory = JSON.parse(localStorage.getItem("inventory")) || [];

function simpanBarang() {
  let kode = document.getElementById("barcode").value;
  let nama = document.getElementById("nama").value;
  let modal = Number(document.getElementById("modal").value);
  let jual = Number(document.getElementById("jual").value);
  let stok = Number(document.getElementById("stok").value);

  let existing = inventory.find(b => b.barcode === kode);

  if (existing) {
    existing.nama = nama;
    existing.modal = modal;
    existing.jual = jual;
    existing.stok = stok;
    alert("Barang berhasil diupdate");
  } else {
    inventory.push({ barcode: kode, nama, modal, jual, stok });
    alert("Barang berhasil ditambahkan");
  }

  localStorage.setItem("inventory", JSON.stringify(inventory));
  tampilBarang();
  clearForm();
}

function tampilBarang() {
  let keyword = document.getElementById("search").value.toLowerCase();
  let tbody = document.getElementById("listBarang");
  tbody.innerHTML = "";

  inventory
    .filter(b => b.nama.toLowerCase().includes(keyword))
    .forEach(b => {
      tbody.innerHTML += `
<tr>
  <td>${b.barcode}</td>
  <td>${b.nama}</td>
  <td>${b.modal}</td>
  <td>${b.jual}</td>
  <td>${b.stok}</td>
  <td>
    <button onclick="editBarang('${b.barcode}')">Edit</button>
    <button onclick="hapusBarang('${b.barcode}')">Hapus</button>
    <button onclick="restock('${b.barcode}',10)">+10</button>
    <button onclick="restock('${b.barcode}',20)">+20</button>
  </td>
</tr>
`;
    });
}

function editBarang(kode) {
  let b = inventory.find(b => b.barcode === kode);
  document.getElementById("barcode").value = b.barcode;
  document.getElementById("nama").value = b.nama;
  document.getElementById("modal").value = b.modal;
  document.getElementById("jual").value = b.jual;
  document.getElementById("stok").value = b.stok;
}

function hapusBarang(kode) {
  if (confirm("Yakin hapus barang?")) {
    inventory = inventory.filter(b => b.barcode !== kode);
    localStorage.setItem("inventory", JSON.stringify(inventory));
    tampilBarang();
  }
}

function restock(kode, jumlah) {
  let b = inventory.find(b => b.barcode === kode);
  if (b) {
    b.stok += jumlah;
    localStorage.setItem("inventory", JSON.stringify(inventory));
    tampilBarang();
  }
}

function clearForm() {
  document.getElementById("barcode").value = "";
  document.getElementById("nama").value = "";
  document.getElementById("modal").value = "";
  document.getElementById("jual").value = "";
  document.getElementById("stok").value = "";
}

// ====== Transaksi System ======
let transaksi = JSON.parse(localStorage.getItem("transaksi")) || [];
let keranjang = [];
let total = 0;
let totalProfit = 0;

function tambahKeKeranjang() {
  let kode = document.getElementById("scanBarcode").value;
  let qtyVal = Number(document.getElementById("qty").value);
  let barang = inventory.find(b => b.barcode === kode);

  if (!barang) {
    alert("Barang tidak ditemukan");
    return;
  }
  if (barang.stok < qtyVal) {
    alert("Stok tidak cukup");
    return;
  }

  let subtotal = barang.jual * qtyVal;
  let profit = (barang.jual - barang.modal) * qtyVal;

  keranjang.push({ nama: barang.nama, qty: qtyVal, subtotal, profit });
  barang.stok -= qtyVal;

  total += subtotal;
  totalProfit += profit;

  document.getElementById("scanBarcode").value = "";
  document.getElementById("qty").value = "";
  keranjangTampil();
  localStorage.setItem("inventory", JSON.stringify(inventory));
}

function keranjangTampil() {
  let list = document.getElementById("keranjang");
  list.innerHTML = "";
  keranjang.forEach(k => {
    list.innerHTML += `<li>${k.nama} x${k.qty} = ${k.subtotal}</li>`;
  });
  document.getElementById("total").innerText = total;
}

function selesaiTransaksi() {
  let today = new Date().toLocaleDateString();
  transaksi.push({ tanggal: today, total, profit: totalProfit });
  localStorage.setItem("transaksi", JSON.stringify(transaksi));

  keranjang = [];
  total = 0;
  totalProfit = 0;
  keranjangTampil();
  alert("Transaksi selesai");
}

// ====== Laporan ======
function tampilLaporan() {
  let today = new Date().toLocaleDateString();
  let hariIni = transaksi.filter(t => t.tanggal === today);

  let totalHarian = hariIni.reduce((a, b) => a + b.total, 0);
  let profitHarian = hariIni.reduce((a, b) => a + b.profit, 0);

  document.getElementById("hasilLaporan").innerHTML = `
Tanggal: ${today}<br>
Total Penjualan: ${totalHarian}<br>
Total Keuntungan: ${profitHarian}
`;
}
