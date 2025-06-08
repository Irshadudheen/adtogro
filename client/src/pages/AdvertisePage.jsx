// src/pages/AdvertisePage.js
import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import razorpayPayment from '@/utils/razorpay';
import { useDispatch } from 'react-redux';
import 'react-image-crop/dist/ReactCrop.css'
import ImageCropper from '@/components/imageCropper';
import toast from 'react-hot-toast';
import { createOrder } from '@/Api/order';
import { updateAdvertiserStatus } from '../redux/userSlice';

function AdvertisePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  // Parse query parameters to get plan
  const searchParams = new URLSearchParams(location.search);
  const planFromQuery = searchParams.get('plan');
  
  const [formData, setFormData] = useState({
    companyName: '',
    companyWebsite: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    adDescription: '',
    targetAudience: '',
    advertisPlan: planFromQuery || 'basic',
    agreeToTerms: false
  });
  
  // Image handling states
  const [adImage, setAdImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

const handleImage=(adImage)=>{
  setPreviewImage(adImage)
}
  
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
    
    // Check if an image is uploaded
    
    
    setIsSubmitting(true);
    setError('');
    if(!previewImage){
      toast.error('Image not found')
    setError('Image not found')
    setIsSubmitting(false)
    return
    }
    
    try {
      // Create form data for submission including the image
      const submissionData = {
        ...formData,
        adImage: previewImage
      };
      
      
 
      const response = await createOrder(submissionData)
   
    const data= await razorpayPayment(response)
    
      setSuccess(true);
      dispatch(updateAdvertiserStatus({ is_advertiser: true }));
      setFormData({
        companyName: '',
        companyWebsite: '',
        contactName: '',
        contactEmail: '',
        contactPhone: '',
        adDescription: '',
        targetAudience: '',
        advertisPlan: planFromQuery || 'basic',
        agreeToTerms: false
      });
     
    } catch (err) {
      
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Crop Modal Component
  
  
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
              }}>Thank you for your interest in advertising with us.</h2>
              <p style={{ marginBottom: '1rem' }}>
                We truly appreciate your consideration and are excited about the possibility of collaborating with you. Our platform offers a variety of advertising opportunities designed to help you reach your target audience effectively. 
              </p>
              <button 
                onClick={() => navigate('/')}
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
                Home 
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
                      name="companyWebsite"
                      value={formData.companyWebsite}
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
                      name="contactEmail"
                      value={formData.contactEmail}
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
                    name="contactPhone"
                    value={formData.contactPhone}
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
                
                {/* Image Upload Section */}
                <div style={{ marginBottom: '1.5rem' }}>
                <ImageCropper updateAvatarCallback={handleImage}/>
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
                    name="advertisPlan"
                    value={formData.advertisPlan}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem'
                    }}
                    required
                  >
                    <option value="basic">Basic ($9/ day)</option>
                    <option value="pro">Professional ($59/month)</option>
                    <option value="enterprise">Enterprise ($299/half year)</option>
                    
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
                  backgroundColor: isSubmitting ? '#93c5fd' : 'black',
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