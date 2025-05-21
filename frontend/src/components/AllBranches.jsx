import React, { useEffect, useState } from "react";

export default function AllBranches() {
    const [branches, setBranches] = useState([]);

    const fetchBranches = async () => {
        const token = localStorage.getItem("token");

        try {
            const res = await fetch(`http://localhost:8000/branches/`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (res.ok) {
                const data = await res.json();
                setBranches(data);
            } else {
                const err = await res.json();
                console.error("Ошибка получения филиалов:", err.detail);
            }
        } catch (error) {
            console.error("Ошибка при загрузке филиалов:", error);
        }
    };

    useEffect(() => {
        fetchBranches();
    }, []);

    const handleDelete = async (branchId) => {
        const token = localStorage.getItem("token");

        if (!window.confirm("Удалить филиал?")) return;

        try {
            const res = await fetch(`http://localhost:8000/branches/${branchId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (res.ok) {
                setBranches(branches.filter((b) => b.id !== branchId));
            } else {
                const err = await res.json();
                console.error("Ошибка удаления филиала:", err.detail);
            }
        } catch (error) {
            console.error("Ошибка при удалении филиала:", error);
        }
    };

    return (
        <div>
            <h3>Список филиалов</h3>
            {branches.length === 0 ? (
                <p>Нет филиалов.</p>
            ) : (
                <ul>
                    {branches.map((branch) => (
                        <li key={branch.id}>
                            <strong>{branch.name}</strong> – {branch.location}
                            <button onClick={() => handleDelete(branch.id)}>Удалить</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
