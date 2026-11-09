
import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      default: '',
      trim: true,
    },

    company: {
      type: String,
      default: '',
      trim: true,
    },

    // Customer Address Details
    address: {
      type: String,
      trim: true,
      default: '',
    },

    city: {
      type: String,
      trim: true,
      default: '',
    },

    state: {
      type: String,
      trim: true,
      default: '',
    },

    pincode: {
      type: String,
      trim: true,
      default: '',
    },

    status: {
      type: String,
      enum: ['lead', 'active', 'inactive'],
      default: 'lead',
    },

    notes: {
      type: String,
      default: '',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate email addresses per user
customerSchema.index(
  { owner: 1, email: 1 },
  { unique: true }
);

export default mongoose.model('Customer', customerSchema);