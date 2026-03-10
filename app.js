// ==========================
// DATABASE
// ==========================

let inventory = JSON.parse(localStorage.getItem("inventory")) || []
let laporan = JSON.parse(localStorage.getItem("laporan")) || []
let hutang = JSON.parse(localStorage.getItem("hutang")) || []
let sales = JSON.parse(localStorage.getItem("sales")) || []

let cart=[]


// ==========================
// NAVIGATION
// ==========================

function showPage(id){

document.querySelectorAll(".section")
.forEach(s=>s.style.display="none")

document.getElementById(id).style.display="block"

}


// ==========================
// CLOCK
// ==========================

setInterval(()=>{

let now=new Date()

timeNow.innerText=
now.toLocaleDateString()+" "+now.toLocaleTimeString()

},1000)


// ==========================
// INVENTORY
// ==========================

function saveBarang(){

let barcodes=[]

if(inv_barcode1.value) barcodes.push(inv_barcode1.value)
if(inv_barcode2.value) barcodes.push(inv_barcode2.value)
if(inv_barcode3.value) barcodes.push(inv_barcode3.value)

let barang={

id:Date.now(),

nama:inv_nama.value,
kategori:inv_kategori.value||"Umum",
satuan:inv_satuan.value||"pcs",

modal:Number(inv_modal.value)||0,
jual:Number(inv_jual.value)||0,

stok:Number(inv_stok.value)||0,
minstok:Number(inv_minstok.value)||0,

barcodes:barcodes

}

inventory.push(barang)

localStorage.setItem("inventory",JSON.stringify(inventory))

renderInventory()
renderDashboard()

resetInventoryForm()

}


// ==========================
// EDIT BARANG
// ==========================

function editBarang(i){

let b=inventory[i]

let nama=prompt("Nama barang",b.nama)
let harga=prompt("Harga jual",b.jual)

if(!nama) return

b.nama=nama
b.jual=Number(harga)

localStorage.setItem("inventory",JSON.stringify(inventory))

renderInventory()

}


// ==========================
// DELETE BARANG
// ==========================

function hapusBarang(i){

if(confirm("Hapus barang?")){

inventory.splice(i,1)

localStorage.setItem("inventory",JSON.stringify(inventory))

renderInventory()
renderDashboard()

}

}


// ==========================
// RENDER INVENTORY
// ==========================

function renderInventory(){

let html=""

inventory.forEach((b,i)=>{

let barcode=(b.barcodes||[]).join(",")

html+=`

<tr>

<td>${b.nama}</td>
<td>${b.kategori}</td>
<td>${b.satuan}</td>
<td>${barcode}</td>

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


// ==========================
// SEARCH PRODUCT
// ==========================

function cariBarang(keyword){

keyword=keyword.toLowerCase().trim()

return inventory.find(b=>

(b.barcodes||[]).some(code=>
String(code).toLowerCase()===keyword)

||

b.nama.toLowerCase().includes(keyword)

)

}


// ==========================
// ADD CART
// ==========================

function addCart(){

let keyword=kasir_barcode.value.trim()

if(!keyword) return

let barang=cariBarang(keyword)

if(!barang){

alert("Barang tidak ditemukan")
kasir_barcode.value=""
return

}

let qty=Number(kasir_qty.value)||1

if(barang.stok<qty){

alert("Stok tidak cukup")
return

}

let existing=cart.find(c=>c.id===barang.id)

if(existing){

existing.qty+=qty

}else{

cart.push({

id:barang.id,
nama:barang.nama,

modal:barang.modal,
jual:barang.jual,

qty:qty

})

}

infoBarang.innerHTML=

"<b>"+barang.nama+"</b><br>"+
"Harga : "+barang.jual+"<br>"+
"Stok : "+barang.stok

kasir_barcode.value=""
kasir_qty.value=1

renderCart()

}


// ==========================
// CART
// ==========================

function renderCart(){

let html=""
let total=0

cart.forEach((c,i)=>{

let sub=c.qty*c.jual

total+=sub

html+=`

<tr>

<td>${c.nama}</td>

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


// ==========================
// CART CONTROL
// ==========================

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

function hapusCart(i){

cart.splice(i,1)

renderCart()

}


// ==========================
// PAYMENT
// ==========================

function bayar(){

if(cart.length==0){

alert("Cart kosong")
return

}

let now=new Date()

let total=0

cart.forEach(c=>{

let sub=c.qty*c.jual

total+=sub

laporan.push({

tanggal:now.toLocaleDateString(),

nama:c.nama,
qty:c.qty,

jual:c.jual,
total:sub

})

let barang=inventory.find(b=>b.id===c.id)

if(barang){

barang.stok-=c.qty

}

})

sales.push({

tanggal:now.toISOString(),

items:cart,

total:total

})

localStorage.setItem("laporan",JSON.stringify(laporan))
localStorage.setItem("inventory",JSON.stringify(inventory))
localStorage.setItem("sales",JSON.stringify(sales))

renderInventory()
renderDashboard()
renderLaporan()

resetCart()

}


// ==========================
// RESET CART
// ==========================

function resetCart(){

cart=[]

renderCart()

}


// ==========================
// DASHBOARD
// ==========================

function renderDashboard(){

totalProduk.innerText=inventory.length

let omzetTotal=sales.reduce((t,s)=>t+s.total,0)

omzet.innerText=omzetTotal

let low=inventory.filter(i=>i.stok<=i.minstok)

stokMenipis.innerText=low.length

renderChart()

}


// ==========================
// SALES CHART
// ==========================

let chart

function renderChart(){

let data={}

sales.forEach(s=>{

let t=new Date(s.tanggal).toLocaleDateString()

if(!data[t]) data[t]=0

data[t]+=s.total

})

let labels=Object.keys(data)
let values=Object.values(data)

if(chart) chart.destroy()

chart=new Chart(salesChart,{

type:"bar",

data:{

labels:labels,

datasets:[{

label:"Penjualan",

data:values

}]

}

})

}


// ==========================
// LAPORAN
// ==========================

function renderLaporan(){

let html=""

sales.forEach(s=>{

html+=`

<tr>

<td>${new Date(s.tanggal).toLocaleDateString()}</td>

<td>${s.total}</td>

<td>${s.items.length}</td>

</tr>

`

})

laporanTable.innerHTML=html

}


// ==========================
// HUTANG
// ==========================

function tambahHutang(){

let nama=hutang_nama.value
let jumlah=Number(hutang_jumlah.value)

if(!nama||!jumlah){

alert("Isi data hutang")
return

}

hutang.push({

tanggal:new Date().toLocaleDateString(),

nama:nama,
jumlah:jumlah,

status:"Belum"

})

localStorage.setItem("hutang",JSON.stringify(hutang))

renderHutang()

hutang_nama.value=""
hutang_jumlah.value=""

}


function renderHutang(){

let html=""

hutang.forEach((h,i)=>{

html+=`

<tr>

<td>${h.tanggal}</td>

<td>${h.nama}</td>

<td>${h.jumlah}</td>

<td>${h.status}</td>

<td>

<button onclick="bayarHutang(${i})">Bayar</button>

</td>

</tr>

`

})

hutangTable.innerHTML=html

}


function bayarHutang(i){

hutang[i].status="Lunas"

localStorage.setItem("hutang",JSON.stringify(hutang))

renderHutang()

}


// ==========================
// EXPORT CSV
// ==========================

function downloadCSV(data,name){

let blob=new Blob([data],{type:"text/csv"})

let url=URL.createObjectURL(blob)

let a=document.createElement("a")

a.href=url
a.download=name

a.click()

}

function exportInventory(){

let csv="Nama,Kategori,Jual,Stok\n"

inventory.forEach(i=>{

csv+=`${i.nama},${i.kategori},${i.jual},${i.stok}\n`

})

downloadCSV(csv,"inventory.csv")

}

function exportLaporan(){

let csv="Tanggal,Nama,Qty,Total\n"

laporan.forEach(l=>{

csv+=`${l.tanggal},${l.nama},${l.qty},${l.total}\n`

})

downloadCSV(csv,"laporan.csv")

}


// ==========================
// LOW STOCK WARNING
// ==========================

function checkMinStock(){

inventory.forEach(i=>{

if(i.stok<=i.minstok){

console.warn("Stok menipis:",i.nama)

}

})

}


// ==========================
// KEMBALIAN
// ==========================

function hitungKembalian(){

let bayar=Number(uangBayar.value)||0
let total=Number(cartTotal.innerText)||0

let kembali=bayar-total

kembalian.innerText=kembali>0?kembali:0

}


// ==========================
// AUTO FOCUS
// ==========================

setInterval(()=>{

kasir_barcode?.focus()

},2000)


// ==========================
// AUTO BACKUP
// ==========================

setInterval(()=>{

let backup={inventory,laporan,hutang,sales}

localStorage.setItem("backup",JSON.stringify(backup))

},60000)


// ==========================
// INIT
// ==========================

renderInventory()
renderDashboard()
renderLaporan()
renderHutang()
showPage("dashboard")
