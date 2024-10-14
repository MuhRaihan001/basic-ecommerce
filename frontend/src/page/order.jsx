import React, {useCallback, useState, useEffect} from "react";

function OrderList(){
    const [orders, setOrders] = useState([]);
    const [data, setData] = useState([]);
    const rawData = localStorage.getItem("user");

    useEffect(() =>{
        if(rawData){
            setData(JSON.parse(rawData))
        }
    }, [data]);

    const loadUserOrderList = useCallback(async () =>{
        const response = await fetch(`/api/order/${data.account[0].id}`,{
            method: 'GET',
            headers: {
                auth: data.token
            }
        });
        const datas = await response.json();
        setOrders(datas.list);
    }, [data, orders]);

    useEffect(() =>{
        if(data){
            loadUserOrderList();
        }
    }, [data, loadUserOrderList]);

    return (
        <div className="orderList-container">
            <h1>Order List</h1>
            {orders.length > 0 ? (
                orders.map((a) =>(
                    <div key={a.id} className="order">
                        <p>Order ID: {a.id}</p>
                        <p>Order Date: {a.orderdate}</p>
                        <p>Order Status: {a.status}</p>
                    </div>
                ))
            ) : <p>No Orders</p>}
        </div>
    )
}

export default OrderList;