import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Для навигации между страницами

export default function Login({ setToken }) {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [password, setPassword] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false); // Состояние для авторизации
    const navigate = useNavigate(); // Хук для навигации

    const login = async () => {
        console.log("Login function called");
    
        const formData = new FormData();
        formData.append("first_name", firstName);
        formData.append("last_name", lastName);
        formData.append("password", password);
    
        try {
            console.log("Sending login data:", {
                firstName,
                lastName,
                password,
            });
    
            const res = await fetch(`http://localhost:8000/token`, {
                method: "POST",
                body: formData,
            });
    
            console.log("Response received:", res);
    
            const data = await res.json();
    
            console.log("Parsed response data:", data);
    
            if (res.ok) {
                localStorage.setItem("token", data.access_token);
                setToken(data.access_token);
                setIsAuthenticated(true); // Устанавливаем состояние авторизации
                navigate('/menu'); // Переход на страницу меню
            } else {
                alert(data.detail || "Login failed");
            }
        } catch (err) {
            console.error("Login error:", err);
            alert("Login failed");
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <input
                placeholder="First Name"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
            />
            <input
                placeholder="Last Name"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
            />
            <input
                placeholder="Password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
            />
            <button onClick={login}>Login</button>
        </div>
    );
}
