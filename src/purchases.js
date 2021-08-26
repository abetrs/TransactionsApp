let table = document.querySelector("#purchases");
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
fetch('http://localhost:8000/api/clients').then(async function (res) {
    let resp = await res.json();
    console.log(resp);
    var options = "";
    let data = resp.data;
    for (var i in resp.data) {
        // console.log(i);
        // console.log("doing");
        clientListMatcherName.push(data[i].cliLastName + ", " + data[i].cliFirstName);
        console.log(clientListMatcherName);
        clientListMatcherId.push(data[i].id);
        console.log(clientListMatcherId);
        options +=
            `<option value="${data[i].cliLastName}, ${data[i].cliFirstName}" id='${data[i].id}'>`
        // console.log(options);
        // console.log(tableAdd);
    }
    addClientList.innerHTML += options;
});


// console.log(addProdList);
// console.log(addClientList);

// GET All Clients
fetch('http://localhost:8000/api/transactions').then(async function (res) {
    let resp = await res.json();
    console.log(resp);
    var tableAdd = "";
    let data = resp.data;

    for (var i in resp.data) {
        // console.log(i);
        // console.log("doing");

        let product = '';
        let client = ''
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open("GET", 'http://localhost:8000/api/products/' + data[i].tranProd, false); // false for synchronous request
        xmlHttp.send(null);
        product = JSON.parse(xmlHttp.responseText).data.prodName;

        xmlHttp.open("GET", 'http://localhost:8000/api/clients/' + data[i].tranClientId, false); // false for synchronous request
        xmlHttp.send(null);
        client = JSON.parse(xmlHttp.responseText).data.cliLastName + ', ' + JSON.parse(xmlHttp.responseText).data.cliFirstName;
        // console.log(client);

        // console.log(product);
        tableAdd +=
        `<tr id="${data[i].id}" onclick="tranIdClick(${data[i].id})">
            <td class="delete-purchase-h"><button onclick="tranIdDelete(${data[i].id})">del</button></td>
            <td>${data[i].id}</td>
            <td>${product}</td>
            <td>${data[i].tranQuantity}</td>
            <td>${client}</td>
            <td>${data[i].tranPrice}</td>
            <td>${data[i].tranDateTime}</td>
        </tr>`
        // console.log(tableAdd);
    }

    table.innerHTML = table.innerHTML + tableAdd;
});

function tranIdClick(tranId) {
    console.log(tranId)
}

function tranIdDelete(tranId) {
    console.log(tranId);
    
    fetch('http://localhost:8000/api/transactions/' + tranId, {
        method: 'DELETE',
    }).then(async function (res) {
        console.log(await res.json());
    });
    location.reload();

}

function addPurchaseRequest() {
    if (addFormVisible) {
        return;
    }
    console.log('Adding purchase');
    document.querySelector('#add-purchase').className = 'visible';
    addFormVisible = true;

}

function handleSubmitAdd(event) {
    event.preventDefault();
    let prodName = new FormData(event.target).get("tranProd")
    let prodIndex = prodListMatcherName.indexOf(prodName);
    let moneyOwed = 0;
    let tranPrice; 

    let cliData;
    let cliName = new FormData(event.target).get("tranClientId");
    let cliIndex = clientListMatcherName.indexOf(cliName);
    // console.log(prodIndex);
    // console.log(cliIndex)
    let prodId = prodListMatcherId[prodIndex];
    let cliId = clientListMatcherId[cliIndex];
    const data = new FormData(event.target);
    const value = Object.fromEntries(data.entries());

    fetch('http://localhost:8000/api/transactions', {
        method: 'POST',
        headers: {
            'Accept': 'application/json, text/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            tranProd: prodId.toString(),
            tranQuantity: value.tranQuantity,
            tranClientId: cliId.toString(),
            tranPrice: value.tranPrice,
            tranDateTime: value.tranDateTime
        })
    }).then(async function (res) {
        console.log(await res.json());
        console.log(cliId);
        tranPrice = parseFloat(value.tranPrice);
        console.log(tranPrice);
    }).catch((err) => {
        console.log(err);
    });
    console.log(cliId);
    fetch('http://localhost:8000/api/clients/' + cliId, { method: 'GET' }).then(async function (res) {
        let resp = await res.json();
        console.log(resp.data);
        cliData = resp.data;
        console.log(cliData);

        moneyOwed = parseFloat(cliData.cliMoneyOwed) + tranPrice
        console.log(moneyOwed);
        fetch('http://localhost:8000/api/clients/' + cliId, {
            method: 'PATCH',
            headers: {
                'Accept': 'application/json, text/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                cliFirstName: cliData.cliFirstName,
                cliLastName: cliData.cliLastName,
                cliPhone: cliData.cliPhone,
                cliEmail: cliData.cliEmail,
                cliAddressStreet: cliData.cliAddressStreet,
                cliAddressPCode: cliData.cliAddressPCode,
                cliAddressCity: cliData.cliAddressCity,
                cliQuotaUsed: cliData.cliQuotaUsed,
                cliQuota: cliData.cliQuota,
                cliMoneyOwed: moneyOwed.toString()
            })
        }).then((res) => console.log(res.json())).catch((err) => console.log(err.message));
    // */
    }).catch((err) => console.log(err.message))
    
    console.log({ value });
    // location.reload();

}
const addForm = document.querySelector('#add-purchase');
addForm.addEventListener('submit', handleSubmitAdd);





let deletePurchaseInp = document.getElementById('delete-button-pwd');
let deletePurchaseB = document.getElementById("submit-button-pwd")
console.log(deletePurchaseInp);
console.log(deletePurchaseB);

function onPwdSubmit() {
    // console.log(deletePurchaseInp.value);
    //if (deletePurchaseInp.value == "password") {
        let deleteButtons = document.querySelectorAll(".delete-purchase-h");
        for (let d in deleteButtons) {
            deleteButtons[d].className = "";
            // console.log(deleteButtons[d]);
        }
    //} else {
        // alert("Wrong password");
    //}
}