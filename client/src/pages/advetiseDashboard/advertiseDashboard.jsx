import { useContext, useEffect, useState } from 'react';
import './style.css'
import { motion, AnimatePresence } from "framer-motion"
import razorpayPayment from '@/utils/razorpay';
import { BarChart2, Edit3, Settings, ArrowUp, ArrowDown, Edit, Menu, X, ThumbsUp,} from 'lucide-react';
import RenewalModal from '../../components/renewalModal';
import { advertisementsApiCall, fetchLatestPerformance, PerformanceCall } from '../../Api/analytics';
import Editadveritse from '../../components/editModal/editadveritse';
import { useNavigate } from 'react-router-dom';
import { renewOrderCreate } from '../../Api/order';
import { renewAd, updateAdvertise } from '../../Api/advertise';
import AnalyticsDashBoard from './analytics';
import SettingsAdvertise from './settings';


export default function AdvertiserDashboard() {
  const navigate = useNavigate()
  const [advertiseId,setAdvertiseId] = useState()
  const [editModal,setEditModal]=useState(false)
  const [Title,setTitle] = useState('Latest Performance')
  const [advertisements, setAdvertisements] = useState([]);
  const [expanded, setExpanded] = useState(false)
  const [isRenewalModalOpen, setIsRenewalModalOpen] = useState(false)
  const [EditAdData,setEditAdData] = useState()
  const [latestPerformance, setLatestPerformance] = useState()
  const [activeTab, setActiveTab] = useState('advertisements');

  const [sidebarOpen, setSidebarOpen] = useState(false);
 
  function toTop(){
     window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }
   useEffect(() => {
   toTop()
  }, []);
  const fetchAdvertisements = async () => {
      try {
        const advertisementsData = await advertisementsApiCall();
        console.log(advertisementsData, 'the advertisements data');
        setAdvertisements(advertisementsData);
      } catch (error) {
        console.error('Error fetching advertisements:', error);
      }
    };
    const ApiCallFetchPerformance = async (id) =>{
      try {
        toTop()
        if(id){
          console.log('latest '+id+'hi')
          setAdvertiseId(id)
          const performanceData = await PerformanceCall(id)
          setTitle('Performance - '+performanceData.latestPerformance.companyName)
          setLatestPerformance(performanceData)
        }else{

          const latestPerformanceData = await fetchLatestPerformance()
          setAdvertiseId(latestPerformanceData?.latestPerformance.id)
          setLatestPerformance(latestPerformanceData)
         
          console.log(latestPerformanceData)
        }
      } catch (error) {
        throw error
      }
    }
  useEffect(()=>{
    
fetchAdvertisements();
    
    ApiCallFetchPerformance()
  },[])
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
const handleEdit = async (data)=>{
  try {
    console.log(data,'to edit')
   const res= await updateAdvertise(data,data.id)
   console.log('edited advertise',res)
   ApiCallFetchPerformance(res.advertise.id)

  } catch (error) {
    
  }
}
const handleRenewal = async(plan, amount,Idadvertise) => {
    console.log(`Renewing with ${plan} plan for $${amount}`)
    console.log(advertiseId)
  const res= await renewOrderCreate(plan,Idadvertise)
  const {response,orderId}= await razorpayPayment(res,'renew',Idadvertise)
 const newData= await renewAd(orderId,Idadvertise)
 console.log(newData,'the res from renewal')
 if(newData){

   ApiCallFetchPerformance(Idadvertise)
 }
  
    // Add your renewal logic here
    // This could include API calls, payment processing, etc.
  }
  const  handleEditModal = (data)=>{
try {
  console.log(data,'hello')
  setEditAdData(data)
  setEditModal(true)
} catch (error) {
  console.log(error)
}
  }
  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 overflow-auto">
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
          className="fixed inset-0  bg-opacity-50 z-30 md:hidden"
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
                setActiveTab('advertisements');
                closeSidebar();
              }}
              className={`flex items-center px-6 py-3 w-full ${activeTab === 'advertisements' ? 'bg-blue-50 text-black border-l-4 border-black' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <Edit3 className="w-5 h-5 mr-3"  />
              <span className="text-sm font-medium">Advertisements</span>
            </button>
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
        <div className="w-full  p-4 md:p-4 ">
          {activeTab === 'analytics' && (
          <AnalyticsDashBoard/>
          )}
          
          {activeTab === 'advertisements' && (
            <div>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-4 sm:mb-0">Manage Advertisements</h1>
                
               
              </div>
                 <div className=" flex gap-4  flex-col sm:flex-row sm:items-start">
  <div className="bg-white border border-gray-300 text-black sm:max-w-md w-full rounded-lg mb-10">
    <h1 className='font-bold text-xl px-5 py-4'>{Title}</h1>
    <div className="w-3/4 relative mb-2 mx-auto ">
      <img  className='w-full rounded-lg '  draggable={false}  src={latestPerformance?.latestPerformance.orginalImage}   />
     { <AnimatePresence>
            {latestPerformance?.expired && (
              <motion.div
                className="absolute inset-0 bg-[rgba(0,0,0,0.4)] rounded flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="text-red-600 text-4xl font-bold border-4 border-red-600 px-4 py-2 bg-white/10 backdrop-blur-sm"
                  initial={{
                    scale: 0,
                    rotate: -20,
                    opacity: 0,
                  }}
                  animate={{
                    scale: [0, 1.2, 1],
                    rotate: -20,
                    opacity: [0, 1, 1],
                  }}
                  exit={{
                    scale: 0,
                    rotate: -20,
                    opacity: 0,
                  }}
                  transition={{
                    duration: 0.6,
                    ease: "easeOut",
                    times: [0, 0.6, 1],
                  }}
                  whileHover={{
                    scale: 1.05,
                    transition: { duration: 0.2 },
                  }}
                >
                  EXPIRED
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>}
    </div>
    <div className="p-5 flex justify-between">
 <div className='flex items-center'><BarChart2 className="w-5 h-5 mr-3" /> {latestPerformance?.latestPerformance.impressions}</div> 
 <div className="flex items-center"><ThumbsUp className="w-5 h-5 mr-3 ml-4" /> {latestPerformance?.latestPerformance.clicks}</div> 
 <div className="flex items-center "><span className='font-bold mr-3'>CTR </span>{latestPerformance?.ctr}%</div> 
  <button onClick={() => setExpanded(!expanded)} className=" flex items-center">
   {!expanded?(<ArrowDown className="w-5 h-5 mr-2" />):(<ArrowUp className='w-5 h-5 mr-2' />)}
  </button>
</div>
<div className="border-t border-gray-400 w-4/5 mx-7"></div>
<div className={`px-5  text-sm text-gray-700 expandable ${expanded ? 'open' : ''}`}>
  <p className='text-gray-500'>  {latestPerformance?.expired?'Expired':'First '+latestPerformance?.lastDays+' days '+latestPerformance?.lastHours+' hours'} </p>
  <p className="text-black flex font-medium justify-between">
  Impression <span>{latestPerformance?.latestPerformance.impressions}</span>
  
</p>
<p className="text-black flex font-medium justify-between">
  Clicks <span>{latestPerformance?.latestPerformance.clicks}</span>

  
</p>
<p className="text-black flex font-medium justify-between">
  Click Through Rate <span>{latestPerformance?.ctr}%</span>

  
</p>
  
</div>
<button onClick={()=>setActiveTab('analytics')} className='bg-gray-300 hover:bg-black duration-500 transition  hover:text-white  rounded-2xl m-4 mx-8 px-4 py-1'>Go to analytics</button>

  </div>

  <div className="bg-white border border-gray-300 text-black  w-full sm:w-1/2 rounded-lg mb-10">
    <h1 className='font-bold text-xl px-5 py-4 '>Advertisement analytics
      <p className='text-sm font-medium text-gray-500'>Current clicks</p>
       <h className='font-bold text-6xl mb-5'>{latestPerformance?.latestPerformance.clicks}</h>
    </h1>
    <div className="border-t border-gray-400 w-4/5 mx-7"></div>
    
    <div className="w-3/4 relative mb-2 mx-auto">
    <h1 className='font-bold text-xl'>Summary</h1>
    <p className='text-gray-600'> {latestPerformance?.expired?'Expired':'Last '+latestPerformance?.lastDays+' days'} </p>
    <h1 className='font-bold flex justify-between'>Impression <span>{latestPerformance?.latestPerformance.impressions}</span></h1>
     <h1 className='font-bold flex justify-between'>Click <span>{latestPerformance?.latestPerformance.clicks}</span></h1>
      <h1 className='font-bold flex justify-between'>Click Through Rate <span>{latestPerformance?.ctr}%</span></h1>
    </div>
    <div className="border-t border-gray-400 w-4/5 mx-7"></div>
    
      <button onClick={()=>setActiveTab('analytics')} className='bg-gray-300  hover:bg-black duration-500 transition  hover:text-white  rounded-2xl m-4 mx-8 px-4 py-1'>Go to analytics</button>
    
  </div>
  <div className="bg-white border border-gray-300 text-black  sm:w-1/3   rounded-lg mb-10">
    <h1 className='font-bold text-xl px-5 py-4 '>Renewal
      <p className='text-sm font-medium text-gray-500 flex justify-between'>Expire date:- <span>{new Date(latestPerformance?.latestPerformance?.expiresAt).toLocaleDateString('en-GB')}</span></p>
       <h className={`font-bold text-2xl mb-2 ${latestPerformance?.expired&&'text-red-600'}`}>{latestPerformance?.expired?'Expired':latestPerformance?.expireDays+' days'} </h>

      
      
    </h1>
    
    <div className="border-t border-gray-400 w-4/5 mx-7"></div>

    
      <button  onClick={() =>{if(latestPerformance?.expired){
        navigate('/advertise')
      }else{setIsRenewalModalOpen(true)} }} className='bg-gray-300  hover:bg-black duration-500 transition  hover:text-white  rounded-2xl m-4 mx-8 px-4 py-1'>Go to renewal</button>
    
  </div>
</div>

                  
              
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                {/* Mobile view: Stacked cards for data */}
                <div className="block sm:hidden">
                  {advertisements.map(ad => (
                    <div key={ad.id} onClick={()=>ApiCallFetchPerformance(ad.id)} className="p-4 border-b hover:bg-gray-50 transition duration-300 ease-in-out border-gray-200">
                      <div className="flex justify-between mb-2">
                        <div className="text-sm font-medium text-gray-900">{ad.name}</div>
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${new Date(ad.expiresAt) >new Date() &&  ad.block === false ? 'bg-green-100 text-green-800' : 
                            ad.status === 'paused' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-red-100 text-red-800'}`}>
                          { new Date(ad.expiresAt) >new Date() ? "active":'expired'}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mb-3">
                          <div>
                         
                          <img className="w-20 rounded border" src={ad.adImage}/>
                        </div>
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
                          <div className="text-sm font-medium">{ad.clicks?Math.round((ad.clicks/ad.impressions)*100):0}%</div>
                        </div>
                      </div>
                      <div className="flex justify-end space-x-3">
                       
                       
                        <button  className="text-gray-400  hover:text-blue-600" onClick={()=>handleEditModal(ad)}>
                          <Edit className="w-4 h-4"  />
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
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Logo</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clicks</th>
                        <th className="py-3 text-left      text-xs font-medium text-gray-500 uppercase tracking-wider">Impressions</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CTR</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {advertisements.map(ad => (
                        <tr key={ad.id} onClick={()=>ApiCallFetchPerformance(ad.id)} className='hover:bg-gray-100 transition duration-300 ease-in-out'>
                          <td className='px-4 py-4 whitespace-nowrap'>
                            <img src={ad.adImage} width={40} height={40} className='rounded border' alt="" />
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{ad.companyName}</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{ad.clicks.toLocaleString()}</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{ad.impressions.toLocaleString()}</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{ad.clicks?Math.round((ad.clicks/ad.impressions)*100):0}%</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${new Date(ad.expiresAt) >new Date() && ad.block === false ? 'bg-green-100 text-green-800' : 
                                ad.block === 'paused' ? 'bg-yellow-100 text-yellow-800' : 
                                'bg-red-100 text-red-800'}`}>
                              {new Date(ad.expiresAt)<new Date()?'expired':"active"}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex space-x-3">
                              
                              <button className="text-gray-400 px-2 hover:text-blue-600" onClick={()=>handleEditModal(ad)}>
                                <Edit className="w-4 h-4"  />
                              </button>
                              
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 py-3 bg-gray-50 border-t border-gray-200">
                 
                  
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'settings' && (
            <SettingsAdvertise/>
          )}
        </div>
      </div>
      <Editadveritse data={EditAdData} initialData={EditAdData} isOpen={editModal} onClose={()=>setEditModal(false)} onSave={handleEdit}/>
      {isRenewalModalOpen &&<RenewalModal advertiseId={advertiseId}  onClose={() => setIsRenewalModalOpen(false)} onRenew={handleRenewal}/>}
    </div>
  );
}