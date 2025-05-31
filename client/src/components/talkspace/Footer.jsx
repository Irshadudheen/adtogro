import React, { useContext, useEffect, useState } from 'react'
import { LiveCountContext } from '@/context/LiveCountContext';
import { commmunityCount, roomCount } from '../../Api/user';
function FooterTalkspace() {
     const liveCount = useContext(LiveCountContext);
       const [CommunityCount, setCommunityCount] = useState(0);
       const [totalRoom,setRoomCount] = useState(0)
       const fetchCommunityCountandRoomCount = async ( ) => {
         try {
        const {communityCount} = await commmunityCount();
        const data = await roomCount()
        setRoomCount(data)
        setCommunityCount(communityCount);
            } catch (error) {
            throw error;
            }
  }
     useEffect(()=>{

        
    fetchCommunityCountandRoomCount();
     },[])
   
  return (
    <>
      <div className="mt-12 pt-6 border-t border-gray-200">
          <div className="flex flex-wrap justify-center gap-8 text-center text-gray-600">
            <div>
              <div className="font-bold text-2xl text-black">7+</div>
              <div className="text-sm">Languages</div>
            </div>
            <div>
              <div className="font-bold text-2xl text-black">{totalRoom||0}+</div>
              <div className="text-sm">Active groups</div>
            </div>
            <div>
            <div className="font-bold text-2xl text-black">{liveCount||0}+</div>
              <div className="text-sm">Users online</div>
            </div>
            <div>
              <div className="font-bold text-2xl text-black">{CommunityCount}+</div>
              <div className="text-sm">Community members</div>
            </div>
          </div>
        </div>
    </>
  )
}

export default FooterTalkspace
