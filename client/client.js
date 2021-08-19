const bootstrap = require(bootstrap);

let table = document.querySelector("#clients");
let purchaseBtn = document.querySelector("#get-purchase");

// GET All Clients
fetch('http://localhost:8000/api/clients').then(async function (res) {
    let resp = await res.json();
    console.log(resp);
    var tableAdd = "";
    let data = resp.data;
    for (var i in resp.data) {
        console.log(i);
        console.log("doing");
        tableAdd +=
        `<tr>
            <td>${data[i].id}</td>
            <td>${data[i].cliLastName}, ${data[i].cliFirstName}</td>
            <td>${data[i].cliPhone}</td>
            <td>${data[i].cliEmail}</td>
            <td>${data[i].cliAddressStreet}, ${data[i].cliAddressPCode}</td>
            <td>${data[i].cliAddressCity}</td>
            <td>${data[i].cliQuotaLeft}</td>
        </tr>`
        console.log(tableAdd);
    }
    table.innerHTML = table.innerHTML + tableAdd;
});