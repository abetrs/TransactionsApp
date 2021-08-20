let table = document.querySelector("#purchases");
let addFormVisible = false;
let editFormVisible = false;
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
            <td><button onclick="tranIdDelete(${data[i].id})">del</button></td>
            <td>${data[i].id}</td>
            <td>${product}</td>
            <td>${data[i].tranQuantity}</td>
            <td>${client}</td>
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
    } if (editFormVisible) {
        document.querySelector('.visible').className = 'invisible';
        editFormVisible = false;
    }
    console.log('Adding purchase');
    document.querySelector('#add-purchase').className = 'visible';
    addFormVisible = true;

}

function editPurchaseRequest() {
    if (editFormVisible) {
        return;
    } if (addFormVisible) {
        document.querySelector('.visible').className = 'invisible';
        addFormVisible = false;
    }
    console.log('Editing purchase');
    document.querySelector('#edit-purchase').className = 'visible';
    editFormVisible = true;
}

function handleSubmitAdd(event) {
    event.preventDefault();
    let prodName = new FormData(event.target).get("tranProd")
    let prodIndex = prodListMatcherName.indexOf(prodName);

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
            tranProd: prodId,
            tranQuantity: value.tranQuantity,
            tranClientId: cliId,
            tranDateTime: value.tranDateTime
        })
    }).then(async function (res) {
        console.log(await res.json());
    }).catch((err) => {
        console.log(err);
    })
  

    console.log({ value });
    location.reload();
}
const addForm = document.querySelector('#add-purchase');
addForm.addEventListener('submit', handleSubmitAdd);


function handleSubmitEdit(event) {
    event.preventDefault();
    let prodName = new FormData(event.target).getAll("tranProd")[1];
    let prodIndex = prodListMatcherName.indexOf(prodName);

    let cliName = new FormData(event.target).getAll("tranClientId")[1];
    let cliIndex = clientListMatcherName.indexOf(cliName);
    // console.log(prodIndex);
    // console.log(cliIndex)
    let prodId = prodListMatcherId[prodIndex];
    let cliId = clientListMatcherId[cliIndex];
    const data = new FormData(event.target);
    const value = Object.fromEntries(data.entries());

    fetch('http://localhost:8000/api/transactions/'+ value.id, {
        method: 'PATCH',
        headers: {
            'Accept': 'application/json, text/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            tranProd: prodId,
            tranQuantity: value.tranQuantity,
            tranClientId: cliId,
            tranDateTime: value.tranDateTime   
        })
    }).then(async function (res) {
        console.log(await res.json());
    }).catch((err) => {
        console.log(err);
    })
  

    console.log({ value });
}
const editForm = document.querySelector('#edit-purchase');
editForm.addEventListener('submit', handleSubmitEdit);