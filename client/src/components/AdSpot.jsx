    // src/components/AdSpot.js
    import React, { useState, useEffect } from 'react';
    // import { trackClick } from '../utils/analytics';

    function AdSpot({ ad }) {
    const [impressions, setImpressions] = useState(0);
    console.log('AdSpot component rendered with ad:', ad);
    //   useEffect(() => {
    //     // Record impression when ad is displayed
    //     const recordImpression = async () => {
    //       try {
    //         const response = await fetch('/api/impressions', {
    //           method: 'POST',
    //           headers: { 'Content-Type': 'application/json' },
    //           body: JSON.stringify({ adId: ad.id })
    //         });
    //         if (response.ok) {
    //           setImpressions(prev => prev + 1);
    //         }
    //       } catch (error) {
    //         console.error('Failed to record impression:', error);
    //       }
    //     };
        
    //     recordImpression();
    //   }, [ad.id]);
    
    const handleClick = async () => {
        // Track the click before redirecting
        // await trackClick(ad.id);
        
        // Open advertiser's website in a new tab
        // window.open(ad.targetUrl, '_blank', 'noopener,noreferrer');
    };
    
    return (
        <div 
        className="ad-spot cursor-pointer transition-transform hover:scale-105" 
        onClick={handleClick}
        style={{ 
            margin: '10px',
            display: 'inline-block',  
        }}
        >
        <div style={{ 
            position: 'relative',
            width: '100px', 
            height: '100px' 
        }}>
            <img 
            src={ad.imageUrl} 
            alt={ad.companyName} 
            style={{
                width: '100%',
                height: '100%',
                borderRadius: '4px',
                objectFit: 'cover'
            }}
            />
            <span style={{
            position: 'absolute',
            top: '0',
            right: '0',
            fontSize: '0.7rem',
            backgroundColor: 'rgba(0,0,0,0.6)',
            color: 'white',
            padding: '0 4px',
            borderRadius: '2px'
            }}>Ad</span>
        </div>
        <p style={{ 
            fontSize: '0.75rem', 
            marginTop: '4px',
            textAlign: 'center'
        }}>{ad.companyName}</p>
        </div>
    );
    }

    export default AdSpot;