import mongoose, { mongo } from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    eventType: {
      type: String,
      enum: ['impression', 'click'],
      required: true,
    },
    deviceType: {
      type: String,
      enum: ['phone', 'desktop', 'tablet'],
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false } // optional: don't create _id for each subdocument
);

const analyticsSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
  adId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Advertise',
    required: true,
    unique: true,
  },
  events: [eventSchema],
});

export const Analytics = mongoose.model('Analytics', analyticsSchema);
