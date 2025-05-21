import React, { useState } from "react";

export default function AddBranchForm({ onAdd }) {
    const [name, setName] = useState("");
    const [location, setLocation] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const token = localStorage.getItem("token");
    
        try {
            const res = await fetch(`http://localhost:8000/branches/`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, location }),
            });
    
            if (res.ok) {
                await res.json(); // можно не использовать newBranch, если обновляем всю страницу
                window.location.reload(); // перезагружаем страницу
            } else {
                const err = await res.json();
                console.error("Ошибка добавления филиала:", err.detail);
            }
        } catch (error) {
            console.error("Ошибка при добавлении филиала:", error);
        }
    };

    return (
        <div>
            <h3>Добавить новый филиал</h3>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Название филиала:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Местоположение:</label>
                    <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Добавить</button>
            </form>
        </div>
    );
}
