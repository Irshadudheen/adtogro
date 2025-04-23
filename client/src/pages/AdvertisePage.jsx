// src/pages/AdvertisePage.js
import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Layout from '../components/Layout';
import razorpayPayment from '../utils/razorpay';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

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
  
  // Image handling states
  const [adImage, setAdImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [crop, setCrop] = useState({unit: '%', 
    width: 80, 
    height: 80,  // Same as width for 1:1 ratio
    x: 10,       
    y: 10   });
  const [completedCrop, setCompletedCrop] = useState(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const imageRef = useRef(null);
  const previewCanvasRef = useRef(null);
  
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
  
  // Handle image upload
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = () => {
        setAdImage(reader.result);
        setShowCropModal(true);
      };
      
      reader.readAsDataURL(file);
    }
  };
  
  // Generate cropped image
  const getCroppedImage = () => {
    if (!imageRef.current || !completedCrop) {
      return null;
    }
    
    const image = imageRef.current;
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    
    canvas.width = completedCrop.width;
    canvas.height = completedCrop.height;
    
    const ctx = canvas.getContext('2d');
    
    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width,
      completedCrop.height
    );
    
    return canvas.toDataURL('image/jpeg');
  };
  
  // Save cropped image
  const saveCroppedImage = () => {
    if (imageRef.current && completedCrop?.width && completedCrop?.height) {
      const croppedImg = getCroppedImage();
      setPreviewImage(croppedImg);
      setShowCropModal(false);
    }
  };
  
  // Cancel cropping
  const cancelCropping = () => {
    setAdImage(null);
    setShowCropModal(false);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if an image is uploaded
    if (!previewImage) {
      setError('Please upload and crop an advertisement image.');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      // Create form data for submission including the image
      const submissionData = {
        ...formData,
        adImage: previewImage
      };
      
      // This would be connected to your API
      razorpayPayment({
        "amount": 400000,
        "amount_due": 400000,
        "amount_paid": 0,
        "attempts": 0,
        "created_at": 1744537472,
        "currency": "INR",
        "entity": "order",
        "id": "order_QIUrjCXNdcOEMp",
        "notes": [],
        "offer_id": null,
        "receipt": "67fb877fa72c63bd1b089fc1",
        "status": "created"
      });
      
      // const response = await fetch('/api/advertise-applications', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(submissionData)
      // });
      
      // if (!response.ok) {
      //   throw new Error('Failed to submit application');
      // }
      
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
      setPreviewImage(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Crop Modal Component
  const CropModal = () => {
    if (!showCropModal) return null;
    
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          maxWidth: '90%',
          maxHeight: '90%',
          overflow: 'auto'
        }}>
          <h3 style={{ marginBottom: '16px', fontWeight: '600' }}>Crop Your Advertisement Image</h3>
          <p style={{ marginBottom: '12px', fontSize: '14px', color: '#6b7280' }}>
            Drag to adjust the crop area. Recommended aspect ratio is 1:1.
          </p>
          <div style={{ maxHeight: '70vh', overflow: 'auto' }}>
            <ReactCrop
              src={adImage}
              onImageLoaded={(img) => {
                imageRef.current = img;
                const width = 80; // Default width percentage
                const height = width; // Equal height for 1:1 ratio
                setCrop({ unit: '%', width, height, x: (100-width)/2, y: (100-height)/2 });
                return false;
              
              }}
              crop={crop}
              onChange={(c) => setCrop(c)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={1/1}
            />
          </div>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'flex-end',
            marginTop: '16px',
            gap: '10px'
          }}>
            <button
              onClick={cancelCropping}
              style={{
                padding: '8px 16px',
                backgroundColor: '#f3f4f6',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              onClick={saveCroppedImage}
              style={{
                padding: '8px 16px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Save Crop
            </button>
          </div>
        </div>
      </div>
    );
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
                
                {/* Image Upload Section */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.25rem',
                    fontSize: '0.875rem',
                    fontWeight: '500'
                  }}>
                    Advertisement Image *
                  </label>
                  
                  {/* File Input */}
                  <div style={{
                    border: '1px dashed #d1d5db',
                    borderRadius: '0.375rem',
                    padding: '1rem',
                    marginBottom: '1rem',
                    backgroundColor: '#f9fafb'
                  }}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      style={{
                        width: '100%'
                      }}
                    />
                    <p style={{
                      fontSize: '0.75rem',
                      color: '#6b7280',
                      marginTop: '0.5rem'
                    }}>
                      Recommended size: 1200×1200 pixels (1:1 ratio). Click to browse or drag and drop.
                    </p>
                  </div>
                  
                  {/* Image Preview */}
                  {previewImage && (
                    <div style={{
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem',
                      padding: '1rem',
                      backgroundColor: '#f9fafb'
                    }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '0.5rem'
                      }}>
                        <span style={{
                          fontSize: '0.875rem',
                          fontWeight: '500'
                        }}>
                          Image Preview
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setPreviewImage(null);
                            setAdImage(null);
                          }}
                          style={{
                            backgroundColor: '#ef4444',
                            color: 'white',
                            borderRadius: '0.375rem',
                            padding: '0.25rem 0.5rem',
                            fontSize: '0.75rem',
                            fontWeight: '500',
                            border: 'none',
                            cursor: 'pointer'
                          }}
                        >
                          Remove
                        </button>
                      </div>
                      
                      <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        marginTop: '0.5rem',
                        border: '1px solid #e5e7eb',
                        borderRadius: '0.25rem',
                        padding: '0.5rem',
                        backgroundColor: 'white'
                      }}>
                        <img
                          src={previewImage}
                          alt="Advertisement Preview"
                          style={{
                            maxWidth: '100%',
                            maxHeight: '200px',
                            objectFit: 'contain'
                          }}
                        />
                      </div>
                    </div>
                  )}
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
          
          {/* Crop Modal */}
          <CropModal />
        </div>
      </div>
    </Layout>
  );
}

export default AdvertisePage;