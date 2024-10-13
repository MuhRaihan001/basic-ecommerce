import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import '../style/home.css';

function Home() {
    const [data, setData] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [products, setProducts] = useState([]);
    const [totalSold, setTotalSold] = useState("");
    const [totalStock, setTotalStock] = useState("");
    const [quantity, setQuantity] = useState(1);

    const navigate = useNavigate();
    const rawData = localStorage.getItem("user");

    const formatter = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        currencyDisplay: 'symbol',
    });

    useEffect(() => {
        if (rawData) {
            setData(JSON.parse(rawData));
        }
    }, [rawData]);

    const getAllProduct = useCallback(async () => {
        try {
            const response = await fetch('/api/product', {
                method: 'GET',
                headers: {
                    "auth": data.token
                }
            });
            if (response.status === 403) {
                navigate("/login");
            }
            const result = await response.json();
            setProducts(result.list || []);
        } catch (error) {
            console.log(error);
        }
    }, [data, navigate]);

    const getTotalSold = useCallback(async () => {
        try {
            const response = await fetch("/api/product/totalsold", {
                method: "GET",
                headers: {
                    "auth": data.token
                }
            });
            if (response.status === 403) {
                navigate("/login");
            } else {
                const result = await response.json();
                setTotalSold(result.result[0].total_sold);
            }
        } catch (error) {
            console.log(error);
        }
    }, [data, navigate]);

    const getTotalStock = useCallback(async () => {
        try {
            const response = await fetch("/api/product/totalstock", {
                method: "GET",
                headers: {
                    "auth": data.token
                }
            });
            if (response.status === 403) {
                navigate("/login");
            } else {
                const result = await response.json();
                console.log(result);
                setTotalStock(result.result[0].total_stock);
            }
        } catch (error) {
            console.log(error);
        }
    }, [data, navigate]);

    const handleProduct = (product) => {
        setSelectedProduct(product);
    };

    const closeModal = () => {
        setSelectedProduct(null);
    };

    const addOrderList = async (productid) =>{
        try{
            const currentDate = new Date();
            const formattedDate = currentDate.toISOString().split('T')[0];
            const response = await fetch("/api/order/add",{
                method: "POST",
                headers:{
                    "Content-Type": "application/json",
                    "auth": data.token
                },
                body: JSON.stringify({userid: data.account[0].id, productid: productid, date: formattedDate})
            })
            const data = await response.json();
            console.log(data)
            if(data.status != 200){
                alert("Failed to add order");
                await fetch("/user/reffund",{
                    method: "POST",
                    headers:{
                        "Content-Type": "application/json",
                        "auth": data.token
                    },
                    body: JSON.stringify({ id: data.account[0].id, productid: productid }) //Reffund their money
                });
            }
        }catch(error){
            console.log(error);
        }
    }

    const buyProduct = async (amount) =>{
        if (selectedProduct) {
            try{
                const response = await fetch(`/api/product/${selectedProduct.id}/checkout`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "auth": data.token
                    },
                    body: JSON.stringify({userid: data.account[0].id, amount: amount})
                });
                switch(response.status){
                    case 200:{
                        alert("Product bought successfully");
                        addOrderList(selectedProduct.id);
                        getTotalStock();
                        getTotalSold();
                        closeModal();
                        break;
                    }
                    case 402:{
                        alert("Insufficient balance");
                        break;
                    }
                    case 409:{
                        alert("Product not available");
                        break;
                    }
                    case 404:{
                        alert("Product not found");
                        break;
                    }
                    default:{
                        alert("Error");
                    }
                }
            }catch(error){
                console.log(error);
            }
        }
    }

    useEffect(() => {
        if (data) {
            getAllProduct();
            getTotalSold();
            getTotalStock();
        }
    }, [data, getAllProduct, getTotalSold, getTotalStock]);

    return (
        <div className="home-container">
            <header>
                <div className="container">
                    <nav>
                        <ul>
                            <li><span>Product Sold: {totalSold}</span></li>
                        </ul>
                        <span>TsumuX Store</span>
                        <span id="sold">Total Stock: {totalStock}</span>
                    </nav>
                </div>
            </header>
            <main className="container">
                <div className="products-list product-grid">
                    {products.length > 0 ? (
                        products.map((i) => (
                            <div key={i.id} className="product" onClick={() => handleProduct(i)}>
                                <img crossOrigin='anonymous' src={`/uploads/${i.image}`} alt={`${i.name}`} loading="lazy" />
                                <h3>{i.name}</h3>
                                <p>{i.description}</p>
                                <p className="price">{formatter.format(i.price)}</p>
                            </div>
                        ))
                    ) : (
                        <p>No products available</p>
                    )}
                </div>
                {selectedProduct && (
                    <div className="modal">
                        <div className="modal-content">
                            <button className="close" onClick={closeModal}>&times;</button>
                            <h2>{selectedProduct.name}</h2>
                            <p>{selectedProduct.description}</p>
                            <p>Stock: {selectedProduct.stock}</p>
                            <p>Sold: {selectedProduct.sold}</p>
                            <p className="price">{formatter.format(selectedProduct.price)}</p>
                            <label htmlFor="quantity">Quantity:</label>
                            <input 
                                type="number" 
                                id="quantity" 
                                value={quantity} 
                                min="1" 
                                max={selectedProduct.stock} 
                                onChange={(e) => setQuantity(Math.max(1, Math.min(selectedProduct.stock, e.target.value)))} 
                            />
                            <button onClick={() => buyProduct(quantity)}>Check out</button>
                        </div>
                    </div>
                )}

            </main>
        </div>
    );
}

export default Home;