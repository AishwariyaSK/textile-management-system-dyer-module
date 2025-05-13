import mongoose, { model } from 'mongoose';
const { Schema } = mongoose;

const notificationSchema = new Schema({
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    message: {
      type: String,
      required: true,
    },
    seen: {
      type: Boolean,
      default: false,
    },
    isForAdmin: {
      type: Boolean,
      default: function () {
        return !this.userId;
      },
    },
    batchId:{
        type: Schema.Types.ObjectId,
        ref: 'Batch',
        required: false,
    },
    category: {
        type: String,
        enum: ['approve', 'status update', 'payment pending', 'payment received', 'order placed'],
        required: true,
    },
    dateTime: {
      type: Date,
      default: Date.now,
    },
  });
  

export default model('Notification', notificationSchema);
