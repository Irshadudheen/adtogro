// src/pages/AdvertisePage.js
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Layout from '../components/Layout';

function AdvertisePage() {
  const location = useLocation();
  // Parse query parameters to get plan
  const searchParams = new URLSearchParams(location.search);
  const planFromQuery = searchParams.get('plan');
  
  const [formData, setFormData] = useState({
    companyName: '',
    website: '',
    contactName: '',
    email: '',
    phone: '',
    adDescription: '',
    targetAudience: '',
    plan: planFromQuery || 'basic',
    agreeToTerms: false
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  // Update plan when query parameter changes
  useEffect(() => {
    if (planFromQuery) {
      setFormData(prev => ({
        ...prev,
        plan: planFromQuery
      }));
    }
  }, [planFromQuery]);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      // This would be connected to your API
      const response = await fetch('/api/advertise-applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit application');
      }
      
      setSuccess(true);
      setFormData({
        companyName: '',
        website: '',
        contactName: '',
        email: '',
        phone: '',
        adDescription: '',
        targetAudience: '',
        plan: planFromQuery || 'basic',
        agreeToTerms: false
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Layout>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '1rem'
      }}>
        <div style={{
          maxWidth: '768px',
          margin: '0 auto',
          paddingTop: '3rem',
          paddingBottom: '3rem'
        }}>
          <h1 style={{
            fontSize: '1.875rem',
            fontWeight: 'bold',
            marginBottom: '1.5rem'
          }}>Advertise Your Business</h1>
          
          {success ? (
            <div style={{
              backgroundColor: '#ecfdf5',
              border: '1px solid #d1fae5',
              color: '#065f46',
              padding: '1.5rem',
              borderRadius: '0.5rem'
            }}>
              <h2 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                marginBottom: '0.5rem'
              }}>Application Submitted!</h2>
              <p style={{ marginBottom: '1rem' }}>
                Thank you for your interest in advertising with us. Our team will review your application and contact you within 1-2 business days.
              </p>
              <button 
                onClick={() => setSuccess(false)}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#10b981',
                  color: 'white',
                  borderRadius: '0.375rem',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
              >
                Submit Another Application
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{
              backgroundColor: 'white',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              borderRadius: '0.5rem',
              padding: '1.5rem'
            }}>
              {error && (
                <div style={{
                  marginBottom: '1.5rem',
                  padding: '1rem',
                  backgroundColor: '#fef2f2',
                  border: '1px solid #fee2e2',
                  color: '#991b1b',
                  borderRadius: '0.375rem'
                }}>
                  {error}
                </div>
              )}
              
              <div style={{ marginBottom: '2rem' }}>
                <h2 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  marginBottom: '1rem'
                }}>Company Information</h2>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: '1rem'
                }}>
                  <div>
                    <label style={{
                      display: 'block',
                      marginBottom: '0.25rem',
                      fontSize: '0.875rem',
                      fontWeight: '500'
                    }}>Company Name *</label>
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.375rem'
                      }}
                      required
                    />
                  </div>
                  <div>
                    <label style={{
                      display: 'block',
                      marginBottom: '0.25rem',
                      fontSize: '0.875rem',
                      fontWeight: '500'
                    }}>Website URL *</label>
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.375rem'
                      }}
                      required
                    />
                  </div>
                </div>
              </div>
              
              <div style={{ marginBottom: '2rem' }}>
                <h2 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  marginBottom: '1rem'
                }}>Contact Information</h2>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: '1rem',
                  marginBottom: '1rem'
                }}>
                  <div>
                    <label style={{
                      display: 'block',
                      marginBottom: '0.25rem',
                      fontSize: '0.875rem',
                      fontWeight: '500'
                    }}>Contact Name *</label>
                    <input
                      type="text"
                      name="contactName"
                      value={formData.contactName}
                      onChange={handleChange}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.375rem'
                      }}
                      required
                    />
                  </div>
                  <div>
                    <label style={{
                      display: 'block',
                      marginBottom: '0.25rem',
                      fontSize: '0.875rem',
                      fontWeight: '500'
                    }}>Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.375rem'
                      }}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.25rem',
                    fontSize: '0.875rem',
                    fontWeight: '500'
                  }}>Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem'
                    }}
                  />
                </div>
              </div>
              
              <div style={{ marginBottom: '2rem' }}>
                <h2 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  marginBottom: '1rem'
                }}>Advertisement Details</h2>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.25rem',
                    fontSize: '0.875rem',
                    fontWeight: '500'
                  }}>
                    Ad Description (What would you like to promote?) *
                  </label>
                  <textarea
                    name="adDescription"
                    value={formData.adDescription}
                    onChange={handleChange}
                    rows="4"
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem'
                    }}
                    required
                  ></textarea>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.25rem',
                    fontSize: '0.875rem',
                    fontWeight: '500'
                  }}>Target Audience</label>
                  <input
                    type="text"
                    name="targetAudience"
                    value={formData.targetAudience}
                    onChange={handleChange}
                    placeholder="E.g. Small business owners, Tech enthusiasts, etc."
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem'
                    }}
                  />
                </div>
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.25rem',
                    fontSize: '0.875rem',
                    fontWeight: '500'
                  }}>Advertising Plan *</label>
                  <select
                    name="plan"
                    value={formData.plan}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem'
                    }}
                    required
                  >
                    <option value="basic">Basic ($99/month)</option>
                    <option value="pro">Professional ($299/month)</option>
                    <option value="enterprise">Enterprise ($799/month)</option>
                    <option value="custom">Custom Solution</option>
                  </select>
                </div>
              </div>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'flex-start'
                }}>
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleChange}
                    style={{
                      marginTop: '0.25rem',
                      marginRight: '0.5rem'
                    }}
                    required
                  />
                  <span style={{ fontSize: '0.875rem' }}>
                    I agree to the <a href="/terms" style={{ color: '#3b82f6', textDecoration: 'none' }}>Terms of Service</a> and 
                    <a href="/privacy" style={{ color: '#3b82f6', textDecoration: 'none' }}> Privacy Policy</a>.
                  </span>
                </label>
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  backgroundColor: isSubmitting ? '#93c5fd' : '#3b82f6',
                  color: 'white',
                  borderRadius: '0.375rem',
                  fontWeight: '500',
                  border: 'none',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  transition: 'background-color 0.2s'
                }}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </button>
            </form>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default AdvertisePage;