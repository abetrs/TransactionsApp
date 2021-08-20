let table = document.querySelector("#clients");
let addFormVisible = false;
let editFormVisible = false;

// GET All Clients
fetch('http://localhost:8000/api/clients').then(async function (res) {
    let resp = await res.json();
    console.log(resp);
    var tableAdd = "";
    let data = resp.data;
    for (var i in resp.data) {
        // console.log(i);
        // console.log("doing");
        tableAdd +=
        `<tr id="${data[i].id}" onclick="clientIdClick(${data[i].id})">
            <td><button onclick="clientIdDelete(${data[i].id})">del</button></td>
            <td>${data[i].id}</td>
            <td>${data[i].cliLastName}, ${data[i].cliFirstName}</td>
            <td>${data[i].cliPhone}</td>
            <td>${data[i].cliEmail}</td>
            <td>${data[i].cliAddressStreet}, ${data[i].cliAddressPCode}</td>
            <td>${data[i].cliAddressCity}</td>
            <td>${data[i].cliQuotaLeft}</td>
        </tr>`
        // console.log(tableAdd);
    }
    table.innerHTML = table.innerHTML + tableAdd;
});

function clientIdClick(clientId) {
    console.log(clientId)
}

function clientIdDelete(clientId) {
    console.log(clientId);
    fetch('http://localhost:8000/api/clients/' + clientId, {
        method: 'DELETE',
    }).then(async function (res) {
        console.log(await res.json());
        location.reload();
    });
}

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

function handleSubmitAdd(event) {
    event.preventDefault();
    const data = new FormData(event.target);
    const value = Object.fromEntries(data.entries());

    fetch('http://localhost:8000/api/clients', {
        method: 'POST',
        headers: {
            'Accept': 'application/json, text/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(value)
    }).then(async function (res) {
        console.log(await res.json());
    }).catch((err) => {
        console.log(err);
    })
  

    console.log({ value });
    location.reload();
}
const addForm = document.querySelector('#add-client');
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

function handleSubmitEdit(event) {
    event.preventDefault();
    const data = new FormData(event.target);
    const value = Object.fromEntries(data.entries());

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
            cliQuotaLeft: value.cliQuotaLeft,            
        })
    }).then(async function (res) {
        console.log(await res.json());
    }).catch((err) => {
        console.log(err);
    })
  

    console.log({ value });
    location.reload();
}
const editForm = document.querySelector('#edit-client');
editForm.addEventListener('submit', handleSubmitEdit);