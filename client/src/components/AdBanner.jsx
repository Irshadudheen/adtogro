import React, { useEffect, useState } from 'react';
import { fetchLogo, countClick } from '../Api/advertise';
import { redirect } from 'react-router-dom';

const AdBanner = () => {
  // Sample ad data - you would replace this with your actual 
  const [adData,setAdata]=useState([])
  useEffect(()=>{
    const fetchData = async ()=>{
      try {
       const logs = await fetchLogo()
       setAdata(logs)
      } catch (error) {
        console.error('Error fetching ad data:', error);
      }
    }
    fetchData()
  },[])
  
const handleClick = async(id,url)=>{

  try {
    await countClick(id)
    window.open(url, '_blank')
  } catch (error) {
    throw error
  }
}
  // Function to create a 10x10 grid with ad images
  const renderAdGrid = () => {
    const cells = [];
    
    // Create all cells
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        const index = i * 10 + j;
        const ad = index < adData.length ? adData[index] : null;
        
        cells.push(
          <div 
            key={`cell-${i}-${j}`}
            className="relative border border-gray-400 overflow-hidden group "
          >
            {ad && (
              <>
                <div onClick={()=>handleClick(ad.id,ad.companyWebsite)} className="block w-full h-full">
                  <img 
                    src={ad.adImage} 
                    alt={ad.companyName}
                    className="w-full h-full object-cover cursor-pointer"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white text-xs py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    {ad.companyName}
                  </div>
                </div>
              </>
            )}
          </div>
        );
      }
    }
    
    return cells;
  };
  
  return (
    <div className="w-full flex justify-center p-4">
      <div className="w-full max-w-screen-lg aspect-square">
        <div className="w-full h-full grid grid-cols-10 grid-rows-10 gap-0">
          {renderAdGrid()}
        </div>
      </div>
    </div>
  );
};

export default AdBanner;