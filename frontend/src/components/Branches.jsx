import React, { useState, useEffect } from "react";
import AddBranchForm from "./AddBranchForm"; // Импортируем форму добавления филиала
import AllBranches from "./AllBranches"; // Импортируем компонент для отображения филиалов

export default function Branches() {
    const [branches, setBranches] = useState([]);

    const handleAddBranch = (newBranch) => {
        setBranches((prev) => [...prev, newBranch]);
    };

    return (
        <div>
            <h2>Branches</h2>
            {/* Форма для добавления нового филиала */}
            <AddBranchForm onAdd={handleAddBranch} />
            {/* Список всех филиалов */}
            <AllBranches />
        </div>
    );
}
