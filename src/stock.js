let table = document.querySelector("#stock");
let addFormVisible = false;
let editFormVisible = false;


// GET All Stocks
fetch('http://localhost:8000/api/products').then(async function (res) {
    let resp = await res.json();
    console.log(resp);
    var tableAdd = "";
    let data = resp.data;
    for (var i in resp.data) {
        // console.log(i);
        // console.log("doing");
        tableAdd +=
        `<tr id="${data[i].id}" onclick="stockIdClick(${data[i].id})">
            <td><button onclick="stockIdDelete(${data[i].id})">del</button></td>
            <td>${data[i].id}</td>
            <td>${data[i].prodName}</td>
            <td>${data[i].prodType}</td>
            <td>€${data[i].prodPrice}</td>
            <td>${data[i].prodQuantity}</td>
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

function addStockRequest() {
    if (addFormVisible) {
        return;
    } if (editFormVisible) {
        document.querySelector('.visible').className = 'invisible';
        editFormVisible = false;
    }
    console.log('Adding Stock');
    document.querySelector('#add-stock').className = 'visible';
    addFormVisible = true;
}

function editStockRequest() {
    if (editFormVisible) {
        return;
    } if (addFormVisible) {
        document.querySelector('.visible').className = 'invisible';
        addFormVisible = false;
    }
    console.log('Editing Stock');
    document.querySelector('#edit-stock').className = 'visible';
    editFormVisible = true;
}

function handleSubmitAdd(event) {
    event.preventDefault();
    const data = new FormData(event.target);
    const value = Object.fromEntries(data.entries());

    fetch('http://localhost:8000/api/products', {
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
const addForm = document.querySelector('#add-stock');
addForm.addEventListener('submit', handleSubmitAdd);


function handleSubmitEdit(event) {
    event.preventDefault();
    const data = new FormData(event.target);
    const value = Object.fromEntries(data.entries());

    fetch('http://localhost:8000/api/products/'+ value.id, {
        method: 'PATCH',
        headers: {
            'Accept': 'application/json, text/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            prodName: value.prodName,
            prodType: value.prodType,
            prodPrice: value.prodPrice,
            prodQuantity: value.prodQuantity,         
        })
    }).then(async function (res) {
        console.log(await res.json());
    }).catch((err) => {
        console.log(err);
    })
  

    console.log({ value });
}
const editForm = document.querySelector('#edit-stock');
editForm.addEventListener('submit', handleSubmitEdit);