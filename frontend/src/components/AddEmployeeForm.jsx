import React, { useState } from "react";

export default function AddEmployeeForm({ onAdd }) {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [role, setRole] = useState("");
    const [branchId, setBranchId] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        try {
            const res = await fetch(`http://localhost:8000/employees/`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    first_name: firstName,
                    last_name: lastName,
                    role,
                    branch_id: Number(branchId),
                    password,
                }),
            });

            if (res.ok) {
                await res.json();
                window.location.reload(); // обновим страницу
            } else {
                const err = await res.json();
                console.error("Ошибка добавления сотрудника:", err.detail);
            }
        } catch (error) {
            console.error("Ошибка при добавлении сотрудника:", error);
        }
    };

    return (
        <div>
            <h3>Добавить нового сотрудника</h3>
            <form onSubmit={handleSubmit}>
                <input placeholder="Имя" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                <input placeholder="Фамилия" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                <input placeholder="Роль" value={role} onChange={(e) => setRole(e.target.value)} required />
                <input placeholder="ID филиала" type="number" value={branchId} onChange={(e) => setBranchId(e.target.value)} required />
                <input placeholder="Пароль" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="submit">Добавить</button>
            </form>
        </div>
    );
}
