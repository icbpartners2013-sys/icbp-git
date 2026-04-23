import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface Service {
  id: number;
  name: string;
  category: string;
  description: string;
  price: string;
  is_active: boolean;
}

export default function ProductsManagement() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Personal');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [editId, setEditId] = useState<number | null>(null);

  const fetchServices = async () => {
    try {
      const res = await axios.get(`${API_URL}/base/api/services/`);
      setServices(res.data);
    } catch (err) {
      console.error("Failed to fetch services", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { name, category, description, price, is_active: isActive, tenant: 1 }; // Tenant hardcoded for demo
    
    try {
      if (editId) {
        await axios.put(`${API_URL}/base/api/services/${editId}/`, payload);
      } else {
        await axios.post(`${API_URL}/base/api/services/`, payload);
      }
      resetForm();
      fetchServices();
    } catch (err) {
      console.error("Failed to save service", err);
    }
  };

  const handleEdit = (srv: Service) => {
    setEditId(srv.id);
    setName(srv.name);
    setCategory(srv.category);
    setDescription(srv.description);
    setPrice(srv.price);
    setIsActive(srv.is_active);
  };

  const handleDelete = async (id: number) => {
    if(confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`${API_URL}/base/api/services/${id}/`);
        fetchServices();
      } catch (err) {
        console.error("Failed to delete service", err);
      }
    }
  };

  const resetForm = () => {
    setEditId(null);
    setName('');
    setCategory('Personal');
    setDescription('');
    setPrice('');
    setIsActive(true);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column: Form */}
      <div className="lg:col-span-1">
        <div className="bg-white shadow-md rounded-xl p-6 border border-gray-100 sticky top-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">{editId ? 'Edit Product' : 'Add New Product'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Product Name</label>
              <input type="text" required value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 focus:ring-icbp-blue-500 focus:border-icbp-blue-500" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select value={category} onChange={e => setCategory(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 focus:ring-icbp-blue-500 focus:border-icbp-blue-500">
                <option value="Personal">Personal Accounting</option>
                <option value="Business">Business Accounting</option>
                <option value="CIPC">CIPC Services</option>
                <option value="Advisory">Advisory & Audit</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Price (ZAR/USD)</label>
              <input type="number" step="0.01" required value={price} onChange={e => setPrice(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 focus:ring-icbp-blue-500 focus:border-icbp-blue-500" placeholder="0.00" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea rows={3} value={description} onChange={e => setDescription(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 focus:ring-icbp-blue-500 focus:border-icbp-blue-500"></textarea>
            </div>

            <div className="flex items-center">
              <input type="checkbox" checked={isActive} onChange={e => setIsActive(e.target.checked)} className="h-4 w-4 text-icbp-blue-600 focus:ring-icbp-blue-500 border-gray-300 rounded" />
              <label className="ml-2 block text-sm text-gray-700">Active (Visible in Shop)</label>
            </div>

            <div className="flex gap-2 pt-2">
              <button type="submit" className="flex-1 bg-icbp-blue-600 text-white py-2 rounded-lg font-bold shadow-md hover:bg-icbp-blue-700 transition">{editId ? 'Update' : 'Create'}</button>
              {editId && <button type="button" onClick={resetForm} className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-bold shadow-sm hover:bg-gray-300 transition">Cancel</button>}
            </div>
          </form>
        </div>
      </div>

      {/* Right Column: List */}
      <div className="lg:col-span-2">
        <div className="bg-white shadow-md rounded-xl p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Product Catalog</h2>
          {loading ? (
            <p className="text-gray-500">Loading products...</p>
          ) : services.length === 0 ? (
            <p className="text-gray-500 italic">No products found. Add one on the left.</p>
          ) : (
            <div className="space-y-4">
              {services.map(srv => (
                <div key={srv.id} className={`flex justify-between items-center p-4 rounded-lg border ${srv.is_active ? 'border-gray-200 bg-gray-50' : 'border-red-100 bg-red-50/30 opacity-75'}`}>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-800 text-lg">{srv.name}</span>
                      {!srv.is_active && <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded font-bold">INACTIVE</span>}
                    </div>
                    <div className="text-sm text-gray-500 mt-1"><span className="font-semibold text-icbp-blue-600">{srv.category}</span> • {srv.description.substring(0, 80)}{srv.description.length > 80 ? '...' : ''}</div>
                  </div>
                  <div className="text-right ml-4 flex flex-col items-end">
                    <span className="text-xl font-bold text-green-600">${parseFloat(srv.price).toFixed(2)}</span>
                    <div className="flex gap-2 mt-2">
                      <button onClick={() => handleEdit(srv)} className="text-xs bg-white border border-gray-300 px-3 py-1 rounded hover:bg-gray-100 font-medium">Edit</button>
                      <button onClick={() => handleDelete(srv.id)} className="text-xs bg-red-50 text-red-600 border border-red-200 px-3 py-1 rounded hover:bg-red-100 font-medium">Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
