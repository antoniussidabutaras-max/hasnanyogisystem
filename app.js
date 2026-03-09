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

let jumlahBarcode = b.barcodes ? b.barcodes.length : 0

html+=`

<tr>

<td onclick="detailBarang(${i})" style="cursor:pointer;color:blue">
${b.nama}
</td>

<td>${b.kategori}</td>

<td>${b.satuan}</td>

<td>
<button onclick="lihatBarcode(${i})">
${jumlahBarcode} barcode
</button>
</td>

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
let total=0

cart.forEach((c,i)=>{

let sub=c.qty*c.jual
total+=sub

html+=`

<tr>

<td>
<span style="cursor:pointer;color:blue"
onclick="showBarcode(${i})">
${c.nama}
</span>
</td>

<td>${c.jual}</td>

<td>

<button onclick="minusQty(${i})">-</button>

${c.qty}

<button onclick="plusQty(${i})">+</button>

</td>

<td>${sub}</td>

<td>

<button onclick="hapusCart(${i})">X</button>

</td>

</tr>

`

})

cartTable.innerHTML=html
cartTotal.innerText=total

}

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
renderDashboard()
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

let existing = cart.find(c=>c.nama==barang.nama)

if(existing){

existing.qty++

}else{

cart.push({

nama:barang.nama,
jual:barang.jual,
modal:barang.modal,
qty:1

})

}

renderCart()

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

function lihatBarcode(i){

let b = inventory[i]

let list=""

b.barcodes.forEach(bar=>{
list += bar+"\n"
})

let newBarcode = prompt(
"List Barcode Produk :\n\n"+list+"\nTambah barcode baru:"
)

if(newBarcode){

b.barcodes.push(newBarcode)

localStorage.setItem("inventory",JSON.stringify(inventory))

renderInventory()

}

}

function detailBarang(i){

let b = inventory[i]

let text=""

text += "Nama : "+b.nama+"\n"
text += "Kategori : "+b.kategori+"\n"
text += "Satuan : "+b.satuan+"\n"
text += "Modal : "+b.modal+"\n"
text += "Jual : "+b.jual+"\n"
text += "Stok : "+b.stok+"\n\n"

text += "BARCODE\n"

b.barcodes.forEach(bar=>{
text += bar+"\n"
})

alert(text)

}

searchInventory?.addEventListener("input",()=>{

let key = searchInventory.value.toLowerCase()

let html=""

inventory
.filter(b=>b.nama.toLowerCase().includes(key))
.forEach((b,i)=>{

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

})

function renderDashboard(){

let sales=0
let profit=0
let items=0

let today=new Date().toLocaleDateString()

transaksi.forEach(t=>{

if(t.tanggal==today){

sales+=t.total

t.items.forEach(i=>{

items+=i.qty
profit+= (i.jual - i.modal) * i.qty

})

}

})

salesToday.innerText=sales
profitToday.innerText=profit
itemSold.innerText=items
totalTransaksi.innerText=transaksi.length

renderTopBarang()
renderAlertStock()

}

function renderTopBarang(){

let count={}

transaksi.forEach(t=>{

t.items.forEach(i=>{

count[i.nama]=(count[i.nama]||0)+i.qty

})

})

let sorted=Object.entries(count)
.sort((a,b)=>b[1]-a[1])
.slice(0,5)

let html=""

sorted.forEach(b=>{

html+=`<div>${b[0]} - ${b[1]} pcs</div>`

})

topBarang.innerHTML=html

}

function renderAlertStock(){

let html=""

inventory
.filter(b=>b.stok<=b.minstok)
.forEach(b=>{

html+=`<div style="color:red">${b.nama} stok ${b.stok}</div>`

})

alertStock.innerHTML=html || "Stok Aman"

}

setInterval(()=>{

let now=new Date()

timeNow.innerText=now.toLocaleString()

},1000)

function selesaiTransaksi(){

transaksi.push(data)

renderCart()
renderInventory()
renderDashboard()

}

function plusQty(i){

cart[i].qty++

renderCart()

}

function minusQty(i){

cart[i].qty--

if(cart[i].qty<=0){

cart.splice(i,1)

}

renderCart()

}

function showBarcode(i){

let nama=cart[i].nama

let barang=inventory.find(b=>b.nama==nama)

let list=barang.barcodes.join("\n")

let tambah=prompt(

"List barcode:\n\n"+list+"\n\nTambah barcode baru?"

)

if(tambah){

barang.barcodes.push(tambah)

saveInventory()

}

}
