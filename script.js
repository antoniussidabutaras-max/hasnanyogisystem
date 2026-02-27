let cart = [];
let total = 0;

const products = {
    "8991001": {name:"Rokok", cost:20000, price:25000},
    "8992001": {name:"Gula", cost:12000, price:15000}
};

function startScanner(){
    Quagga.init({
        inputStream : {
            name : "Live",
            type : "LiveStream",
            target: document.querySelector('#scanner')
        },
        decoder : {
            readers : ["ean_reader"]
        }
    }, function(err) {
        if (err) { console.log(err); return }
        Quagga.start();
    });

    Quagga.onDetected(function(data){
        let code = data.codeResult.code;
        if(products[code]){
            addToCart(products[code].name, products[code].price, 1);
        } else {
            alert("Barang tidak ditemukan");
        }
        Quagga.stop();
    });
}

function addManual(){
    let name = document.getElementById("manualName").value;
    let price = Number(document.getElementById("manualPrice").value);
    let qty = Number(document.getElementById("manualQty").value);

    addToCart(name, price, qty);
}

function addToCart(name, price, qty){
    let subtotal = price * qty;
    total += subtotal;

    document.getElementById("cart").innerHTML += 
        `<li>${name} x${qty} = ${subtotal}</li>`;

    document.getElementById("total").innerText = total;
}