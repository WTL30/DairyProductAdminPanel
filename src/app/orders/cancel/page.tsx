"use client";
import { useState } from "react";

type Order = {
  id: number;
  customer: string;
  status: string;
};

const initialOrders: Order[] = [
  { id: 1, customer: "John Doe", status: "Shipped" },
  { id: 2, customer: "Jane Smith", status: "Pending" },
  { id: 3, customer: "Alice Johnson", status: "Delivered" },
];

export default function ManageOrders() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);

  const handleCancelOrder = (id: number) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === id ? { ...order, status: "Cancelled" } : order
      )
    );
  };

  const getStatusBadge = (status: string) => {
    const baseStyle = "px-3 py-1 rounded-full text-sm font-semibold";
    switch (status) {
      case "Shipped":
        return <span className={`${baseStyle} bg-blue-100 text-blue-700`}>Shipped</span>;
      case "Pending":
        return <span className={`${baseStyle} bg-yellow-100 text-yellow-700`}>Pending</span>;
      case "Delivered":
        return <span className={`${baseStyle} bg-green-100 text-green-700`}>Delivered</span>;
      case "Cancelled":
        return <span className={`${baseStyle} bg-red-100 text-red-700`}>Cancelled</span>;
      default:
        return <span className={`${baseStyle} bg-gray-100 text-gray-700`}>{status}</span>;
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Manage Orders</h2>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[400px] border-collapse border border-gray-700 rounded-lg shadow-md">
          <thead className="bg-blue-600 text-white">
            <tr>
              {["Order ID", "Customer", "Status", "Actions"].map((header) => (
                <th key={header} className="border border-gray-700 p-3 text-center font-bold">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="text-center bg-blue-50 hover:bg-blue-100 transition-colors duration-200">
                <td className="border border-gray-300 p-3">{order.id}</td>
                <td className="border border-gray-300 p-3">{order.customer}</td>
                <td className="border border-gray-300 p-3">{getStatusBadge(order.status)}</td>
                <td className="border border-gray-300 p-3">
                  {order.status !== "Cancelled" && (
                    <button
                      onClick={() => handleCancelOrder(order.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700"
                    >
                      Cancel Order
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
