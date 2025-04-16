// src/pages/PricingPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import PricingCard from '../components/PricingCard';

function PricingPage() {
  const pricingPlans = [
    {
      id: 'basic',
      name: 'Basic',
      price: 99,
      period: 'month',
      description: 'Perfect for small businesses just getting started',
      featured: false,
      features: [
        '1 ad spot (100px x 100px)',
        'Basic analytics dashboard',
        'Up to 10,000 impressions',
        'Standard position rotation',
        'Email support'
      ]
    },
    {
      id: 'pro',
      name: 'Professional',
      price: 299,
      period: 'month',
      description: 'Great for growing businesses with established audience',
      featured: true,
      features: [
        '3 ad spots (100px x 100px each)',
        'Advanced analytics dashboard',
        'Up to 50,000 impressions',
        'Premium positioning',
        'Priority email & chat support',
        'A/B testing capabilities'
      ]
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 799,
      period: 'month',
      description: 'For large businesses with significant advertising needs',
      featured: false,
      features: [
        '10 ad spots (100px x 100px each)',
        'Comprehensive analytics suite',
        'Unlimited impressions',
        'Premium fixed positioning',
        '24/7 dedicated support',
        'Custom integration options',
        'API access'
      ]
    }
  ];

  return (
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
        
        <div style={{
          marginTop: '4rem',
          backgroundColor: '#f9fafb',
          padding: '2rem',
          borderRadius: '0.5rem',
          maxWidth: '48rem',
          margin: '4rem auto'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            marginBottom: '1rem'
          }}>Need a custom solution?</h2>
          <p style={{ marginBottom: '1.5rem' }}>
            We offer tailored packages for businesses with specific advertising requirements. 
            Contact our team to discuss your unique needs.
          </p>
          <Link 
            to="/contact"
            style={{
              display: 'inline-block',
              padding: '0.5rem 1.5rem',
              backgroundColor: 'black',
              color: 'white',
              borderRadius: '0.5rem',
              fontWeight: '500',
              textDecoration: 'none',
              transition: 'background-color 0.2s'
            }}
          >
            Contact Sales
          </Link>
        </div>
      </div>
    </Layout>
  );
}

export default PricingPage;