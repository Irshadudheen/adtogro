// src/pages/HomePage.js
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import AdBanner from '../../components/AdBanner';

function HomePage() {
  return (
    <Layout>
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom, #e6f0ff, #ffffff)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '1rem'
        }}>
         
          
          {/* Main content area with full-screen ad display */}
          <div style={{ marginBottom: '2rem' }}>
            <AdBanner />
          </div>
          <div style={{
            textAlign: 'center',
            marginBottom: '2rem',
            paddingTop: '1rem'
          }}>
            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: 'bold',
              marginBottom: '1.5rem'
            }}>Boost Your Business Visibility</h1>
            <p style={{
              fontSize: '1.25rem',
              marginBottom: '2rem'
            }}>Connect with thousands of potential customers through our platform</p>
            <Link to="/advertise" style={{
              padding: '0.75rem 2rem',
              backgroundColor: 'black',
              color: 'white',
              borderRadius: '0.5rem',
              fontWeight: '600',
              textDecoration: 'none',
              display: 'inline-block',
              transition: 'background-color 0.2s'
            }}>
              Advertise With Us
            </Link>
          </div>
          {/* Features section */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem',
            marginBottom: '4rem'
          }}>
            <div style={{
              padding: '1.5rem',
              backgroundColor: 'white',
              borderRadius: '0.5rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                marginBottom: '0.75rem'
              }}>Targeted Audience</h3>
              <p>Reach the exact customers who are looking for your products and services.</p>
            </div>
            <div style={{
              padding: '1.5rem',
              backgroundColor: 'white',
              borderRadius: '0.5rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                marginBottom: '0.75rem'
              }}>Detailed Analytics</h3>
              <p>Track performance with comprehensive metrics on clicks, impressions, and conversions.</p>
            </div>
            <div style={{
              padding: '1.5rem',
              backgroundColor: 'white',
              borderRadius: '0.5rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                marginBottom: '0.75rem'
              }}>Flexible Pricing</h3>
              <p>Choose from various ad placement options that fit your budget and marketing goals.</p>
            </div>
          </div>
          
          {/* Call to action */}
          <div style={{
            textAlign: 'center',
            paddingBottom: '3rem'
          }}>
            <h2 style={{
              fontSize: '1.875rem',
              fontWeight: 'bold',
              marginBottom: '1rem'
            }}>Ready to grow your business?</h2>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '1rem'
            }}>
              <Link to="/pricing" style={{
                padding: '0.5rem 1.5rem',
                backgroundColor: 'white',
                color: 'black',
                border: '1px solid black',
                borderRadius: '0.5rem',
                fontWeight: '600',
                textDecoration: 'none',
                transition: 'background-color 0.2s'
              }}>
                View Pricing
              </Link>
              <Link to="/advertise" style={{
                padding: '0.5rem 1.5rem',
                backgroundColor: 'black',
                color: 'white',
                borderRadius: '0.5rem',
                fontWeight: '600',
                textDecoration: 'none',
                transition: 'background-color 0.2s'
              }}>
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default HomePage;