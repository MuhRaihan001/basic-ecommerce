const data = localStorage.getItem("user");
if(!data){
    window.location.href = "../index.html";
}
const user = JSON.parse(data);

const container = document.querySelector(".product-grid");
const productDetail = document.querySelector(".product-detail");

const stock = document.querySelector("#stock")
const sold = document.querySelector("#sold");

const formatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    currencyDisplay: 'symbol',
});

async function showAllProduct() {
    const totalStock = await getTotalStock();
    const totalSold = await getTotalSold();
     
    stock.innerText = `Stock ${totalStock[0].total_stock} item`;
    sold.innerText = `Sold ${totalSold[0].total_sold} item`
    const response = await fetch("/api/product/",{
        method: "GET",
        headers: {
            "auth": user.token
        }
    });
    if(response.status === 403){
        alert("Anda tidak memiliki akses untuk mengakses halaman ini");
        window.location.href = "../index.html";
    }
    const data = await response.json();
    data.list.forEach((i) => {
        const div = document.createElement("div");
        div.classList.add("product");
        div.innerHTML = `
            <img src="/uploads/${i.image}" alt="${i.name} picture" loading="lazy">
            <h3>${i.name}</h3>
            <p>${i.description}</p>
            <p class="price">${formatter.format(i.price)}</p>
        `;
        div.addEventListener("click", () => {
            showProductDetail(i);
        });
        container.appendChild(div);
    });
}

async function showProductDetail(product){
    let reviews = "";
    productDetail.innerHTML = '';
    const div = document.createElement("div");

    div.classList.add("detail");
    div.innerHTML = `
        <button class="close-detail">x</button>
        <img src="/uploads/${product.image}" alt="${product.name} picture" loading="lazy">
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <p>stock ${product.stock}</p>
        <p>sold ${product.sold}</p>
        <p class="price">${formatter.format(product.price)}</p>

        <div class="review">
            ${reviews}
            <button id="buy">check out</button>
        </div>
    `;
    productDetail.appendChild(div)
    productDetail.classList.add("active");
    document.body.classList.add("blur");

    const closeDetail = document.querySelector(".close-detail");
    closeDetail.addEventListener("click", () => {
        productDetail.classList.remove("active");
        document.body.classList.remove("blur");
    })

    const buy = document.querySelector("#buy");
    buy.addEventListener("click", () => {
        const amountInput = document.createElement("input");
        amountInput.type = "number";
        amountInput.min = 1;
        amountInput.max = product.stock;
        amountInput.value = 1;
      
        const amountLabel = document.createElement("label");
        amountLabel.textContent = "Jumlah: ";
      
        const amountContainer = document.createElement("div");
        amountContainer.appendChild(amountLabel);
        amountContainer.appendChild(amountInput);
      
        const confirmButton = document.createElement("button");
        confirmButton.textContent = "Konfirmasi";
        confirmButton.addEventListener("click", () => {
          const amount = parseInt(amountInput.value);
          butProduct(product.id, user.account[0].id, amount);
        });
      
        const cancelButton = document.createElement("button");
        cancelButton.textContent = "Batal";
        cancelButton.addEventListener("click", () => {
          productDetail.innerHTML = '';
          productDetail.classList.remove("active");
          document.body.classList.remove("blur");
        });
      
        const buttonsContainer = document.createElement("div");
        buttonsContainer.appendChild(confirmButton);
        buttonsContainer.appendChild(cancelButton);
      
        const amountDialog = document.createElement("div");
        amountDialog.classList.add("amount-dialog");
        amountDialog.appendChild(amountContainer);
        amountDialog.appendChild(buttonsContainer);
      
        productDetail.innerHTML = '';
        productDetail.appendChild(amountDialog);
        productDetail.classList.add("active");
        document.body.classList.add("blur");
    });
}

async function getTotalSold(){
    const response = await fetch("/api/product/totalsold",{
        method: "GET",
        headers: {
            "auth": user.token
        }
    });
    const data = await response.json();
    return data.result;
}

async function getTotalStock(){
    const response = await fetch("/api/product/totalstock",{
        method: "GET",
        headers: {
            "auth": user.token
        }
    });
    const data = await response.json();
    return data.result;
}


async function butProduct(id, userid, amount){
    const response = await fetch(`/api/product/${id}/checkout`,{
        method: "POST",
        headers:{
            "auth": user.token,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({userid: userid, amount: amount})
    });
    const data = await response.json();
    switch(data.status){
        case 200:{
            alert("Success");
            addOrderList(id);
            window.location.reload();
            break;
        }
        case 402:{
            alert("Insufficient fund");
            break;
        }
        case 409:{
            alert("Product is out of stock");
            break;
        }
        case 404:{
            alert("Product not found");
            break;
        }
        case 500:{
            alert("Internal server error");
            break;
        }
    }
}

async function addOrderList(productid){
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split('T')[0];
    const response = await fetch(`/api/order/add`,{
        method: "POST",
        headers:{
            "auth": user.token,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            userid: user.account[0].id,
            productid: productid,
            date: formattedDate
        })
    });
    const data = await response.json();
    console.log(data)
    if(data.status != 200){
        alert("Failed to add order");
    }
}

showAllProduct();