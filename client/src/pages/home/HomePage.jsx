import { useState, useEffect, useRef, useLayoutEffect, useContext } from 'react';
import AdBanner from '../../components/AdBanner';
import Layout from '../../components/Layout';
import DraggableLiveCount from '../../components/live-count';
import io from 'socket.io-client';
import { Link } from 'react-router-dom';
import { LiveCountContext } from '../../context/LiveCountContext';


export default function HomePage() {
  const liveCount = useContext(LiveCountContext);

 

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-6xl mx-auto p-4">
          {/* Main content area with full-screen ad display */}
          <div className="mb-8">
            <AdBanner />
          </div>

          <div className="text-center mb-8 pt-4">
            <h1 className="text-4xl font-bold mb-6">Boost Your Business Visibility</h1>
            <p className="text-xl mb-8">Connect with thousands of potential customers through our platform</p>
            <Link to="/advertise" className="px-8 py-3 bg-black text-white rounded-lg font-semibold inline-block transition-colors hover:bg-gray-800">
              Advertise With Us
            </Link>
          </div>

          {/* Features section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="p-6 bg-white rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-3">Targeted Audience</h3>
              <p>Reach the exact customers who are looking for your products and services.</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-3">Detailed Analytics</h3>
              <p>Track performance with comprehensive metrics on clicks, impressions, and conversions.</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-3">Flexible Pricing</h3>
              <p>Choose from various ad placement options that fit your budget and marketing goals.</p>
            </div>
          </div>

          {/* Call to action */}
          <div className="text-center pb-12">
            <h2 className="text-3xl font-bold mb-4">Ready to grow your business?</h2>
            <div className="flex justify-center gap-4">
              <Link to="/pricing" className="px-6 py-2 bg-white text-black border border-black rounded-lg font-semibold transition-colors hover:bg-gray-100">
                View Pricing
              </Link>
              <Link to="/advertise" className="px-6 py-2 bg-black text-white rounded-lg font-semibold transition-colors hover:bg-gray-800">
                Get Started
              </Link>
            </div>
          </div>
        </div>

        {/* Draggable live user count */}
        <DraggableLiveCount liveCount={liveCount} />
      </div>
    </Layout>
  );
}