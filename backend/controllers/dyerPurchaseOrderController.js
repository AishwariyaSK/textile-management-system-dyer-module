import dyerPurchaseOrderModel from '../models/dyerPurchaseOrderModel.js';
import mongoose from 'mongoose';
import { createNotificationFunction } from './notificationController.js';

const createDyerPurchaseOrder = async (req, res) => {
  try {
    const { dyerId, purchaseDate, targetDeliveryDate, order, tax } = req.body;

    if (!Array.isArray(order) || order.length === 0) {
      return res.status(400).json({ success: false, message: "Order must be a non-empty array" });
    }

    // Validate and calculate total from price fields
    let subtotal = 0;
    for (const item of order) {
      if (!item.clothSize || !item.colour || typeof item.price !== 'number') {
        return res.status(400).json({ success: false, message: "Each order item must have clothSize, colour, and price" });
      }
      subtotal += item.price;
    }

    const total = subtotal + tax;

    const newDyerPurchaseOrder = new dyerPurchaseOrderModel({
      purchaseDate,
      targetDeliveryDate,
      dyer: dyerId,
      order,
      tax,
      total
    });

    await newDyerPurchaseOrder.save();

    await createNotificationFunction({
      userId: dyerId,
      message: `New order received`,
      category: 'order placed',
      isForAdmin: false,
      batchId: newDyerPurchaseOrder._id
    })

    res.status(201).json({ success: true, dyerPurchaseOrder: newDyerPurchaseOrder });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


const updateDyerPurchaseOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { newStatus } = req.body;

    const statusFlow = [
      'sent for dyeing',
      'received for dyeing',
      'sent dyed material',
      'received dyed material',
      'quality check',
      'payment',
      'completed'
    ];

    const adminStatus=[
      'received for dyeing',
      'sent dyed material',
    ]

    const dyerStatus=[
      'sent for dyeing',
      'received dyed material',
      'quality check',
      'payment',
      'completed'
    ]

    const order = await dyerPurchaseOrderModel.findById(id);
    if (!order) return res.status(404).json({ success: false, message: 'Dyer purchase order not found' });

    const currentIndex = statusFlow.indexOf(order.status);
    const newIndex = statusFlow.indexOf(newStatus);

    if (newIndex === -1) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    if (newIndex !== currentIndex + 1) {
      return res.status(400).json({
        success: false,
        message: `Status update must follow sequence. Current: ${order.status}, Attempted: ${newStatus}`
      });
    }

    order.status = newStatus;
    await order.save();

    let message,userId,category,isForAdmin;

    // if (newStatus=== 'payment'){
    //   message = `payment pending for ${order.dyer._id} `;
    // } 
    if (newStatus=== 'completed'){
      message = `payment received for order id ${order._id} `;
      category = 'payment received'
    }
    else{
      message = `Status updated to "${newStatus}" for order id ${order._id}`;
      category = 'status update'
    }

    if (adminStatus.includes(newStatus)){
      userId = null;  
      isForAdmin = true;
    }
    else{
      userId = order.dyer;  
      isForAdmin = false;
    }

    await createNotificationFunction({
      userId,
      message,
      category,
      isForAdmin,
      batchId: order._id
    })

    if (newStatus === 'payment') {
      await createNotificationFunction({
        message: `Payment pending for order id ${order._id}`,
        category: 'payment pending',
        isForAdmin: true,
        batchId: order._id
      })
    }

    res.status(200).json({ success: true, updatedStatus: order.status });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getDyerPurchaseOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const purchaseOrder = await dyerPurchaseOrderModel.findById(id).populate('order').populate('dyer'); 
    if (!purchaseOrder) {
      return res.status(404).json({ success: false, message: "Dyer purchase order not found" });
    } 
    res.status(200).json({ success: true, purchaseOrder });
  }
  catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getAllDyerPurchaseOrders = async (req, res) => {
  try {
    const purchaseOrders = await dyerPurchaseOrderModel.find({}).populate('order').populate('dyer');
    res.status(200).json({ success: true, purchaseOrders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
const deleteDyerPurchaseOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const purchaseOrder = await dyerPurchaseOrderModel.findByIdAndDelete(id);
    if (!purchaseOrder) {
      return res.status(404).json({ success: false, message: "Dyer purchase order not found" });
    }
    res.status(200).json({ success: true, message: "Dyer purchase order deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getDyerPurchaseOrderByDyerId = async (req, res) => {
  try {
    const { id } = req.params;
    const fallbackId = req.user?._id;

    const dyerId = (id && id !== 'undefined') ? id : fallbackId;
    if (!dyerId || !mongoose.Types.ObjectId.isValid(dyerId)) {
          return res.status(400).json({ error: "Invalid or missing user ID" });
    }

    const purchaseOrders = await dyerPurchaseOrderModel.find({ dyer: dyerId }).populate('order').populate('dyer');
    if (!purchaseOrders) {
      return res.status(404).json({ success: false, message: "No purchase orders found for this dyer" });
    }
    res.status(200).json({ success: true, purchaseOrders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export {createDyerPurchaseOrder, updateDyerPurchaseOrderStatus, getDyerPurchaseOrder, getAllDyerPurchaseOrders, deleteDyerPurchaseOrder, getDyerPurchaseOrderByDyerId};
