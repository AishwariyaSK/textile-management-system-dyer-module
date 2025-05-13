import { Schema, model, mongoose } from 'mongoose';

const orderItemSchema = new Schema({
  clothSize: { type: String, required: true },
  colour: { type: String, required: true },
  price: { type: Number, required: true }
}, { _id: false }); // prevent nested _id fields

const dyerPurchaseOrderSchema = new Schema({
  purchaseDate: { type: Date, required: true },
  targetDeliveryDate: { type: Date, required: true },
  dyer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  order: { type: [orderItemSchema], required: true },
  tax: { type: Number, required: true },
  total: { type: Number, required: true }, // Will be calculated in controller
  status: {
    type: String,
    required: true,
    enum: ['sent for dyeing', 'received for dyeing', 'sent dyed material', 'received dyed material', 'quality check', 'payment', 'completed'],
    default: 'sent for dyeing'
  },
});

const dyerPurchaseOrderModel = mongoose.models.DyerPurchaseOrder || model('DyerPurchaseOrder', dyerPurchaseOrderSchema);
export default dyerPurchaseOrderModel;
