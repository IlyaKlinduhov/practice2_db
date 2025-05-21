import React, { useState } from "react";

export default function Products() {
    const [newProduct, setNewProduct] = useState({
        name: "",
        description: "",
        price: 0,
        available: false,
        quantity: [{ branch_id: 1, count: 0 }], // Инициализируем с одним элементом для quantity
        category: "",
        tags: [], // будет вводиться через строку, разбитую по запятым
    });

    // Обработка изменения полей формы
    const handleChange = (event) => {
        const { name, value } = event.target;
        setNewProduct({
            ...newProduct,
            [name]: value,
        });
    };

    // Обработка изменения количества для quantity
    const handleQuantityChange = (index, field, value) => {
        const updatedQuantity = [...newProduct.quantity];
        updatedQuantity[index][field] = value;
        setNewProduct({ ...newProduct, quantity: updatedQuantity });
    };

    // Добавление нового элемента в массив quantity
    const handleAddQuantity = () => {
        setNewProduct({
            ...newProduct,
            quantity: [...newProduct.quantity, { branch_id: 1, count: 0 }],
        });
    };

    // Удаление элемента из массива quantity
    const handleRemoveQuantity = (index) => {
        const updatedQuantity = newProduct.quantity.filter((_, i) => i !== index);
        setNewProduct({ ...newProduct, quantity: updatedQuantity });
    };

    // Функция для отправки данных на сервер
    const handleAddProduct = async (event) => {
        event.preventDefault();

        // Получение токена из localStorage
        const token = localStorage.getItem("token");

        const now = new Date().toISOString(); // ISO формат времени

        const productToSend = {
            ...newProduct,
            created_at: now,
            updated_at: now,
        };


        try {
            const res = await fetch(`http://localhost:8000/products/products`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(productToSend),
            });

            console.log(newProduct);

            if (res.ok) {
                alert("Product added successfully!");
                // Очистить форму после успешного добавления
                setNewProduct({
                    name: "",
                    description: "",
                    price: 0,
                    available: false,
                    quantity: [{ branch_id: 1, count: 0 }],
                    category: "",
                    tags: [], // будет вводиться через строку, разбитую по запятым
                });
            } else {
                const errorData = await res.json();
                alert("Error adding product: " + errorData.detail);
            }
        } catch (error) {
            console.error("Error adding product:", error);
        }
    };

    return (
        <div>
            <h2>Add New Product</h2>
            <form onSubmit={handleAddProduct}>
                <div>
                    <label>Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={newProduct.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Description:</label>
                    <input
                        type="text"
                        name="description"
                        value={newProduct.description}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Price:</label>
                    <input
                        type="number"
                        name="price"
                        value={newProduct.price}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Available:</label>
                    <input
                        type="checkbox"
                        name="available"
                        checked={newProduct.available}
                        onChange={() => setNewProduct({ ...newProduct, available: !newProduct.available })}
                    />
                </div>

                <div>
                    <label>Category:</label>
                    <input
                        type="text"
                        name="category"
                        value={newProduct.category}
                        onChange={handleChange}
                />
                </div>
                <div>
                    <label>Tags (comma-separated):</label>
                    <input
                        type="text"
                        value={newProduct.tags.join(", ")}
                        onChange={(e) =>
                            setNewProduct({
                                ...newProduct,
                                tags: e.target.value
                                    .split(",")
                                    .map((tag) => tag.trim())
                                    .filter((tag) => tag !== ""),
                            })
                        }
                />
                </div> 

                {/* Quantity Fields */}
                <h3>Quantity</h3>
                {newProduct.quantity.map((item, index) => (
                    <div key={index}>
                        <label>Branch ID:</label>
                        <input
                            type="number"
                            value={item.branch_id}
                            onChange={(e) => handleQuantityChange(index, "branch_id", e.target.value)}
                            required
                        />
                        <label>Count:</label>
                        <input
                            type="number"
                            value={item.count}
                            onChange={(e) => handleQuantityChange(index, "count", e.target.value)}
                            required
                        />
                        <button type="button" onClick={() => handleRemoveQuantity(index)}>
                            Remove
                        </button>
                    </div>
                ))}
                <button type="button" onClick={handleAddQuantity}>
                    Add Quantity
                </button>

                <button type="submit">Add Product</button>
            </form>
        </div>
    );
}
