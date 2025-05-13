import buyerPurchaseOrderModel from '../models/buyerPurchaseOrderModel.js';
import orderDetailsModel from '../models/orderDetailsModel.js';

const createBuyerPurchaseOrder = async (req, res) => {
    try {
        const { purchaseDate, targetDeliveryDate, orderDetails, tax } = req.body;
        const buyer = req.user._id;

        if (!Array.isArray(orderDetails) || orderDetails.length === 0) {
            return res.status(400).json({ success: false, message: "orderDetails must be a non-empty array" });
        }

        let subtotal = 0;
        const orderDetailIds = [];

        for (const detail of orderDetails) {
            const expectedTotal = detail.quantity * detail.unitPrice;
            if (detail.totalPrice !== expectedTotal) {
                return res.status(400).json({
                    success: false,
                    message: `Invalid totalPrice for item "${detail.item}". Expected ${expectedTotal}, got ${detail.totalPrice}`
                });
            }

            const savedDetail = new orderDetailsModel(detail);
            await savedDetail.save();
            orderDetailIds.push(savedDetail._id);
            subtotal += savedDetail.totalPrice;
        }
        const total = subtotal + tax;
        const newPurchaseOrder = new buyerPurchaseOrderModel({
            purchaseDate,
            targetDeliveryDate,
            buyer,
            orderDetails: orderDetailIds,
            subtotal,
            tax,
            total
        });

        await newPurchaseOrder.save();

        res.status(201).json({ success: true, purchaseOrder: newPurchaseOrder });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};


const updateBuyerPurchaseOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { newStatus } = req.body;

    const statusFlow = ['sampling and budgeting', 'production', 'quality check', 'payment', 'completed'];

    const order = await buyerPurchaseOrderModel.findById(id);
    if (!order) return res.status(404).json({ success: false, message: 'Purchase order not found' });

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

    res.status(200).json({ success: true, updatedStatus: order.status });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getBuyerPurchaseOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const purchaseOrder = await buyerPurchaseOrderModel.findById(id).populate('orderDetails');
        if (!purchaseOrder) {
            return res.status(404).json({ success: false, message: "Purchase order not found" });
        } 
        res.status(200).json({ success: true, purchaseOrder });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    } 
}
const getAllBuyerPurchaseOrders = async (req, res) => {
    try {
        const purchaseOrders = await buyerPurchaseOrderModel.find({}).populate('orderDetails');
        res.status(200).json({ success: true, purchaseOrders });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

const deleteBuyerPurchaseOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const purchaseOrder = await buyerPurchaseOrderModel.findByIdAndDelete(id);
        if (!purchaseOrder) {
            return res.status(404).json({ success: false, message: "Purchase order not found" });
        }
        res.status(200).json({ success: true, message: "Purchase order deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export {createBuyerPurchaseOrder, updateBuyerPurchaseOrderStatus, getBuyerPurchaseOrder, getAllBuyerPurchaseOrders, deleteBuyerPurchaseOrder};
