// "use client";
// import { useState } from "react";

// export default function CheckStockLevels() {
//     const [stocks, setStocks] = useState([
//         { id: 1, name: "Milk", category: "Dairy Products", quantity: 20, unit: "L" },
//         { id: 2, name: "Cheese", category: "Dairy Products", quantity: 8, unit: "kg" },
//         { id: 3, name: "Butter", category: "Dairy Products", quantity: 5, unit: "kg" },
//         { id: 4, name: "Yogurt", category: "Dairy Products", quantity: 15, unit: "L" },
//     ]);

//     const categories = ["Dairy Products", "Sauce", "Beverage", "Vegetables", "Bakery"];
//     const units = ["L", "ml", "kg", "gm"];
    
//     const [newStock, setNewStock] = useState({ name: "", category: "", quantity: "", unit: "" });
//     const [editId, setEditId] = useState(null);

//     const handleChange = (e) => {
//         setNewStock({ ...newStock, [e.target.name]: e.target.value });
//     };

//     const deleteStock = (id) => {
//         setStocks(stocks.filter(stock => stock.id !== id));
//     };

//     const startEditing = (stock) => {
//         setEditId(stock.id);
//         setNewStock({ name: stock.name, category: stock.category, quantity: stock.quantity, unit: stock.unit });
//     };

//     const updateStock = () => {
//         setStocks(stocks.map(stock => stock.id === editId ? { ...stock, ...newStock, quantity: Number(newStock.quantity) } : stock));
//         setEditId(null);
//         setNewStock({ name: "", category: "", quantity: "", unit: "" });
//     };

//     return (
//         <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md">
//             <h2 className="text-2xl font-bold mb-4">Check Stock Levels</h2>
            
//             {editId && (
//                 <div className="mb-4 flex space-x-2">
//                     <input type="text" name="name" value={newStock.name} onChange={handleChange} placeholder="Product Name" className="border p-2 w-1/5" />
//                     <select name="category" value={newStock.category} onChange={handleChange} className="border p-2 w-1/5">
//                         <option value="">Select Category</option>
//                         {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
//                     </select>
//                     <input type="number" name="quantity" value={newStock.quantity} onChange={handleChange} placeholder="Quantity" className="border p-2 w-1/5" />
//                     <select name="unit" value={newStock.unit} onChange={handleChange} className="border p-2 w-1/5">
//                         <option value="">Select Unit</option>
//                         {units.map((unit) => <option key={unit} value={unit}>{unit}</option>)}
//                     </select>
//                     <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600" onClick={updateStock}>Update</button>
//                 </div>
//             )}

//             <table className="w-full border-collapse border border-gray-300">
//                 <thead>
//                     <tr className="bg-gray-100">
//                         <th className="border p-2">Product</th>
//                         <th className="border p-2">Category</th>
//                         <th className="border p-2">Quantity</th>
//                         <th className="border p-2">Unit</th>
//                         <th className="border p-2">Stock</th> {/* Added Stock Column */}
//                         <th className="border p-2">Actions</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {stocks.map((stock) => (
//                         <tr key={stock.id} className="border">
//                             <td className="border p-2">{stock.name}</td>
//                             <td className="border p-2">{stock.category}</td>
//                             <td className={`border p-2 ${stock.quantity < 10 ? "text-red-500 font-bold" : ""}`}>{stock.quantity}</td>
//                             <td className="border p-2">{stock.unit}</td>
//                             <td className="border p-2">{stock.quantity > 10 ? "In Stock" : "Low Stock"}</td> {/* New Column Logic */}
//                             <td className="border p-2 flex space-x-2">
//                                 <button className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600" onClick={() => startEditing(stock)}>Edit</button>
//                                 <button className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600" onClick={() => deleteStock(stock.id)}>Delete</button>
//                             </td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>
//         </div>
//     );
// }




"use client"; // Ensure this is at the top

    import { useState, useEffect } from "react";

    export default function CheckStockLevels() {
        const [stocks, setStocks] = useState([]);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState(null);
        const [editId, setEditId] = useState(null);
        const [newStock, setNewStock] = useState({
            productName: "",
            category: "",
            quantity: "",
            unit: "",
            availableStock: ""
        });

        const categories = ["Dairy Products", "Sauce", "Beverage", "Vegetables", "Bakery"];
        const units = ["L", "ml", "kg", "gm"];

        useEffect(() => {
            const fetchStock = async () => {
                try {
                    const response = await fetch("http://localhost:5000/api/stocks/getStock");
                    if (!response.ok) throw new Error("Failed to fetch stock data");

                    const data = await response.json();
                    setStocks(data);
                    setLoading(false);
                } catch (err) {
                    setError(err.message);
                    setLoading(false);
                }
            };
            fetchStock();
        }, []);

        const handleChange = (e) => {
            let { name, value } = e.target;

            // Prevent negative values for quantity and availableStock
            if ((name === "quantity" || name === "availableStock") && value < 0) {
                value = 0;
            }

            setNewStock({ ...newStock, [name]: value });
        };

        const deleteStock = async (id) => {
            try {
                await fetch(`http://localhost:5000/api/stocks/${id}`, { method: "DELETE" });
                setStocks(stocks.filter(stock => stock._id !== id));
            } catch (error) {
                console.error("Error deleting stock:", error);
            }
        };

        const startEditing = (stock) => {
            setEditId(stock._id);
            setNewStock({
                productName: stock.productName,
                category: stock.category?.[0] || "",
                quantity: stock.quantity,
                unit: stock.unit?.[0] || "",
                availableStock: stock.availableStock || 0
            });
        };

        const updateStock = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/stocks/${editId}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        ...newStock,
                        quantity: Number(newStock.quantity),
                        availableStock: Number(newStock.availableStock)
                    })
                });

                if (!response.ok) throw new Error("Failed to update stock");

                const updatedProduct = await response.json();
                setStocks(stocks.map(stock => (stock._id === editId ? updatedProduct : stock)));
                setEditId(null);
                setNewStock({ productName: "", category: "", quantity: "", unit: "", availableStock: "" });
            } catch (error) {
                console.error("Error updating stock:", error);
            }
        };

        if (loading) return <p>Loading stock data...</p>;
        if (error) return <p className="text-red-500">Error: {error}</p>;

        return (
            <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md">
                <h2 className="text-2xl font-bold mb-4">Check Stock Levels</h2>

                {editId && (
                    <div className="mb-4 flex space-x-2">
                        <input
                            type="text"
                            name="productName"
                            value={newStock.productName}
                            onChange={handleChange}
                            placeholder="Product Name"
                            className="border p-2 w-1/6"
                        />
                        <select
                            name="category"
                            value={newStock.category || ""}
                            onChange={handleChange}
                            className="border p-2 w-1/6"
                        >
                            <option value="">Select Category</option>
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                        <input
                            type="number"
                            name="quantity"
                            value={newStock.quantity}
                            onChange={handleChange}
                            placeholder="Quantity"
                            className="border p-2 w-1/6"
                            min="0" // Prevent negative values
                        />
                        <select
                            name="unit"
                            value={newStock.unit || ""}
                            onChange={handleChange}
                            className="border p-2 w-1/6"
                        >
                            <option value="">Select Unit</option>
                            {units.map((unit) => (
                                <option key={unit} value={unit}>{unit}</option>
                            ))}
                        </select>
                        <input
                            type="number"
                            name="availableStock"
                            value={newStock.availableStock}
                            onChange={handleChange}
                            placeholder="Available Stock"
                            className="border p-2 w-1/6"
                            min="0" // Prevent negative values
                        />
                        <button
                            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                            onClick={updateStock}
                        >
                            Update
                        </button>
                    </div>
                )}

                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border p-2">Product</th>
                            <th className="border p-2">Category</th>
                            <th className="border p-2">Quantity</th>
                            <th className="border p-2">Unit</th>
                            <th className="border p-2">Available Stock</th>
                            <th className="border p-2">Stock Status</th>
                            <th className="border p-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stocks.map((stock) => (
                            <tr key={stock._id} className="border">
                                <td className="border p-2">{stock.productName}</td>
                                <td className="border p-2">{stock.category?.[0] || ""}</td>
                                <td className={`border p-2 ${stock.quantity < 10 ? "text-red-500 font-bold" : ""}`}>
                                    {stock.quantity}
                                </td>
                                <td className="border p-2">{stock.unit?.[0] || ""}</td>
                                <td className="border p-2 font-bold text-blue-500">
                                    {stock.availableStock || 0}
                                </td>
                                <td className="border p-2">{stock.quantity > 10 ? "In Stock" : "Low Stock"}</td>
                                <td className="border p-2 flex space-x-2">
                                    <button
                                        className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600"
                                        onClick={() => startEditing(stock)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                                        onClick={() => deleteStock(stock._id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }
