// src/components/PricingCard.js
import React from 'react';
import { Link } from 'react-router-dom';

function PricingCard({ plan }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      padding: '1.5rem',
      backgroundColor: plan.featured ? '#eff6ff' : 'white',
      border: plan.featured ? '2px solid black' : 'none',
      borderRadius: '0.5rem',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    }}>
      <h3 style={{
        fontSize: '1.25rem',
        fontWeight: 'bold',
        marginBottom: '0.5rem'
      }}>{plan.name}</h3>
      
      <div style={{ marginBottom: '1rem' }}>
        <span style={{
          fontSize: '1.875rem',
          fontWeight: 'bold'
        }}>${plan.price}</span>
        <span style={{ color: '#4b5563' }}>/{plan.period}</span>
      </div>
      
      <p style={{
        color: '#4b5563',
        marginBottom: '1.5rem'
      }}>{plan.description}</p>
      
      <ul style={{
        marginBottom: '2rem',
        flexGrow: 1
      }}>
        {plan.features.map((feature, index) => (
          <li key={index} style={{
            display: 'flex',
            alignItems: 'flex-start',
            marginBottom: '0.5rem'
          }}>
            <svg 
              style={{
                width: '1.25rem',
                height: '1.25rem',
                color: '#10b981',
                marginRight: '0.5rem',
                marginTop: '0.125rem'
              }}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      
      <Link 
        to={`/advertise?plan=${plan.id}`}
        style={{
          padding: '0.5rem 1rem',
          borderRadius: '0.5rem',
          textAlign: 'center',
          fontWeight: '500',
          backgroundColor: plan.featured ? 'black' : 'white',
          color: plan.featured ? 'white' : 'black',
          border: plan.featured ? 'none' : '1px solid black',
          textDecoration: 'none',
          transition: 'background-color 0.2s'
        }}
      >
        Get Started
      </Link>
    </div>
  );
}

export default PricingCard;