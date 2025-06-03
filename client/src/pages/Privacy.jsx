
import React, { useEffect } from 'react'
import Layout from '@/components/layout/Layout'

function Privacy() {
    useEffect(() => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
}, []);
  return (
    <Layout>
    <div className="max-w-3xl mx-10  px-4 py-8 text-black ">
      <h1 className="text-2xl font-bold mb-4 ">Privacy Policy </h1>
      

      <p className="mb-4">
        At <strong>Adtogro</strong>, your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your personal information when you use our website, application, or services (collectively, the “Services”).
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2"> Information We Collect</h2>
     <h3 className="text-xl font-medium mt-4 mb-1">a. Personal Information</h3>
     <h6>We may collect your basic profile information when you sign in using your Google account.</h6>
     <ul className="list-disc list-inside mb-4">
     <li>Name</li>
     <li>Email address</li>
     <li>Profile picture</li>
     <li>Phone number (if provided)</li>
     </ul>

      <h3 className="text-xl font-medium mt-4 mb-1">b. Usage Data</h3>
      <ul className="list-disc list-inside mb-4">
        <li>IP address</li>
        <li>Browser type and version</li>
        <li>Device type</li>
        <li>Pages visited and time spent on the site</li>
        <li>Clicks, interactions, and other behavioral data</li>
      </ul>

      

      <h2 className="text-2xl font-semibold mt-6 mb-2"> How We Use Your Information</h2>
      <ul className="list-disc list-inside  mb-4">
        <li>Provide, operate, and improve our Services</li>
        <li>Personalize your experience</li>
        <li>Respond to customer inquiries and support requests</li>
        <li>Send updates, newsletters, or promotional content (with your consent)</li>
        <li>Analyze usage to develop better features</li>
      </ul>

    

      

       

      <h2 className="text-2xl font-semibold mt-6 mb-2"> Children’s Privacy</h2>
      <p className="mb-4">
        Our Services are not intended for children under 13. We do not knowingly collect personal information from children.
      </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2"> How We Process Media (Audio, Video, Screen Sharing)</h2>
        <p className="mb-4">
        When you use our Services, we may process media content such as audio, video, or screen sharing. This processing is done to facilitate communication and enhance your experience. We do not store this media unless explicitly stated.
        </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2"> Changes to This Policy</h2>
      <p className="mb-4">
        We may update this Privacy Policy from time to time. We will notify you of significant changes by posting the updated policy on our website with a new effective date.
      </p>
  
     
    </div>
    </Layout>
  )
}

export default Privacy
