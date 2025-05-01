import { useState } from 'react';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { 
  Home, 
  BarChart2, 
  Edit3, 
  Settings, 
  User, 
  Clock, 
  DollarSign, 
  TrendingUp, 
  ChevronDown, 
  Calendar, 
  ArrowUp, 
  ArrowDown,
  MoreVertical,
  Eye,
  Pause,
  Edit,
  Trash2,
  Menu,
  X
} from 'lucide-react';

// Sample data
const analyticsData = [
  { name: 'Jan', clicks: 4000, impressions: 2400, ctr: 2.5 },
  { name: 'Feb', clicks: 3000, impressions: 1398, ctr: 3.2 },
  { name: 'Mar', clicks: 2000, impressions: 9800, ctr: 1.9 },
  { name: 'Apr', clicks: 2780, impressions: 3908, ctr: 4.5 },
  { name: 'May', clicks: 1890, impressions: 4800, ctr: 2.8 },
  { name: 'Jun', clicks: 2390, impressions: 3800, ctr: 3.7 },
  { name: 'Jul', clicks: 3490, impressions: 4300, ctr: 2.3 },
];

const platformData = [
  { name: 'Desktop', value: 400 },
  { name: 'Mobile', value: 300 },
  { name: 'Tablet', value: 100 },
];

const advertisements = [
  { id: 1, name: 'Summer Sale Banner', clicks: 1245, impressions: 45023, ctr: 2.76, status: 'active' },
  { id: 2, name: 'New Product Launch', clicks: 876, impressions: 32450, ctr: 2.7, status: 'active' },
  { id: 3, name: 'Holiday Special', clicks: 542, impressions: 21560, ctr: 2.5, status: 'paused' },
  { id: 4, name: 'End of Season', clicks: 320, impressions: 18790, ctr: 1.7, status: 'ended' },
  { id: 5, name: 'Limited Offer', clicks: 968, impressions: 28450, ctr: 3.4, status: 'active' },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function AdvertiserDashboard() {
  const [activeTab, setActiveTab] = useState('analytics');
  const [dateRange, setDateRange] = useState('Last 7 days');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header with Menu Button */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200">
        <button 
          onClick={toggleSidebar}
          className="text-gray-600 focus:outline-none"
        >
          <Menu className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-semibold text-gray-800">Ad Dashboard</h2>
        <div className="w-6"></div> {/* Empty div for flex spacing */}
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={closeSidebar}
        ></div>
      )}

      {/* Dashboard Layout */}
      <div className="flex">
        {/* Sidebar - Hidden on mobile by default, shown when sidebarOpen=true */}
        <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:z-auto`}>
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Ad Dashboard</h2>
            <button 
              onClick={closeSidebar}
              className="text-gray-600 md:hidden focus:outline-none"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <nav className="mt-6">
            <button 
              onClick={() => {
                setActiveTab('analytics');
                closeSidebar();
              }}
              className={`flex items-center px-6 py-3 w-full ${activeTab === 'analytics' ? 'bg-blue-50 text-black border-l-4 border-black' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <BarChart2 className="w-5 h-5 mr-3" />
              <span className="text-sm font-medium">Analytics</span>
            </button>
            
            <button 
              onClick={() => {
                setActiveTab('advertisements');
                closeSidebar();
              }}
              className={`flex items-center px-6 py-3 w-full ${activeTab === 'advertisements' ? 'bg-blue-50 text-black border-l-4 border-black' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <Edit3 className="w-5 h-5 mr-3" />
              <span className="text-sm font-medium">Advertisements</span>
            </button>
            
            <button 
              onClick={() => {
                setActiveTab('settings');
                closeSidebar();
              }}
              className={`flex items-center px-6 py-3 w-full ${activeTab === 'settings' ? 'bg-blue-50 text-black border-l-4 border-black' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <Settings className="w-5 h-5 mr-3" />
              <span className="text-sm font-medium">Settings</span>
            </button>
          </nav>
        </div>
        
        {/* Main Content - Full width on mobile, adjusted width on desktop */}
        <div className="w-full  p-4 md:p-4">
          {activeTab === 'analytics' && (
            <div>
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
                  <div className="text-2xl font-bold text-gray-800">3,549</div>
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
                  <div className="text-2xl font-bold text-gray-800">12,984</div>
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
                  <div className="text-2xl font-bold text-gray-800">3.2%</div>
                  <div className="text-sm font-medium mt-1">CTR</div>
                  <div className="flex items-center text-sm font-medium text-red-600 mt-2">
                    <ArrowDown className="w-4 h-4 mr-1" />
                    <span>1.8% from yesterday</span>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <DollarSign className="w-4 h-4 mr-1" />
                    <span>Today</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-800">$682.5</div>
                  <div className="text-sm font-medium mt-1">Revenue</div>
                  <div className="flex items-center text-sm font-medium text-green-600 mt-2">
                    <ArrowUp className="w-4 h-4 mr-1" />
                    <span>15.3% from yesterday</span>
                  </div>
                </div>
              </div>
              
              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div className="lg:col-span-2 bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Click Performance</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={analyticsData}
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
                
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Platform Distribution</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={platformData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
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
              
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="flex justify-between items-center p-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800">Top Performing Advertisements</h3>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clicks</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Impressions</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CTR</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {advertisements.map(ad => (
                        <tr key={ad.id}>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{ad.name}</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{ad.clicks.toLocaleString()}</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{ad.impressions.toLocaleString()}</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{ad.ctr}%</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${ad.status === 'active' ? 'bg-green-100 text-green-800' : 
                                ad.status === 'paused' ? 'bg-yellow-100 text-yellow-800' : 
                                'bg-red-100 text-red-800'}`}>
                              {ad.status.charAt(0).toUpperCase() + ad.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex space-x-2">
                              <button className="text-gray-400 hover:text-blue-600">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="text-gray-400 hover:text-blue-600">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button className="text-gray-400 hover:text-red-600">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'advertisements' && (
            <div>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-4 sm:mb-0">Manage Advertisements</h1>
                
                <button className="px-4 py-2 bg-black text-white rounded-md shadow-sm hover:bg-gray-800 w-full sm:w-auto">
                  Create New Ad
                </button>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                {/* Mobile view: Stacked cards for data */}
                <div className="block sm:hidden">
                  {advertisements.map(ad => (
                    <div key={ad.id} className="p-4 border-b border-gray-200">
                      <div className="flex justify-between mb-2">
                        <div className="text-sm font-medium text-gray-900">{ad.name}</div>
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${ad.status === 'active' ? 'bg-green-100 text-green-800' : 
                            ad.status === 'paused' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-red-100 text-red-800'}`}>
                          {ad.status.charAt(0).toUpperCase() + ad.status.slice(1)}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        <div>
                          <div className="text-xs text-gray-500">Clicks</div>
                          <div className="text-sm font-medium">{ad.clicks.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Impressions</div>
                          <div className="text-sm font-medium">{ad.impressions.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">CTR</div>
                          <div className="text-sm font-medium">{ad.ctr}%</div>
                        </div>
                      </div>
                      <div className="flex justify-end space-x-3">
                        <button className="text-gray-400 hover:text-blue-600">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-gray-400 hover:text-yellow-600">
                          <Pause className="w-4 h-4" />
                        </button>
                        <button className="text-gray-400 hover:text-blue-600">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="text-gray-400 hover:text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Desktop view: Table */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clicks</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Impressions</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CTR</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {advertisements.map(ad => (
                        <tr key={ad.id}>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{ad.name}</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{ad.clicks.toLocaleString()}</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{ad.impressions.toLocaleString()}</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{ad.ctr}%</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${ad.status === 'active' ? 'bg-green-100 text-green-800' : 
                                ad.status === 'paused' ? 'bg-yellow-100 text-yellow-800' : 
                                'bg-red-100 text-red-800'}`}>
                              {ad.status.charAt(0).toUpperCase() + ad.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex space-x-3">
                              <button className="text-gray-400 hover:text-blue-600">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="text-gray-400 hover:text-yellow-600">
                                <Pause className="w-4 h-4" />
                              </button>
                              <button className="text-gray-400 hover:text-blue-600">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button className="text-gray-400 hover:text-red-600">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 py-3 bg-gray-50 border-t border-gray-200">
                  <div className="mb-3 sm:mb-0">
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">1</span> to <span className="font-medium">5</span> of <span className="font-medium">15</span> results
                    </p>
                  </div>
                  <div className="flex justify-between sm:justify-end">
                    <button className="px-4 py-2 mx-1 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">Previous</button>
                    <button className="px-4 py-2 mx-1 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">Next</button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'settings' && (
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-6">Settings</h1>
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">Account Settings</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input type="email" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" defaultValue="user@example.com" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                      <input type="password" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" defaultValue="********" />
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">Notification Settings</h2>
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div className="mb-2 sm:mb-0">
                        <h3 className="text-sm font-medium text-gray-700">Email Notifications</h3>
                        <p className="text-sm text-gray-500">Receive email updates about your campaign performance</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer mt-2 sm:mt-0">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                      </label>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div className="mb-2 sm:mb-0">
                        <h3 className="text-sm font-medium text-gray-700">SMS Notifications</h3>
                        <p className="text-sm text-gray-500">Receive text messages for important alerts</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer mt-2 sm:mt-0">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:justify-end">
                  <button className="mb-2 sm:mb-0 sm:mr-3 px-4 py-2 bg-gray-200 text-gray-800 rounded-md shadow-sm hover:bg-gray-300 w-full sm:w-auto">Cancel</button>
                  <button className="px-4 py-2 bg-black text-white rounded-md shadow-sm hover:bg-gray-800 w-full sm:w-auto">Save Changes</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}