let table = document.querySelector("#clients");
let addFormVisible = false;
let editFormVisible = false;

// GET All Clients
fetch('http://localhost:8000/api/clients').then(async function (res) {
    let resp = await res.json();
    // console.log(resp);
    let exceeded = "not-exceeded";

    var tableAdd = "";
    let data = resp.data;
    for (var i in resp.data) {
        // console.log(i);
        // console.log("doing");
        if (data[i].cliQuotaUsed > data[i].cliQuota) {
            exceeded='exceeded'
        }
        tableAdd +=
        `<tr id="${data[i].id}" class="${exceeded}" onclick="clientIdClick(${data[i].id})">
            <td><button onclick="clientIdDelete(${data[i].id})">del</button></td>
            <td>${data[i].id}</td>
            <td>${data[i].cliLastName}, ${data[i].cliFirstName}</td>
            <td>${data[i].cliPhone}</td>
            <td>${data[i].cliEmail}</td>
            <td>${data[i].cliAddressStreet}, ${data[i].cliAddressPCode}</td>
            <td>${data[i].cliAddressCity}</td>
            <td>${data[i].cliQuotaUsed}</td>
            <td>${data[i].cliQuota}</td>
            <td>${data[i].cliMoneyOwed}</td>
        </tr>`
        // console.log(tableAdd);
    }
    table.innerHTML = table.innerHTML + tableAdd;
});


// function clientIdClick(clientId) {
    // console.log(clientId)
// }

// Deletes a client

function clientIdDelete(clientId) {
    console.log(clientId);
    fetch('http://localhost:8000/api/clients/' + clientId, {
        method: 'DELETE',
    }).then(async function (res) {
        console.log(await res.json());
        location.reload();
    });
}


// Makes the client addition menu visible
function addClientRequest() {
    if (addFormVisible) {
        return;
    } if (editFormVisible) {
        document.querySelector('.visible').className = 'invisible';
        editFormVisible = false;
    }
    console.log('Adding Client');
    document.querySelector('#add-client').className = 'visible';
    addFormVisible = true;
}

// Send request to add a client to the server
function handleSubmitAdd(event) {
    event.preventDefault();
    // Converts form data to JSON
    const data = new FormData(event.target);
    const value = Object.fromEntries(data.entries());
    console.log(value)
    // Fetching from server
    fetch('http://localhost:8000/api/clients', {
        method: 'POST',
        headers: {
            'Accept': 'application/json, text/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            cliFirstName: value.cliFirstName,
            cliLastName: value.cliLastName,
            cliPhone: value.cliPhone,
            cliEmail: value.cliEmail,
            cliAddressStreet: value.cliAddressStreet,
            cliAddressPCode: value.cliAddressPCode,
            cliAddressCity: value.cliAddressCity,
            cliQuotaUsed: value.cliQuotaUsed,
            cliQuota: value.cliQuota,
            cliMoneyOwed: "0"
        })
    }).then(async function (res) {
        console.log(await res.json());
    }).catch((err) => {
        console.log(err);
    })
  

    // location.reload();
}

const addForm = document.querySelector('#add-client'); // Reference to the client addition form's HTML element
addForm.addEventListener('submit', handleSubmitAdd);


function editClientRequest() {
    if (editFormVisible) {
        return;
    } if (addFormVisible) {
        document.querySelector('.visible').className = 'invisible';
        addFormVisible = false;
    }
    console.log('Editing Client');
    document.querySelector('#edit-client').className = 'visible';
    editFormVisible = true;
}

// Makes the edit client menu visible
function handleSubmitEdit(event) {
    event.preventDefault();
    // Converts form data to JSON
    const data = new FormData(event.target);
    const value = Object.fromEntries(data.entries());
    // Sends PATCH request to server
    fetch('http://localhost:8000/api/clients/'+ value.id, {
        method: 'PATCH',
        headers: {
            'Accept': 'application/json, text/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            cliFirstName: value.cliFirstName,
            cliLastName: value.cliLastName,
            cliPhone: value.cliPhone,
            cliEmail: value.cliEmail,
            cliAddressStreet: value.cliAddressStreet,
            cliAddressPCode: value.cliAddressPCode,
            cliAddressCity: value.cliAddressCity,
            cliQuotaUsed: value.cliQuotaUsed,
            cliQuota: value.cliQuota,
            cliMoneyOwed: 0
        })
    }).then(async function (res) {
        console.log(await res.json());
    }).catch((err) => {
        console.log(err);
    })

    console.log({ value });
    location.reload();
}
const editForm = document.querySelector('#edit-client'); // Reference to the html element of the client editing form
editForm.addEventListener('submit', handleSubmitEdit);

function clientIdClick(cliId) {
    let receipt = document.querySelector('#receipt');
    console.log(receipt);
    console.log(cliId);
    let generatedHTML = `
    <tr>
        <th>Date of Sale</th>
        <th>Name of the Item</th>
        <th>Price</th>
    </tr>
    `
    fetch('http://localhost:8000/api/transactions').then(async function (res) {
        let product = '';
        let resp = await res.json();
        console.log(resp);
        var tableAdd = "";
        let data = resp.data;
        let totalPrice = 0;
        
        for (var i in data) {
            var xmlHttp = new XMLHttpRequest();
            xmlHttp.open("GET", 'http://localhost:8000/api/products/' + data[i].tranProd, false); // false for synchronous request
            xmlHttp.send(null);
            product = JSON.parse(xmlHttp.responseText).data.prodName;
            console.log(data[i])
            if (data[i].tranClientId == cliId) {
                totalPrice += parseInt(data[i].tranPrice);
                generatedHTML += `
                <tr>
                <td>${data[i].tranDateTime}</td>
                        <td>${product}</td>
                        <td>${data[i].tranPrice}</td>
                    </tr>
                `
                console.log(generatedHTML);
            }
        }
        receipt.innerHTML = receipt.innerHTML + generatedHTML;
        receipt.innerHTML += "<tr><td>Total Money Owed: " + totalPrice + "</td></tr>";
    });
}