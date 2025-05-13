// models/OrderDetail.js
import e from 'express';
import { Schema, model, mongoose } from 'mongoose';

const orderDetailSchema = new Schema({
  item: { type: String, required: true },
  colour: { type: String, required: true },
  size: { type: String, required: true },
  quantity: { type: Number, required: true },
  unitPrice: { type: Number, required: true },
  totalPrice: {
    type: Number,
    required: true,
    validate: {
      validator: function(v) {
        return v === this.quantity * this.unitPrice;
      },
      message: 'Total price must equal quantity × unit price.'
    }
  }
});

const orderDetailsModel = mongoose.models.OrderDetails || model('OrderDetails', orderDetailSchema);
export default orderDetailsModel;