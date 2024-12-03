import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

function Wishlist(){
    const [wishlist, setWishlist] = useState([]);
    const navigate = useNavigate();
    
    return(
        <div className="wishlist-container"></div>
    )
}