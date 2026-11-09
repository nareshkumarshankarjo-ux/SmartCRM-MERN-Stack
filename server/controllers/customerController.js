
import mongoose from 'mongoose';
import { z } from 'zod';
import Customer from '../models/Customer.js';

// Customer validation schema
const customerSchema = z.object({
  name: z.string().trim().min(2).max(100),

  email: z.string().trim().email().max(254),

  phone: z.string().trim().max(30).default(''),

  company: z.string().trim().max(120).default(''),

  // Customer address details
  address: z.string().trim().max(250).default(''),

  city: z.string().trim().max(100).default(''),

  state: z.string().trim().max(100).default(''),

  pincode: z.string()
    .trim()
    .regex(
      /^$|^[1-9][0-9]{5}$/,
      'PIN Code must contain 6 valid digits'
    )
    .default(''),

  status: z.enum([
    'lead',
    'active',
    'inactive'
  ]).default('lead'),

  notes: z.string().trim().max(1000).default(''),

}).strict();

// Validate MongoDB ObjectId
const badId = (id) => !mongoose.isValidObjectId(id);

// Return validation errors
const invalid = (res, error) => {
  return res.status(400).json({
    message: 'Invalid customer data',
    errors: error.issues.map(issue => ({
      field: issue.path.join('.'),
      message: issue.message
    }))
  });
};

// GET - List all customers
export async function listCustomers(req, res) {
  try {
    const customers = await Customer.find({
      owner: req.user._id
    })
      .sort({ createdAt: -1 })
      .lean();

    return res.json({ customers });

  } catch (error) {
    console.error('List customers:', error.message);

    return res.status(500).json({
      message: 'Could not load customers'
    });
  }
}

// POST - Create customer
export async function createCustomer(req, res) {
  const parsed = customerSchema.safeParse(req.body);

  if (!parsed.success) {
    return invalid(res, parsed.error);
  }

  try {
    const customer = await Customer.create({
      ...parsed.data,
      email: parsed.data.email.toLowerCase(),
      owner: req.user._id
    });

    return res.status(201).json({
      message: 'Customer added',
      customer
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: 'Customer email already exists in your account'
      });
    }

    console.error('Create customer:', error.message);

    return res.status(500).json({
      message: 'Could not add customer'
    });
  }
}

// GET - Get one customer
export async function getCustomer(req, res) {
  if (badId(req.params.id)) {
    return res.status(400).json({
      message: 'Invalid customer ID'
    });
  }

  try {
    const customer = await Customer.findOne({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!customer) {
      return res.status(404).json({
        message: 'Customer not found'
      });
    }

    return res.json({ customer });

  } catch (error) {
    console.error('Get customer:', error.message);

    return res.status(500).json({
      message: 'Could not load customer'
    });
  }
}

// PUT - Update customer
export async function updateCustomer(req, res) {
  if (badId(req.params.id)) {
    return res.status(400).json({
      message: 'Invalid customer ID'
    });
  }

  const parsed = customerSchema.safeParse(req.body);

  if (!parsed.success) {
    return invalid(res, parsed.error);
  }

  try {
    const customer = await Customer.findOneAndUpdate(
      {
        _id: req.params.id,
        owner: req.user._id
      },
      {
        ...parsed.data,
        email: parsed.data.email.toLowerCase()
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!customer) {
      return res.status(404).json({
        message: 'Customer not found'
      });
    }

    return res.json({
      message: 'Customer updated',
      customer
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: 'Customer email already exists in your account'
      });
    }

    console.error('Update customer:', error.message);

    return res.status(500).json({
      message: 'Could not update customer'
    });
  }
}

// DELETE - Remove customer
export async function deleteCustomer(req, res) {
  if (badId(req.params.id)) {
    return res.status(400).json({
      message: 'Invalid customer ID'
    });
  }

  try {
    const customer = await Customer.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!customer) {
      return res.status(404).json({
        message: 'Customer not found'
      });
    }

    return res.json({
      message: 'Customer deleted'
    });

  } catch (error) {
    console.error('Delete customer:', error.message);

    return res.status(500).json({
      message: 'Could not delete customer'
    });
  }
}