let table = document.querySelector("#purchases");
let purchaseBtn = document.querySelector("#add-purchase");

//GET All
purchaseBtn.addEventListener('click', () => {
    alert("Adding purchase");
    fetch('http://localhost:8000/api/customers').then((res) => {
        console.log(res.json);
    });

});
//Creat

//Update
//Delete
