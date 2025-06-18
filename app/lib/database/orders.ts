// Import necessary modules
import connectDB from "@/lib/mongodb";
import mongoose, { ClientSession } from "mongoose";
import Order from "@/lib/models/Order"; // Assuming your Order model is at this path
// You might need to adjust the path to your Order model based on your project structure

/**
 * @typedef {object} ProductItem
 * @property {string} _id - The ID of the product.
 * @property {string} name - The name of the product.
 * @property {number} price - The price of the product.
 */

/**
 * @typedef {object} OrderData
 * @property {string} userId - The ID of the user who placed the order.
 * @property {ProductItem[]} products - An array of products in the order.
 */

/**
 * Create a new order.
 * @param {OrderData} orderData - The data for the new order.
 * @returns {Promise<object>} The created order document or an error object.
 */
export async function createOrder(orderData, session: ClientSession) {
  try {
    await connectDB(); // Establish database connection

    const newOrder = new Order(orderData);
    const savedOrder = await newOrder.save();

    return { success: true, data: savedOrder };
  } catch (error) {
    console.error("Error creating order:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Get all orders.
 * @returns {Promise<object>} An array of all order documents or an error object.
 */
export async function getAllOrders() {
  try {
    await connectDB(); // Establish database connection

    const orders = await Order.find({});
    return { success: true, data: orders };
  } catch (error) {
    console.error("Error fetching all orders:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Get an order by its ID.
 * @param {string} orderId - The ID of the order to retrieve.
 * @returns {Promise<object>} The order document or an error object (e.g., not found).
 */
export async function getOrderById(orderId) {
  try {
    await connectDB(); // Establish database connection

    const order = await Order.findById(orderId);
    if (!order) {
      return { success: false, error: "Order not found." };
    }
    return { success: true, data: order };
  } catch (error) {
    console.error(`Error fetching order with ID ${orderId}:`, error);
    return { success: false, error: error.message };
  }
}

/**
 * Get orders by a specific user ID.
 * @param {string} userId - The ID of the user whose orders to retrieve.
 * @returns {Promise<object>} An array of order documents for the specified user or an error object.
 */
export async function getOrdersByUserId(userId) {
  try {
    await connectDB(); // Establish database connection

    const orders = await Order.find({ userId: userId });
    return { success: true, data: orders };
  } catch (error) {
    console.error(`Error fetching orders for user ID ${userId}:`, error);
    return { success: false, error: error.message };
  }
}


/**
 * Update an existing order.
 * @param {string} orderId - The ID of the order to update.
 * @param {Partial<OrderData>} updateData - The fields to update (e.g., { products: [...] }).
 * @returns {Promise<object>} The updated order document or an error object.
 */
export async function updateOrder(orderId, updateData) {
  try {
    await connectDB(); // Establish database connection

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      updateData,
      { new: true, runValidators: true } 
    );

    if (!updatedOrder) {
      return { success: false, error: "Order not found for update." };
    }
    return { success: true, data: updatedOrder };
  } catch (error) {
    console.error(`Error updating order with ID ${orderId}:`, error);
    return { success: false, error: error.message };
  }
}

/**
 * Delete an order by its ID.
 * @param {string} orderId - The ID of the order to delete.
 * @returns {Promise<object>} A success message or an error object.
 */
export async function deleteOrder(orderId) {
  try {
    await connectDB(); // Establish database connection

    const deletedOrder = await Order.findByIdAndDelete(orderId);
    if (!deletedOrder) {
      return { success: false, error: "Order not found for deletion." };
    }
    return { success: true, message: "Order deleted successfully." };
  } catch (error) {
    console.error(`Error deleting order with ID ${orderId}:`, error);
    return { success: false, error: error.message };
  }
}


