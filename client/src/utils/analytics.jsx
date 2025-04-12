// src/utils/analytics.js
export async function trackClick(adId) {
    try {
      // In a real app, this would make a request to your backend
      await fetch('/api/clicks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adId })
      });
      return true;
    } catch (error) {
      console.error('Failed to track click:', error);
      return false;
    }
  }
  
  export async function trackImpression(adId) {
    try {
      await fetch('/api/impressions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adId })
      });}catch{
        console.error('Failed to track click:', error);
        return false;
      }}
