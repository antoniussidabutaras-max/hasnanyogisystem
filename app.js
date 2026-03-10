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

document.querySelectorAll(".section")
.forEach(s=>s.style.display="none")

document.getElementById(id).style.display="block"

}

showPage("dashboard")

// ==========================
// CLOCK
// ==========================

setInterval(()=>{

let now = new Date()

timeNow.innerText =
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

function renderInventory(){

let html=""

inventory.forEach((b,i)=>{

let jumlahBarcode = b.barcodes.length

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

function cariBarang(barcode){

return inventory.find(b =>
b.barcodes && b.barcodes.includes(barcode)
)

}

function addCart(){

let barcode = kasir_barcode.value

if(!barcode) return

let barang = cariBarang(barcode)

if(!barang){

alert("Barang tidak ditemukan")
kasir_barcode.value=""
return

}

let qty = Number(kasir_qty.value) || 1

let existing = cart.find(c=>c.barcode==barcode)

if(existing){

existing.qty += qty

}else{

cart.push({

barcode:barcode,
nama:barang.nama,
satuan:barang.satuan,

modal:barang.modal,
jual:barang.jual,

qty:qty,
barcodes:barang.barcodes

})

}

if(barang.stok<=0){

alert("⚠️ Stok barang habis")

}

infoBarang.innerHTML =

"<b>"+barang.nama+"</b><br>"+
"Harga : "+barang.jual+"<br>"+
"Stok : "+barang.stok

kasir_barcode.value=""

renderCart()

}

function renderCart(){

let html=""
let total=0

let last = cart.length-1

cart.forEach((c,i)=>{

let sub=c.qty*c.jual

total+=sub

html+=`

<tr style="${i==last?'background:#e8f5e9':''}">

<td onclick="showBarcode(${i})" style="cursor:pointer;color:blue">

${c.nama}

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

let barang = inventory.find(b =>
b.barcodes.includes(c.barcode)
)

if(barang){

barang.stok -= c.qty

}

})

localStorage.setItem("laporan",JSON.stringify(laporan))
localStorage.setItem("inventory",JSON.stringify(inventory))

renderInventory()
renderLaporan()
renderDashboard()

resetCart()

}

function renderDashboard(){

let sales=0
let profit=0
let items=0

let today=new Date().toLocaleDateString()

laporan.forEach(l=>{

if(l.tanggal==today){

sales += l.jual*l.qty
profit += (l.jual-l.modal)*l.qty
items += l.qty

}

})

salesToday.innerText=sales
profitToday.innerText=profit
itemSold.innerText=items
totalTransaksi.innerText=laporan.length

}

let scanner

function scanKasir(){

if(scanner){

scanner.stop()

}

scanner = new Html5Qrcode("reader")

scanner.start(
{ facingMode:"environment" },
{
fps:10,
qrbox:250
},
barcode => {

kasir_barcode.value = barcode

addCart()

}
)

}

setInterval(()=>{

let backup={

inventory:inventory,
laporan:laporan,
hutang:hutang

}

localStorage.setItem("backup",JSON.stringify(backup))

},60000)

document.addEventListener("keydown",e=>{

if(e.key=="F2"){
addCart()
}

if(e.key=="F4"){
bayar()
}

})

