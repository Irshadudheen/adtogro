import React, { useContext, useState } from 'react'
import { LiveCountContext } from "@/context/LiveCountContext"
import AnalyticsContext from '@/context/analaticsState/analaticsState';
import { ArrowDown, ArrowUp, Calendar, ChevronDown, Clock, TrendingUp, User } from 'lucide-react';
import { 
  LineChart, Line,  BarChart,  Bar,  PieChart,  Pie,  Cell, XAxis,   YAxis,  CartesianGrid,  Tooltip,  Legend,  ResponsiveContainer 
} from 'recharts';
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
function AnalyticsDashBoard() {
    const liveCount = useContext(LiveCountContext)
    const [dateRange, setDateRange] = useState('Last 7 days');
    const analyticsDataState = useContext(AnalyticsContext);
    const platformData = [
  { name: 'Desktop', value: 400 },
  { name: 'Mobile', value: 300 },
  { name: 'Tablet', value: 100 },
];
  return (
    <>
   
              {/* Header */}
              <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Analytics Dashboard</h1>
                
                <div className="flex items-center">
                  <div className="relative w-full md:w-auto">
                    <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm text-gray-700 w-full md:w-auto">
                      <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                      <span>{dateRange}</span>
                      <ChevronDown className="w-4 h-4 ml-2 text-gray-500" />
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>Today</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-800">{analyticsDataState?analyticsDataState.daily[analyticsDataState.daily.length-1].clicks:0}</div>
                  <div className="text-sm font-medium mt-1">Total Clicks</div>
                  <div className="flex items-center text-sm font-medium text-green-600 mt-2">
                    <ArrowUp className="w-4 h-4 mr-1" />
                    <span>12.5% from yesterday</span>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <User className="w-4 h-4 mr-1" />
                    <span>Today</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-800">{analyticsDataState?analyticsDataState.daily[analyticsDataState.daily.length-1].impressions:0}</div>
                  <div className="text-sm font-medium mt-1">Total Impressions</div>
                  <div className="flex items-center text-sm font-medium text-green-600 mt-2">
                    <ArrowUp className="w-4 h-4 mr-1" />
                    <span>8.2% from yesterday</span>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    <span>Today</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-800">{analyticsDataState?analyticsDataState.todayCtr:0}%</div>
                  <div className="text-sm font-medium mt-1">CTR</div>
                  <div className="flex items-center text-sm font-medium text-red-600 mt-2">
                    <ArrowDown className="w-4 h-4 mr-1" />
                    <span>1.8% from yesterday</span>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <div className="w-2 h-2 mx-1 bg-green-500 rounded-full custom-pulse"></div>
                    <span>Live</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-800">{liveCount}</div>
                  <div className="text-sm font-medium mt-1">Users</div>
                  <div className="flex items-center text-sm font-medium text-green-600 mt-2">
                    <ArrowUp className="w-4 h-4 mr-1" />
                    <span>15.3% from yesterday</span>
                  </div>
                </div>
              </div>
              
              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
                <div className="lg:col-span-2 bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Click Performance</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={analyticsDataState&&analyticsDataState.daily}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="clicks"
                          stroke="#3B82F6"
                          activeDot={{ r: 8 }}
                        />
                        <Line type="monotone" dataKey="impressions" stroke="#10B981" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <div className="lg:col-span-2 bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Platform Distribution</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={analyticsDataState&&analyticsDataState.totalByDevice}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={90}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ _id, percent }) => `${_id.charAt(0).toUpperCase() + _id.slice(1)} ${(percent * 100).toFixed(0)}%`}
                        >
                          {platformData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
              
              
            
    </>
  )
}

export default AnalyticsDashBoard
