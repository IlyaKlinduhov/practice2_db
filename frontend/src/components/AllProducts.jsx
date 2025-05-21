import React, { useEffect, useState } from "react";

export default function AllProducts() {
    const [products, setProducts] = useState([]);

    const fetchProducts = async () => {
        const token = localStorage.getItem("token");

        try {
            const res = await fetch(`http://localhost:8000/products/`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (res.ok) {
                const data = await res.json();
                setProducts(data);
            } else {
                const err = await res.json();
                console.error("Ошибка получения продуктов:", err.detail);
            }
        } catch (error) {
            console.error("Ошибка при загрузке продуктов:", error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = async (productId) => {
        const token = localStorage.getItem("token");

        if (!window.confirm("Удалить продукт?")) return;

        try {
            const res = await fetch(`http://localhost:8000/products/${productId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (res.ok) {
                // Перезагружаем список продуктов после удаления
                fetchProducts();
            } else {
                const err = await res.json();
                console.error("Ошибка удаления:", err.detail);
            }
        } catch (error) {
            console.error("Ошибка при удалении продукта:", error);
        }
    };

    return (
        <div>
            <h2>All Products</h2>
            {products.length === 0 ? (
                <p>No products found.</p>
            ) : (
                <ul>
                    {products.map((product) => (
                        <li key={product._id}>
                            <strong>{product.name}</strong> – {product.description} – ${product.price}<br />
                            <em>Tags:</em> {product.tags?.join(", ")}<br />
                            <em>Category:</em> {product.category}<br />
                            <em>Available:</em> {product.available ? "Yes" : "No"}<br />
                            <em>Quantity:</em>{" "}
                            {product.quantity?.map((q, i) => (
                                <span key={i}>[Branch {q.branch_id}: {q.count}] </span>
                            ))}
                            <br />
                            <button onClick={() => handleDelete(product._id)}>Удалить</button>
                            <hr />
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
