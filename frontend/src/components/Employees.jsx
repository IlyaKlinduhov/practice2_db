import React, { useEffect, useState } from "react";
import AddEmployeeForm from "./AddEmployeeForm";

export default function Employees() {
    const [employees, setEmployees] = useState([]);
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const res = await fetch(`http://localhost:8000/employees/`, {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                });
                if (res.ok) {
                    const data = await res.json();
                    setEmployees(data);
                } else {
                    const err = await res.json();
                    console.error("Ошибка загрузки сотрудников:", err.detail);
                }
            } catch (error) {
                console.error("Ошибка при загрузке сотрудников:", error);
            }
        };

        fetchEmployees();
    }, [token]);

    const handleDelete = async (id) => {
        try {
            const res = await fetch(`http://localhost:8000/employees/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });
            if (res.ok) {
                window.location.reload(); // обновим список
            } else {
                const err = await res.json();
                console.error("Ошибка удаления:", err.detail);
            }
        } catch (error) {
            console.error("Ошибка при удалении сотрудника:", error);
        }
    };

    return (
        <div>
            <AddEmployeeForm />
            <h3>Список сотрудников</h3>
            <ul>
                {employees.map((emp) => (
                    <li key={emp.id}>
                        {emp.first_name} {emp.last_name} — {emp.role}, филиал #{emp.branch_id}
                        <button onClick={() => handleDelete(emp.id)}>Удалить</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
