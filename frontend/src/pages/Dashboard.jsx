import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom'
import { PenBox, Trash2 } from "lucide-react";

import { ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid, } from 'recharts'

export default function Dashboard() {
  const [data, setData] = useState({
    type: "income",
    category: "",
    amount: "",
    description: "",
    date: ""
  });
  const[loading,setLoading] = useState(false)
  const[query,setQuery] = useState("");
  const[searchData,setSearchData ] = useState([])

  const [weekHistory, setWeekHistory] = useState([])


  const [editId, setEditId] = useState(null);
  const [editMode, setEditmode] = useState({
    type: "income",
    category: "",
    amount: "",
    description: "",
    date: ""
  });


  const [transaction, setTransaction] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    
    const fetchAll = async () => {
      await Promise.all([fetchTransactions(), fetchWeekHistory()]);
    };

    fetchAll();
  }, [token, navigate]);


  //search and filter
  
  useEffect(()=>{
   const fetchSearchData = async()=>{
    try {
       if (!query || query.trim() === "") {
        setSearchData([]);
        return;
      }
      setLoading(true)
      const res = await axios.get(`http://localhost:5000/api/auth/search?q=${query}`,{
        headers:{
          Authorization:`Bearer ${token}`
        }
        
      })
      setSearchData(Array.isArray(res.data)?res.data:[])
    } catch (error) {
      console.log(error)
    } finally{
      setLoading(false);
    }
   }
  const debounce = setTimeout(() => {
    fetchSearchData()
  }, 400);
   return () => clearTimeout(debounce); 
  },[token,query])
  


  //   fetch all transactions
  const fetchTransactions = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/auth/getAll', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setTransaction(res.data);
    } catch (error) {
      console.error(error);
    };
  };

  // fetch week history
  const fetchWeekHistory = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/auth/getWeekly', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setWeekHistory(res.data)
      console.log(res.data)
    } catch (error) {
      console.error(error)
    }
  }





  // add new transaction
  const addTransaction = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/addTransaction', data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setData({
        type: "",
        category: "",
        amount: "",
        description: "",
        date: "",

      });
      fetchTransactions()
      fetchWeekHistory()
    } catch (error) {
      console.error(error)
    };
  };

  // update transaction 
  const updateTransactionn = async (e) => {
    e.preventDefault();
    try {
      if (!editId) return;
      const res = await axios.put(`http://localhost:5000/api/auth/update/${editId}`, editMode, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setEditId(null);
      setEditmode({
        type: "income",
        category: "",
        amount: "",
        description: "",
        date: "",
      });
      if (res.status === 200) {

        fetchTransactions();
        alert("transaction updated successfully!")
      }
    } catch (error) {
      console.error(error)
    }
  }

  // delete transaction 

  const deleteTransaction = async (id) => {
    try {
      const res = await axios.delete(`http://localhost:5000/api/auth/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      fetchTransactions()
    } catch (error) {
      console.error(error)
    };
  };

  // logout function 

  const handleLogout = () => {
    localStorage.removeItem("token");
    alert("logout successful")
    navigate('/login')
  }


  return (
    // Softer background and base text color
    <div className='min-h-screen bg-gray-50 p-6 sm:p-12 text-gray-900'>
      <div className='max-w-6xl mx-auto'>
        <div className='flex justify-between items-center mb-8'>
          <h1 className='text-3xl font-bold text-gray-900'>Personal Finance Dashboard</h1>

          <button
            onClick={handleLogout}
            // Standardized rounding and focus rings
            className='bg-red-600 text-white px-5 py-2.5 rounded-md font-semibold shadow-sm hover:bg-red-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2'
          >
            Logout
          </button>
        </div>

        {/* search task */}
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        🔍 Search Transactions
      </h2>

      <input
        type="text"
        placeholder="Search by type, category, or date..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="border border-gray-300 rounded-lg p-2 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : searchData.length > 0 ? (
        <ul className="divide-y divide-gray-200">
          {searchData.map((item) => (
            <li
              key={item._id}
              className="py-3 px-2 bg-white shadow-sm rounded-md mb-2 hover:bg-gray-100 transition"
            >
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-800 capitalize">
                  {item.category}
                </span>
                <span
                  className={`${
                    item.type === "income"
                      ? "text-green-600"
                      : "text-red-600"
                  } font-semibold`}
                >
                  ₹{item.amount}
                </span>
              </div>
              <div className="text-sm text-gray-500 flex justify-between mt-1">
                <span>{item.type}</span>
                <span>{item.date}</span>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        query.trim() && <p className="text-gray-500">No results found.</p>
      )}
        {/* add transaction */}
        {/* Softer shadow, consistent padding and rounding */}
        <form className='bg-white p-6 rounded-lg shadow-md mb-8' onSubmit={addTransaction}>
          <h2 className='text-2xl font-semibold text-gray-800 mb-6'>Add New Transaction</h2>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>

            <select
              // Cleaner input style: no shadow, subtle border, rounded-md, consistent padding
              className='w-full border border-gray-300 p-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-700'
              value={data.type}
              onChange={(e) => { setData({ ...data, type: e.target.value }) }}
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>

            <input
              type='text'
              placeholder='Category (e.g. Food, Salary)'
              // Consistent input styles
              className='w-full border border-gray-300 p-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-700 placeholder-gray-400'
              value={data.category}
              onChange={(e) => setData({ ...data, category: e.target.value })}
            />

            <input
              type='number'
              placeholder='Amount'
              // Consistent input styles
              className='w-full border border-gray-300 p-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-700 placeholder-gray-400'
              value={data.amount}
              onChange={(e) => setData({ ...data, amount: e.target.value })}
            />

            <input
              type='date'
              placeholder='Date'
              // Consistent input styles
              className='w-full border border-gray-300 p-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-700'
              value={data.date}
              onChange={(e) => setData({ ...data, date: e.target.value })}
            />

            <input
              type='text'
              placeholder='Description'
              // Consistent input styles, spanning two columns
              className='w-full border border-gray-300 p-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-700 placeholder-gray-400 md:col-span-2'
              value={data.description}
              onChange={(e) => setData({ ...data, description: e.target.value })}
            />
          </div>


          <button
            type="submit"
            // Consistent button styles (rounded-md)
            className="mt-6 w-full bg-blue-600 text-white px-6 py-3 rounded-md font-semibold shadow-sm hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Add Transaction
          </button>
        </form>

        {/* update form */}
        {editId && (
          <div className='bg-white p-6 rounded-lg shadow-md mb-8'>
            <h2 className='text-2xl font-semibold text-gray-800 mb-6'>Update Transaction</h2>
            <form onSubmit={updateTransactionn}>
              {/* Using the same grid layout as the "Add" form */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <select
                  value={editMode.type || "income"}
                  onChange={(e) => setEditmode({ ...editMode, type: e.target.value })}
                  // Classes now match the "Add" form inputs
                  className="w-full border border-gray-300 p-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-700"
                >
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>


                <input type='text'
                  placeholder='Category'
                  value={editMode.category || ""}
                  onChange={(e) => setEditmode({ ...editMode, category: e.target.value })}
                  // Classes now match the "Add" form inputs
                  className='w-full border border-gray-300 p-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-700 placeholder-gray-400'
                />

                <input type='number'
                  placeholder='Amount'
                  value={editMode.amount || ""}
                  onChange={(e) => setEditmode({ ...editMode, amount: e.target.value })}
                  // Classes now match the "Add" form inputs
                  className='w-full border border-gray-300 p-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-700 placeholder-gray-400'
                />

                <input type='date'
                  placeholder='Date'
                  value={editMode.date || ""}
                  onChange={(e) => setEditmode({ ...editMode, date: e.target.value })}
                  // Classes now match the "Add" form inputs
                  className='w-full border border-gray-300 p-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-700'
                />

                <input type='text'
                  placeholder='Description'
                  value={editMode.description || ""}
                  onChange={(e) => setEditmode({ ...editMode, description: e.target.value })}
                  // Classes now match the "Add" form inputs
                  className='w-full border border-gray-300 p-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-700 placeholder-gray-400 md:col-span-2'
                />
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-5 py-2 rounded-md font-medium hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Save Changes
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setEditId(null);
                    setEditmode({
                      type: "income",
                      category: "",
                      amount: "",
                      description: "",
                      date: "",
                    });
                  }}
                  className="bg-gray-200 text-gray-800 px-5 py-2 rounded-md font-medium hover:bg-gray-300 transition focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                >
                  Cancel
                </button>
              </div>

            </form>
          </div>
        )}

        {/* transaction list  */}
        <div className='bg-white p-6 rounded-lg shadow-md mb-8'>
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Your Transactions</h2>
          {transaction.length === 0 ? (
            <p className='text-gray-500 text-center py-10'>No transactions yet.</p>
          ) : (
            // This table styling was already good. Keeping it.
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className='min-w-full divide-y divide-gray-200'>

                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>

                <tbody className="bg-white divide-y divide-gray-200">
                  {transaction.map((t) => (
                    <tr key={t._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 capitalize">{t.type}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{t.category}</td>

                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${t.type === 'income' ? 'text-green-600' : 'text-red-600'
                        }`}>
                        {t.type === 'income' ? '+' : '−'}₹{t.amount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{t.date?.slice(0, 10)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 max-w-xs truncate" title={t.description}>{t.description}</td>

                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className='flex gap-4 justify-end'>
                          <button
                            onClick={() => deleteTransaction(t._id)}
                            className="text-red-600 hover:text-red-800 transition-colors duration-150"
                            title="Delete"
                          >
                            <Trash2 size={18}></Trash2>
                          </button>
                          <button onClick={() => {
                            setEditId(t._id); setEditmode({
                              // BUG FIX: Should be t.type, not hardcoded "income"
                              type: t.type,
                              category: t.category,
                              amount: t.amount,
                              description: t.description,
                              // BUG FIX: Should be t.date (and formatted), not t.data
                              date: t.date ? t.date.slice(0, 10) : "",
                            })
                          }}
                            // Changed color to blue for "edit" to differentiate from "delete"
                            className='text-blue-600 hover:text-blue-800 transition-colors duration-150'
                            title="Edit"
                          >
                            <PenBox size={18}></PenBox>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* weekly charts data */}

   <div className="w-full bg-white shadow-md rounded-lg p-6 mt-8">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Weekly Income vs Expense
      </h2>

      {Array.isArray(weekHistory) && weekHistory.length > 0 ? (
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart
            data={weekHistory}
            margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis dataKey="day" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />

            {/* Income as Bar */}
            <Bar
              dataKey="totalIncome"
              name="Income"
              fill="#4ade80"
              barSize={40}
              radius={[6, 6, 0, 0]}
            />

            {/* Expense as Line */}
            <Line
              type="monotone"
              dataKey="totalExpense"
              name="Expense"
              stroke="#ef4444"
              strokeWidth={3}
              dot={{ r: 5 }}
              activeDot={{ r: 7 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-40">
          <p className="text-gray-500">Loading chart data...</p>
        </div>
      )}
    </div>



      </div>
    </div>


  )
}