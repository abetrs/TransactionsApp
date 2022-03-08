let table = document.querySelector("#report");
let prodList = [];
let revenue = [];
let quantity = [];
let dateInput = document.querySelector("#date-input");
let generatedHTML = "";
let defaultDate = "1970-01-01";


function createTable(date) {
    fetch('http://localhost:8000/date-report/' + date).then(async function (res) {
        let resp = await res.json();
        table.innerHTML = 
        `<tr>
            <th>Product</th>
            <th>Revenue</th>
            <th>Quantity</th>
        </tr>`
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

            // console.log(data[i].tranDateTime)
            if (currentProducts.includes(productName)) {
                currentProductsCount[currentProducts.indexOf(productName)]++
            } else {
                currentProducts.push(productName);
                currentProductsCount.push(1);
            }
            // console.log(product);
            tranRevenue[currentProducts.indexOf(productName)] = data[i].tranQuantity * data[i].tranPrice

            // console.log(tableAdd);
        }
        if (resp.data.length > 0) {
            for (var product in currentProducts) {
                tableAdd +=
                `
                    <td>${currentProducts[product]}</td>
                    <td>${tranRevenue[product]}</td>
                    <td>${currentProductsCount[product]}</td>
                </tr>`
            }
        } else {
            tableAdd += `<tr><td>No sales found</td></tr>`
        }
        table.innerHTML = table.innerHTML + tableAdd;
    });
}

createTable(defaultDate);

function updateDate() {
    let inputDate = dateInput.value;
    createTable(inputDate);
}