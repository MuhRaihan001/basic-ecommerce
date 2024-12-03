import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "../style/home.css";

const formatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  currencyDisplay: "symbol",
});

function Home() {
  const [data, setData] = useState(null);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [totals, setTotals] = useState({ sold: "", stock: "" });

  const navigate = useNavigate();

  useEffect(() => {
    const rawData = localStorage.getItem("user");
    if (rawData) setData(JSON.parse(rawData));
  }, []);

  const fetchAPI = async (url, options = {}, onSuccess) => {
    if (!data) return;
    try {
      const response = await fetch(url, {
        headers: { auth: data.token, ...options.headers },
        ...options,
      });
      if (response.status === 403) {
        navigate("/login-page");
        return;
      }
      const result = await response.json();
      onSuccess(result);
    } catch (error) {
      console.error("API Error:", error);
    }
  };

  const fetchProducts = useCallback(() => {
    fetchAPI("/api/product", {}, (result) => {
      setProducts(result.list || []);
    });
  }, [data, navigate]);

  const fetchTotals = useCallback(() => {
    fetchAPI("/api/product/totalsold", {}, (result) =>
      setTotals((prev) => ({ ...prev, sold: result.result[0].total_sold }))
    );
    fetchAPI("/api/product/totalstock", {}, (result) =>
      setTotals((prev) => ({ ...prev, stock: result.result[0].total_stock }))
    );
  }, [data, navigate]);

  const handleBuyProduct = async (amount) => {
    if (!selectedProduct) return;
    fetchAPI(
      `/api/product/${selectedProduct.id}/checkout`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userid: data.account[0].id,
          amount,
        }),
      },
      async () => {
        alert("Product bought successfully");
        await addOrder(selectedProduct.id);
        fetchTotals();
        setSelectedProduct(null);
      }
    );
  };

  const addOrder = async (productId) => {
    const currentDate = new Date().toISOString().split("T")[0];
    fetchAPI(
      "/api/order/add",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userid: data.account[0].id,
          productid: productId,
          date: currentDate,
        }),
      },
      async (result) => {
        if (result.status !== 200) {
          alert("Failed to add order");
          await fetchAPI("/user/refund", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: data.account[0].id,
              productid: productId,
            }),
          });
        }
      }
    );
  };

  useEffect(() => {
    if (data) {
      fetchProducts();
      fetchTotals();
    }
  }, [data, fetchProducts, fetchTotals]);

  return (
    <div className="home-container">
      <header>
        <div className="container">
          <nav>
            <ul>
              <li>Product Sold: {totals.sold}</li>
            </ul>
            <span>TsumuX Store</span>
            <span id="sold">Total Stock: {totals.stock}</span>
          </nav>
        </div>
      </header>
      <main className="container">
        <div className="products-list product-grid">
          {products.length > 0 ? (
            products.map((product) => (
              <div
                key={product.id}
                className="product"
                onClick={() => setSelectedProduct(product)}
              >
                <img
                  crossOrigin="anonymous"
                  src={`/uploads/${product.image}`}
                  alt={product.name}
                  loading="lazy"
                />
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <p className="price">{formatter.format(product.price)}</p>
              </div>
            ))
          ) : (
            <p>No products available</p>
          )}
        </div>
        {selectedProduct && (
          <div className="modal">
            <div className="modal-content">
              <button className="close" onClick={() => setSelectedProduct(null)}>
                &times;
              </button>
              <h2>{selectedProduct.name}</h2>
              <p>{selectedProduct.description}</p>
              <p>Stock: {selectedProduct.stock}</p>
              <p>Sold: {selectedProduct.sold}</p>
              <p className="price">
                {formatter.format(selectedProduct.price)}
              </p>
              <label htmlFor="quantity">Quantity:</label>
              <input
                type="number"
                id="quantity"
                value={quantity}
                min="1"
                max={selectedProduct.stock}
                onChange={(e) =>
                  setQuantity(Math.max(1, Math.min(selectedProduct.stock, e.target.value)))
                }
              />
              <button onClick={() => handleBuyProduct(quantity)}>Check out</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Home;
