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

let barcodes=[]

if(inv_barcode1.value) barcodes.push(inv_barcode1.value)
if(inv_barcode2.value) barcodes.push(inv_barcode2.value)
if(inv_barcode3.value) barcodes.push(inv_barcode3.value)

let barang={

nama:inv_nama.value,
kategori:inv_kategori.value,
satuan:inv_satuan.value,

modal:Number(inv_modal.value),
jual:Number(inv_jual.value),

stok:Number(inv_stok.value),
minstok:Number(inv_minstok.value),

barcodes:barcodes

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

<button onclick="editBarang(${i})">Edit</button>
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

let barang = cariBarang(barcode)

if(!barang){

alert("Barang tidak ditemukan")
return

}

let qty = Number(kasir_qty.value)

cart.push({

barcode:barcode,
nama:barang.nama,
satuan:barang.satuan,

modal:barang.modal,
jual:barang.jual,

qty:qty,
barcodes:barang.barcodes

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
<td onclick="showBarcode(${i})" style="cursor:pointer;color:blue">
${c.nama}
</td>
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

let barang = inventory.find(b =>
b.barcodes && b.barcodes.includes(c.barcode)
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

// ==========================
// BARCODE SCANNER
// ==========================

let scanner

function scanInventory(){

if(scanner){

scanner.stop()

}

scanner = new Html5Qrcode("reader")

scanner.start(
{ facingMode: "environment" },
{
fps:10,
qrbox:250
},
barcode => {

inv_barcode1.value = barcode

scanner.stop()

}
)

}

// ==========================
// SCAN KASIR
// ==========================

function scanKasir(){

if(scanner){

scanner.stop()

}

scanner = new Html5Qrcode("reader")

scanner.start(
{ facingMode: "environment" },
{
fps:10,
qrbox:250
},
barcode => {

kasir_barcode.value = barcode

scanner.stop()

autoIsiBarang(barcode)

}
)

}

// ==========================
// AUTO ISI BARANG
// ==========================

function autoIsiBarang(barcode){

let barang = inventory.find(b =>
b.barcodes && b.barcodes.includes(barcode)
)

if(barang){

kasir_nama.value = barang.nama
kasir_satuan.value = barang.satuan

}

}

searchBarang?.addEventListener("input",()=>{

let key = searchBarang.value.toLowerCase()

let hasil = inventory.filter(b=>
b.nama.toLowerCase().includes(key)
)

let list=""

hasil.forEach(b=>{

list += b.nama + " - " + b.jual + "\n"

})

alert(list)

})

function loadChart(){

let data = {}

laporan.forEach(l=>{

if(!data[l.tanggal]){

data[l.tanggal]=0

}

data[l.tanggal]+= l.jual*l.qty

})

let labels = Object.keys(data)
let values = Object.values(data)

new Chart(document.getElementById("chartSales"),{

type:"line",

data:{
labels:labels,
datasets:[{

label:"Penjualan",
data:values

}]
}

})

}

loadChart()

function exportInventory(){

let csv = "Nama,Kategori,Satuan,Modal,Jual,Stok\n"

inventory.forEach(b=>{

csv += `${b.nama},${b.kategori},${b.satuan},${b.modal},${b.jual},${b.stok}\n`

})

downloadCSV(csv,"inventory.csv")

}

function exportLaporan(){

let csv="Tanggal,Jam,Barcode,Nama,Qty,Jual\n"

laporan.forEach(l=>{

csv+=`${l.tanggal},${l.jam},${l.barcode},${l.nama},${l.qty},${l.jual}\n`

})

downloadCSV(csv,"laporan.csv")

}

function downloadCSV(data,file){

let blob = new Blob([data])

let url = window.URL.createObjectURL(blob)

let a = document.createElement("a")

a.href=url
a.download=file
a.click()

}

// ==========================
// AUTO SCAN BARCODE
// ==========================

let autoScanner

function startAutoScan(){

if(autoScanner){

autoScanner.stop()

}

autoScanner = new Html5Qrcode("reader")

autoScanner.start(
{ facingMode:"environment" },
{
fps:15,
qrbox:250
},
barcode=>{

kasir_barcode.value = barcode

autoIsiBarang(barcode)

function cariBarang(barcode){

return inventory.find(b => 
b.barcodes && b.barcodes.includes(barcode)
)

}

addCart()

}
)

}

function editBarang(i){

let b = inventory[i]

inv_barcode1.value = b.barcode1
inv_barcode2.value = b.barcode2
inv_barcode3.value = b.barcode3

inv_nama.value = b.nama
inv_kategori.value = b.kategori
inv_satuan.value = b.satuan

inv_modal.value = b.modal
inv_jual.value = b.jual

inv_stok.value = b.stok
inv_minstok.value = b.minstok

inventory.splice(i,1)

}

function loadTopBarang(){

let data = {}

laporan.forEach(l=>{

if(!data[l.nama]){

data[l.nama]=0

}

data[l.nama]+=l.qty

})

let ranking = Object.entries(data)
.sort((a,b)=>b[1]-a[1])
.slice(0,5)

let html=""

ranking.forEach(r=>{

html+= r[0]+" : "+r[1]+" terjual<br>"

})

topBarang.innerHTML=html

}

loadTopBarang()

function loadProfit(){

let today = new Date().toLocaleDateString()

let modal=0
let jual=0

laporan.forEach(l=>{

if(l.tanggal==today){

modal += l.modal*l.qty
jual += l.jual*l.qty

}

})

salesToday.innerText = jual

profitToday.innerText = jual-modal

profitPercent.innerText =
Math.round(((jual-modal)/jual)*100)+"%"

}

loadProfit()

// ==========================
// AUTO BACKUP
// ==========================

setInterval(()=>{

let backup={

inventory:inventory,
laporan:laporan,
hutang:hutang

}

localStorage.setItem("backup",JSON.stringify(backup))

},60000)

function prediksiRestok(){

let rekomendasi=""

inventory.forEach(b=>{

if(b.stok <= b.minstok){

rekomendasi +=
"Segera restok : "+b.nama+"<br>"

}

})

alertStock.innerHTML = rekomendasi

}

prediksiRestok()

function exportHutang(){

let csv="Nama,Total,Sisa\n"

hutang.forEach(h=>{
csv+=`${h.nama},${h.total},${h.sisa}\n`
})

downloadCSV(csv,"hutang.csv")

}

function showBarcode(i){

let c = cart[i]

let list=""

c.barcodes.forEach(b=>{

list += b+"\n"

})

let newBarcode = prompt(
"List Barcode Produk :\n\n"+list+"\nTambah barcode baru:"
)

if(newBarcode){

c.barcodes.push(newBarcode)

let barang = inventory.find(b=>b.nama==c.nama)

barang.barcodes.push(newBarcode)

localStorage.setItem("inventory",JSON.stringify(inventory))

}

}
