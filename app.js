// ==========================
// DATABASE
// ==========================

let inventory = JSON.parse(localStorage.getItem("inventory") || "[]")
let cart = []
let laporan = JSON.parse(localStorage.getItem("laporan") || "[]")
let hutang = JSON.parse(localStorage.getItem("hutang") || "[]")

// ==========================
// NAVIGATION
// ==========================

function showPage(id){

document.querySelectorAll(".section").forEach(s=>s.style.display="none")

document.getElementById(id).style.display="block"

}

showPage("dashboard")

// ==========================
// CLOCK
// ==========================

setInterval(()=>{

let now = new Date()

document.getElementById("timeNow").innerText =
now.toLocaleDateString()+" "+now.toLocaleTimeString()

},1000)

// ==========================
// SAVE INVENTORY
// ==========================

function saveBarang(){

let barang = {

barcode1:inv_barcode1.value,
barcode2:inv_barcode2.value,
barcode3:inv_barcode3.value,

nama:inv_nama.value,
kategori:inv_kategori.value,
satuan:inv_satuan.value,

modal:Number(inv_modal.value),
jual:Number(inv_jual.value),

stok:Number(inv_stok.value),
minstok:Number(inv_minstok.value)

}

inventory.push(barang)

localStorage.setItem("inventory",JSON.stringify(inventory))

renderInventory()

resetInventoryForm()

}

// ==========================
// RESET FORM
// ==========================

function resetInventoryForm(){

inv_barcode1.value=""
inv_barcode2.value=""
inv_barcode3.value=""

inv_nama.value=""
inv_modal.value=""
inv_jual.value=""
inv_stok.value=""
inv_minstok.value=""

}

// ==========================
// RENDER INVENTORY
// ==========================

function renderInventory(){

let html=""

inventory.forEach((b,i)=>{

html+=`

<tr>

<td>${b.nama}</td>
<td>${b.kategori}</td>
<td>${b.satuan}</td>

<td>${b.modal}</td>
<td>${b.jual}</td>

<td>${b.stok}</td>
<td>${b.minstok}</td>

<td>

<button onclick="hapusBarang(${i})">Hapus</button>

</td>

</tr>

`

})

inventoryTable.innerHTML=html

checkMinStock()

}

renderInventory()

// ==========================
// DELETE BARANG
// ==========================

function hapusBarang(i){

inventory.splice(i,1)

localStorage.setItem("inventory",JSON.stringify(inventory))

renderInventory()

}

// ==========================
// MINIMUM STOCK ALERT
// ==========================

function checkMinStock(){

let alert=""

inventory.forEach(b=>{

if(b.stok<=b.minstok){

alert+=b.nama+" stok rendah<br>"

}

})

alertStock.innerHTML=alert

}

// ==========================
// ADD CART
// ==========================

function addCart(){

let barcode = kasir_barcode.value

let barang = inventory.find(b=>
b.barcode1==barcode ||
b.barcode2==barcode ||
b.barcode3==barcode
)

if(!barang){

barang={
barcode1:barcode,
nama:kasir_nama.value,
satuan:kasir_satuan.value,
modal:0,
jual:0
}

}

let qty = Number(kasir_qty.value)

cart.push({

barcode:barcode,
nama:barang.nama,
satuan:barang.satuan,

qty:qty,

modal:barang.modal,
jual:barang.jual

})

renderCart()

}

// ==========================
// RENDER CART
// ==========================

function renderCart(){

let html=""

let totalModal=0
let totalJual=0

cart.forEach((c,i)=>{

let sub=c.qty*c.jual

totalModal+=c.qty*c.modal
totalJual+=sub

html+=`

<tr>

<td>${c.barcode}</td>
<td>${c.nama}</td>
<td>${c.satuan}</td>

<td>${c.qty}</td>

<td>${c.modal}</td>
<td>${c.jual}</td>

<td>${sub}</td>

<td>

<button onclick="hapusCart(${i})">X</button>

</td>

</tr>

`

})

cartTable.innerHTML=html

totalModalEl = document.getElementById("totalModal")
totalJualEl = document.getElementById("totalJual")
totalBayarEl = document.getElementById("totalBayar")

totalModalEl.innerText=totalModal
totalJualEl.innerText=totalJual
totalBayarEl.innerText=totalJual

}

// ==========================
// DELETE CART
// ==========================

function hapusCart(i){

cart.splice(i,1)

renderCart()

}

// ==========================
// RESET CART
// ==========================

function resetCart(){

cart=[]

renderCart()

}

// ==========================
// HITUNG KEMBALIAN
// ==========================

uangBayar?.addEventListener("input",()=>{

let total=Number(totalBayar.innerText)

let bayar=Number(uangBayar.value)

kembalian.innerText = bayar-total

})

// ==========================
// BAYAR
// ==========================

function bayar(){

let now=new Date()

cart.forEach(c=>{

laporan.push({

tanggal:now.toLocaleDateString(),
jam:now.toLocaleTimeString(),

barcode:c.barcode,
nama:c.nama,

satuan:c.satuan,
qty:c.qty,

modal:c.modal,
jual:c.jual

})

// kurangi stok

let barang=inventory.find(b=>
b.barcode1==c.barcode ||
b.barcode2==c.barcode ||
b.barcode3==c.barcode
)

if(barang){

barang.stok -= c.qty

}

})

localStorage.setItem("laporan",JSON.stringify(laporan))
localStorage.setItem("inventory",JSON.stringify(inventory))

renderInventory()
renderLaporan()

resetCart()

}

// ==========================
// RENDER LAPORAN
// ==========================

function renderLaporan(){

let html=""

laporan.forEach(l=>{

html+=`

<tr>

<td>${l.tanggal}</td>
<td>${l.jam}</td>

<td>${l.barcode}</td>
<td>${l.nama}</td>

<td>${l.satuan}</td>

<td>${l.qty}</td>

<td>${l.modal}</td>
<td>${l.jual}</td>

</tr>

`

})

laporanTable.innerHTML=html

}

renderLaporan()

// ==========================
// RESET
// ==========================

function resetInventory(){

if(confirm("Hapus semua inventory?")){

inventory=[]

localStorage.removeItem("inventory")

renderInventory()

}

}

function resetLaporan(){

if(confirm("Hapus laporan?")){

laporan=[]

localStorage.removeItem("laporan")

renderLaporan()

}

}

function resetHutang(){

hutang=[]

localStorage.removeItem("hutang")

}

// ==========================
