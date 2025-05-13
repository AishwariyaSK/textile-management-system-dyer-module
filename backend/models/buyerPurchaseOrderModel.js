// models/BuyerPurchaseOrder.js
import { Schema, model, mongoose } from 'mongoose';

const buyerPurchaseOrderSchema = new Schema({
  purchaseDate: { type: Date, required: true },
  targetDeliveryDate: { type: Date, required: true },
  buyer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  orderDetails: [{ type: Schema.Types.ObjectId, ref: 'OrderDetails', required: true }],
  subtotal: { type: Number, required: true },
  tax: { type: Number, required: true },
  total: { type: Number, required: true },
  status: { type: String, required: true, enum: ['sampling and budgeting', 'production', 'quality check', 'payment', 'completed'], default: 'sampling and budgeting' },
});

const buyerPurchaseOrderModel = mongoose.models.BuyerPurchaseOrder || model('BuyerPurchaseOrder', buyerPurchaseOrderSchema);
export default buyerPurchaseOrderModel;