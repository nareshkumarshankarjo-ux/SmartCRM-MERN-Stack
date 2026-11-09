
import { useCallback, useEffect, useState } from 'react';
import api from '../services/api.js';

// Empty customer form
const EMPTY = {
  name: '',
  email: '',
  phone: '',
  company: '',
  address: '',
  city: '',
  state: '',
  pincode: '',
  status: 'lead',
  notes: '',
};

// Customer form input fields
const inputFields = [
  {
    name: 'name',
    label: 'Full Name',
    type: 'text',
    required: true,
    maxLength: 100,
  },
  {
    name: 'email',
    label: 'Email Address',
    type: 'email',
    required: true,
    maxLength: 254,
  },
  {
    name: 'phone',
    label: 'Phone',
    type: 'tel',
    maxLength: 30,
  },
  {
    name: 'company',
    label: 'Company',
    type: 'text',
    maxLength: 120,
  },
  {
    name: 'address',
    label: 'Address',
    type: 'text',
    maxLength: 250,
  },
  {
    name: 'city',
    label: 'City',
    type: 'text',
    maxLength: 100,
  },
  {
    name: 'state',
    label: 'State',
    type: 'text',
    maxLength: 100,
  },
  {
    name: 'pincode',
    label: 'Pincode',
    type: 'text',
    maxLength: 6,
  },
];

export default function Customers() {
  // Customer data
  const [customers, setCustomers] = useState([]);

  // Customer form
  const [form, setForm] = useState({ ...EMPTY });

  // Editing customer ID
  const [editingId, setEditingId] = useState(null);

  // Search
  const [query, setQuery] = useState('');

  // Location filters
  const [cityFilter, setCityFilter] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [pincodeFilter, setPincodeFilter] = useState('');

  // Messages and loading
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  // =====================================
  // Load customers
  // =====================================

  const load = useCallback(async () => {
    setLoading(true);

    try {
      const { data } = await api.get('/customers');

      setCustomers(data.customers || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Unable to load customers'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // =====================================
  // Handle form changes
  // =====================================

  function handleChange(e) {
    const { name, value } = e.target;

    setForm(prev => ({
      ...prev,
      [name]: value,
    }));
  }

  // =====================================
  // Reset customer form
  // =====================================

  function reset() {
    setEditingId(null);
    setForm({ ...EMPTY });
  }

  // =====================================
  // Edit customer
  // =====================================

  function edit(customer) {
    setEditingId(customer._id);

    setForm({
      name: customer.name || '',
      email: customer.email || '',
      phone: customer.phone || '',
      company: customer.company || '',
      address: customer.address || '',
      city: customer.city || '',
      state: customer.state || '',
      pincode: customer.pincode || '',
      status: customer.status || 'lead',
      notes: customer.notes || '',
    });

    setError('');
    setMessage('');

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  // =====================================
  // Add or Update Customer
  // =====================================

  async function save(e) {
    e.preventDefault();

    setError('');
    setMessage('');
    setBusy(true);

    try {
      if (editingId) {
        await api.put(
          `/customers/${editingId}`,
          form
        );
      } else {
        await api.post('/customers', form);
      }

      const successMessage = editingId
        ? 'Customer updated successfully'
        : 'Customer added successfully';

      reset();

      await load();

      setMessage(successMessage);
    } catch (err) {
      const serverErrors = err.response?.data?.errors;

      if (serverErrors?.length) {
        setError(
          serverErrors
            .map(item => `${item.field}: ${item.message}`)
            .join('; ')
        );
      } else {
        setError(
          err.response?.data?.message ||
            'Could not save customer'
        );
      }
    } finally {
      setBusy(false);
    }
  }

  // =====================================
  // Delete Customer
  // =====================================

  async function remove(customer) {
    const confirmed = window.confirm(
      `Delete ${customer.name}? This cannot be undone.`
    );

    if (!confirmed) return;

    setError('');
    setMessage('');
    setBusy(true);

    try {
      await api.delete(
        `/customers/${customer._id}`
      );

      if (editingId === customer._id) {
        reset();
      }

      await load();

      setMessage('Customer deleted successfully');
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Could not delete customer'
      );
    } finally {
      setBusy(false);
    }
  }

  // =====================================
  // Available Cities and States
  // =====================================

  const cities = [
    ...new Set(
      customers
        .map(customer => customer.city?.trim())
        .filter(Boolean)
    ),
  ].sort((a, b) => a.localeCompare(b));

  const states = [
    ...new Set(
      customers
        .map(customer => customer.state?.trim())
        .filter(Boolean)
    ),
  ].sort((a, b) => a.localeCompare(b));

  // =====================================
  // Search and Location Filters
  // =====================================

  const results = customers.filter(customer => {
    const searchText = query.trim().toLowerCase();

    const searchFields = [
      customer.name,
      customer.email,
      customer.phone,
      customer.company,
      customer.address,
      customer.city,
      customer.state,
      customer.pincode,
    ];

    const matchesSearch = searchFields.some(value =>
      String(value || '')
        .toLowerCase()
        .includes(searchText)
    );

    const matchesCity =
      !cityFilter ||
      String(customer.city || '')
        .toLowerCase() === cityFilter.toLowerCase();

    const matchesState =
      !stateFilter ||
      String(customer.state || '')
        .toLowerCase() === stateFilter.toLowerCase();

    const matchesPincode =
      !pincodeFilter ||
      String(customer.pincode || '')
        .includes(pincodeFilter.trim());

    return (
      matchesSearch &&
      matchesCity &&
      matchesState &&
      matchesPincode
    );
  });

  // =====================================
  // Clear Search and Filters
  // =====================================

  function clearFilters() {
    setQuery('');
    setCityFilter('');
    setStateFilter('');
    setPincodeFilter('');
  }

  // =====================================
  // Render Customer Management
  // =====================================

  return (
    <div className="container-fluid px-3 px-lg-4 py-5">

      <h2 className="mb-3">
        Customer Management
      </h2>

      {/* Error Message */}
      {error && (
        <div
          className="alert alert-danger"
          role="alert"
        >
          {error}
        </div>
      )}

      {/* Success Message */}
      {message && (
        <div
          className="alert alert-success"
          role="status"
        >
          {message}
        </div>
      )}

      {/* =================================
          Add / Edit Customer Form
      ================================= */}

      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body p-4">

          <h4 className="mb-3">
            {editingId
              ? 'Edit Customer'
              : 'Add Customer'}
          </h4>

          <form onSubmit={save}>
            <div className="row g-3">

              {inputFields.map(field => (
                <div
                  className="col-md-6"
                  key={field.name}
                >

                  <label
                    className="form-label"
                    htmlFor={`customer-${field.name}`}
                  >
                    {field.label}
                  </label>

                  <input
                    id={`customer-${field.name}`}
                    name={field.name}
                    type={field.type}
                    className="form-control"
                    required={field.required || false}
                    maxLength={field.maxLength}
                    value={form[field.name]}
                    onChange={handleChange}
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                    inputMode={
                      field.name === 'pincode'
                        ? 'numeric'
                        : undefined
                    }
                    pattern={
                      field.name === 'pincode'
                        ? '([1-9][0-9]{5})?'
                        : undefined
                    }
                    title={
                      field.name === 'pincode'
                        ? 'Enter a valid 6-digit Indian PIN Code'
                        : undefined
                    }
                  />

                </div>
              ))}

              {/* Customer Status */}
              <div className="col-md-4">

                <label
                  htmlFor="customer-status"
                  className="form-label"
                >
                  Status
                </label>

                <select
                  id="customer-status"
                  name="status"
                  className="form-select"
                  value={form.status}
                  onChange={handleChange}
                >
                  <option value="lead">Lead</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>

              </div>

              {/* Notes */}
              <div className="col-12">

                <label
                  htmlFor="customer-notes"
                  className="form-label"
                >
                  Notes
                </label>

                <textarea
                  id="customer-notes"
                  name="notes"
                  rows={3}
                  maxLength={1000}
                  className="form-control"
                  value={form.notes}
                  onChange={handleChange}
                  placeholder="Enter customer notes"
                />

              </div>

              {/* Save Buttons */}
              <div className="col-12 d-flex gap-2">

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={busy}
                >
                  {busy
                    ? 'Saving...'
                    : editingId
                      ? 'Update Customer'
                      : 'Add Customer'}
                </button>

                {editingId && (
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={reset}
                    disabled={busy}
                  >
                    Cancel
                  </button>
                )}

              </div>

            </div>
          </form>

        </div>
      </div>

      {/* =================================
          Customer List and Search
      ================================= */}

      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3">

        <h4 className="mb-0">
          Customers ({customers.length})
        </h4>

        <input
          aria-label="Search customers"
          type="search"
          placeholder="Search name, email, address..."
          className="form-control"
          style={{ maxWidth: '320px' }}
          value={query}
          onChange={e => setQuery(e.target.value)}
        />

      </div>

      {/* =================================
          Location Filters
      ================================= */}

      <div className="card shadow-sm border-0 mb-3">
        <div className="card-body">

          <h5 className="mb-3">
            Filter Customers by Location
          </h5>

          <div className="row g-3">

            {/* City Filter */}
            <div className="col-md-3">

              <label
                htmlFor="filter-city"
                className="form-label"
              >
                City
              </label>

              <select
                id="filter-city"
                className="form-select"
                value={cityFilter}
                onChange={e =>
                  setCityFilter(e.target.value)
                }
              >
                <option value="">All Cities</option>

                {cities.map(city => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}

              </select>

            </div>

            {/* State Filter */}
            <div className="col-md-3">

              <label
                htmlFor="filter-state"
                className="form-label"
              >
                State
              </label>

              <select
                id="filter-state"
                className="form-select"
                value={stateFilter}
                onChange={e =>
                  setStateFilter(e.target.value)
                }
              >
                <option value="">All States</option>

                {states.map(state => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}

              </select>

            </div>

            {/* Pincode Filter */}
            <div className="col-md-3">

              <label
                htmlFor="filter-pincode"
                className="form-label"
              >
                Pincode
              </label>

              <input
                id="filter-pincode"
                type="text"
                inputMode="numeric"
                maxLength={6}
                className="form-control"
                placeholder="Enter Pincode"
                value={pincodeFilter}
                onChange={e =>
                  setPincodeFilter(e.target.value)
                }
              />

            </div>

            {/* Clear Filters */}
            <div className="col-md-3 d-flex align-items-end">

              <button
                type="button"
                className="btn btn-outline-secondary w-100"
                onClick={clearFilters}
              >
                Clear Filters
              </button>

            </div>

          </div>

        </div>
      </div>

      <p className="text-secondary small">
        Showing {results.length} of {customers.length} customers
      </p>

      {/* =================================
          Customer Table
      ================================= */}

      {loading ? (
        <p>Loading customers...</p>
      ) : (
        <div className="table-responsive bg-white rounded shadow-sm">

          <table className="table table-hover align-middle mb-0">

            <thead className="table-light">
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Company</th>
                <th>Address</th>
                <th>City</th>
                <th>State</th>
                <th>Pincode</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>

              {results.length === 0 ? (
                <tr>
                  <td
                    colSpan={10}
                    className="text-center py-4 text-secondary"
                  >
                    No customers found
                  </td>
                </tr>
              ) : (
                results.map(customer => (
                  <tr key={customer._id}>

                    {/* Customer Name */}
                    <td>{customer.name}</td>

                    {/* Email */}
                    <td>{customer.email}</td>

                    {/* Phone */}
                    <td>{customer.phone || '—'}</td>

                    {/* Company */}
                    <td>{customer.company || '—'}</td>

                    {/* Address */}
                    <td>{customer.address || '—'}</td>

                    {/* City */}
                    <td>{customer.city || '—'}</td>

                    {/* State */}
                    <td>{customer.state || '—'}</td>

                    {/* Pincode */}
                    <td>{customer.pincode || '—'}</td>

                    {/* Customer Status */}
                    <td>
                      <span className="badge text-bg-secondary text-capitalize">
                        {customer.status}
                      </span>
                    </td>

                    {/* Edit and Delete Buttons */}
                    <td className="text-nowrap">

                      <button
                        type="button"
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => edit(customer)}
                        disabled={busy}
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => remove(customer)}
                        disabled={busy}
                      >
                        Delete
                      </button>

                    </td>

                  </tr>
                ))
              )}

            </tbody>

          </table>

        </div>
      )}

    </div>
  );
}