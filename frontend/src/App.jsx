import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5100/providers";

function App() {
  const [providers, setProviders] = useState([]);
  const [form, setForm] = useState({ provider_name: "", interest_rate: "", max_loan_amount: "" });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      const res = await axios.get(API_URL);
      setProviders(res.data);
    } catch (err) {
      console.error("Failed to fetch providers", err);
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`${API_URL}/${editId}`, form);
        setEditId(null);
      } else {
        await axios.post(API_URL, form);
      }
      setForm({ provider_name: "", interest_rate: "", max_loan_amount: "" });
      fetchProviders();
    } catch (err) {
      console.error("Save failed", err);
    }
  };

  const handleEdit = (provider) => {
    setForm({
      provider_name: provider.provider_name ?? "",
      interest_rate: provider.interest_rate ?? "",
      max_loan_amount: provider.max_loan_amount ?? "",
    });
    setEditId(provider.id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchProviders();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-indigo-600 mb-8">
          Loan Providers
        </h1>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded-lg p-4 sm:p-6 mb-6 space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              name="provider_name"
              placeholder="Provider Name"
              value={form.provider_name}
              onChange={handleChange}
              required
              className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 w-full"
            />
            <input
              type="number"
              name="interest_rate"
              placeholder="Interest Rate"
              value={form.interest_rate}
              onChange={handleChange}
              onInput={(e) => {
              if (e.target.value.length > 5) {
                e.target.value = e.target.value.slice(0, 5);
              }
            }}
              required
              className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 w-full"
            />
            <input
              type="text"
              name="max_loan_amount"
              placeholder="Max Loan Amount"
              value={
                form.max_loan_amount
                  ? new Intl.NumberFormat().format(form.max_loan_amount)
                  : ""
              }
              onChange={(e) => {
                // remove commas and parse back to number
                const rawValue = e.target.value.replace(/,/g, "");
                if (!isNaN(rawValue)) {
                  setForm({ ...form, max_loan_amount: rawValue });
                }
              }}
              required
              className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 w-full"
            />

          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
            <button
              type="submit"
              className="w-full sm:w-auto px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              {editId ? "Update Provider" : "Add Provider"}
            </button>

            {editId && (
              <button
                type="button"
                onClick={() => {
                  setEditId(null);
                  setForm({ provider_name: "", interest_rate: "", max_loan_amount: "" });
                }}
                className="w-full sm:w-auto px-5 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* Desktop table (md+) */}
        <div className="hidden md:block overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="w-full text-left border-collapse">
            <thead className="bg-indigo-600 text-white">
              <tr>
                <th className="p-3">ID</th>
                <th className="p-3">Provider Name</th>
                <th className="p-3">Interest Rate</th>
                <th className="p-3">Max Loan Amount</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {providers.map((p, idx) => (
                <tr key={p.id} className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                  <td className="p-3 align-top">{p.id}</td>
                  <td className="p-3 align-top">{p.provider_name}</td>
                  <td className="p-3 align-top">{p.interest_rate}%</td>
                  <td className="p-3 align-top">
                    ${new Intl.NumberFormat().format(p.max_loan_amount)}
                  </td>
                  <td className="p-3 text-center">
                    <div className="inline-flex gap-2">
                      <button
                        onClick={() => handleEdit(p)}
                        className="px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"
                        aria-label={`Edit ${p.provider_name}`}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                        aria-label={`Delete ${p.provider_name}`}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {providers.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-4 text-center text-gray-500">
                    No providers found. Add one above.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile cards (smaller screens) */}
        <div className="md:hidden space-y-4">
          {providers.map((p) => (
            <div key={p.id} className="bg-white p-4 rounded-lg shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1 pr-3">
                  <div className="text-xs text-gray-500">ID #{p.id}</div>
                  <div className="font-semibold text-lg">{p.provider_name}</div>
                  <div className="text-sm text-gray-600 mt-1">
                    Interest: <span className="font-medium">{p.interest_rate}%</span>
                  </div>
                  <div className="text-sm text-gray-600">
                  Max Loan:{" "}
                  <span className="font-medium">
                    ${new Intl.NumberFormat().format(p.max_loan_amount)}
                  </span>
                </div>

                </div>

                <div className="ml-2 flex flex-col gap-2">
                  <button
                    onClick={() => handleEdit(p)}
                    className="px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500 text-sm"
                    aria-label={`Edit ${p.provider_name}`}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                    aria-label={`Delete ${p.provider_name}`}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}

          {providers.length === 0 && (
            <div className="bg-white p-4 rounded-lg shadow text-center text-gray-500">
              No providers found. Add one above.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
