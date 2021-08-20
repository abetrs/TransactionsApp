let table = document.querySelector("#purchases");

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
        console.log(client);

        // console.log(product);
        tableAdd +=
        `<tr id="${data[i].id}" onclick="tranIdClick(${data[i].id})">
            <td><button onclick="purchaseIdDelete(${data[i].id})">del</button></td>
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

function stockIdClick(stockId) {
    console.log(stockId)
}

function stockIdDelete(stockId) {
    console.log(stockId);
    fetch('http://localhost:8000/api/products/' + stockId, {
        method: 'DELETE',
    }).then(async function (res) {
        console.log(await res.json());
        location.reload();
    });
}

