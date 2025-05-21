import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";  
import Products from "./components/Products";  
import Branches from "./components/Branches"; 
import AllProducts from "./components/AllProducts";
import Employees from "./components/Employees"; 

function App() {
    const [token, setToken] = useState(localStorage.getItem("token")); 
    const [isAuthenticated, setIsAuthenticated] = useState(false); 

    useEffect(() => {
        // Если токен есть, то пользователь авторизован
        if (token) {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
        }
    }, [token]); 

    const handleLogout = () => {
        setToken(null); 
        setIsAuthenticated(false); 
        localStorage.removeItem("token"); 
    };

    return (
        <Router>
            <div>
                {}
                {isAuthenticated ? (
                    <div>
                        <h3>Menu</h3>
                        <button onClick={() => window.location.href = '/products'}>Products</button>
                        <button onClick={() => window.location.href = '/branches'}>Branches</button>
                        <button onClick={() => window.location.href = '/employees'}>Employees</button>
                        <button onClick={() => window.location.href = '/all-products'}>All Products</button>
                        <button onClick={handleLogout}>Logout</button>
                    </div>
                ) : (
                    <div>
                        <button onClick={() => window.location.href = '/all-products'}>View Products</button>
                    </div>
                )}

                <Routes>
                    <Route path="/" element={<Login setToken={setToken} />} />
                    <Route path="/products" element={isAuthenticated ? <Products /> : <Login setToken={setToken} />} />
                    <Route path="/branches" element={isAuthenticated ? <Branches /> : <Login setToken={setToken} />} />
                    <Route path="/employees" element={isAuthenticated ? <Employees /> : <Login setToken={setToken} />} />
                    <Route path="/all-products" element={<AllProducts />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
