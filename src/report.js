let table = document.querySelector("#sales");
let addFormVisible = false;
let addProdList = document.querySelector("#tranProd");
let addClientList = document.querySelector("#tranClientId")
let prodListMatcherName = [];
let prodListMatcherId = [];
let clientListMatcherName = [];
let clientListMatcherId = [];

fetch('http://localhost:8000/api/products').then(async function (res) {
    let resp = await res.json();
    console.log(resp);
    var options = "";
    let data = resp.data;
    for (var i in resp.data) {
        // console.log(i);
        // console.log("doing");
        prodListMatcherName.push(data[i].prodName);
        console.log(prodListMatcherName);
        prodListMatcherId.push(data[i].id);
        console.log(prodListMatcherId);
        options +=
            `<option value="${data[i].prodName}" id='${data[i].id}'>`
        // console.log(options);
        // console.log(tableAdd);
    }
    addProdList.innerHTML += options;
});


// console.log(addProdList);
// console.log(addClientList);

// GET All Clients
fetch('http://localhost:8000/api/transactions/').then(async function (res) {
    let resp = await res.json();
    console.log(resp);
    var tableAdd = "";
    let data = resp.data;
    let tranRevenue = [];
    let currentProducts = [];
    let productName = '';
    let currentProductsCount = [];
    for (var i in resp.data) {
        // console.log(i);
        // console.log("doing");

        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open("GET", 'http://localhost:8000/api/products/' + data[i].tranProd, false); // false for synchronous request
        xmlHttp.send(null);
        productName = JSON.parse(xmlHttp.responseText).data.prodName;

        console.log(data[i].tranDateTime)

        if (data[i].tranDateTime.includes(new Date().getFullYear())) {
            if (currentProducts.includes(productName)) {
                currentProductsCount[currentProducts.indexOf(productName)]++
            } else {
                currentProducts.push(productName);
                currentProductsCount.push(1);
            }
        }
        // console.log(product);
        tranRevenue[currentProducts.indexOf(productName)] = data[i].tranQuantity * data[i].tranPrice

        // console.log(tableAdd);
    }
    for (var product in currentProducts) {
        tableAdd +=
            `
            <td>${currentProducts[product]}</td>
            <td>${tranRevenue[product]}</td>
            <td>${currentProductsCount[product]}</td>
        </tr>`
    }
    table.innerHTML = table.innerHTML + tableAdd;
});
