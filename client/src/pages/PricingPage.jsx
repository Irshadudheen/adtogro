// src/pages/PricingPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import PricingCard from '@/components/PricingCard';
import { Helmet } from 'react-helmet';

function PricingPage() {
  const pricingPlans = [
    {
      id: 'basic',
      name: 'Basic',
      price: 9,
      period: 'day',
      description: 'Perfect for small businesses just getting started',
      featured: false,
      features: [
        ' Ad spot',
        'Advanced analytics dashboard',
        'Standard position rotation',
     
      ]
    },
    {
      id: 'pro',
      name: 'Professional',
      price: 59,
      period: 'month',
      description: 'Great for growing businesses with established audience',
      featured: true,
      features: [
        'Ad spot ',
        'Advanced analytics dashboard',
           'Standard position rotation',
        
      ]
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 299,
      period: 'half year',
      description: 'For large businesses with significant advertising needs',
      featured: false,
      features: [
        ' Ad spot',
        'Advanced analytics dashboard',
     'Standard position rotation',
        
       
      ]
    }
  ];

  return (
    <>
    <Helmet>
      <title>Pricing / Advertise with Us</title>
      <meta name="description" content="Explore our transparent pricing plans for advertising. Choose the perfect package for your business needs." />
      <meta name="keywords" content="advertising, pricing, plans, business, marketing, grow, spot" />
      <link rel="canonical" href="https://www.adtogro.com/pricing" />
      <meta property="og:title" content="Pricing - Advertise with Us" />
      <meta property="og:description" content="Explore our transparent pricing plans for advertising. Choose the perfect package for your business needs." />
      <meta property="og:url" content="https://www.adtogro.com/pricing" />
      <meta property="og:type" content="website" />
    {/*   <meta property="og:image" content="https://yourwebsite.com/images/pricing-thumbnail.jpg" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Pricing - Advertise with Us" />
      <meta name="twitter:description" content="Explore our transparent pricing plans for advertising. Choose the perfect package for your business needs." />
      <meta name="twitter:image" content="https://yourwebsite.com/images/pricing-thumbnail.jpg" />
      <meta name="theme-color" content="#ffffff" />
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/manifest.json" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="robots" content="index, follow" />
      <meta name="google-site-verification" content="your-google-site-verification-code" />
      <link rel="preconnect" href="https://fonts.googleapis.com" /> */}
    </Helmet>
    <Layout>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '1rem'
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '3rem',
          paddingTop: '2rem'
        }}>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            marginBottom: '1rem'
          }}>Simple, Transparent Pricing</h1>
          <p style={{
            fontSize: '1.125rem',
            color: '#4b5563',
            maxWidth: '36rem',
            margin: '0 auto'
          }}>
            Choose the perfect advertising package for your business needs. All plans include our advanced tracking dashboard.
          </p>
        </div>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
          maxWidth: '1000px',
          margin: '0 auto'
        }}>
          {pricingPlans.map(plan => (
            <PricingCard key={plan.id} plan={plan} />
          ))}
        </div>
        
       
      </div>
    </Layout>
    </>
  );
}

export default PricingPage;