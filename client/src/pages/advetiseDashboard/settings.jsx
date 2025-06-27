import React from 'react'

function SettingsAdvertise() {
  return (
    <>
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
    </>
  )
}

export default SettingsAdvertise
