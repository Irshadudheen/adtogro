import React, { useEffect } from 'react'
import Layout from '../components/layout/Layout'
import { Link } from 'react-router-dom'

function Termscondition() {
     useEffect(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }, []);
  return (
        <Layout>
        <div className="max-w-3xl mx-auto px-4 py-8 text-black  rounded-xl shadow-lg mb-10 mt-5">
      <h1 className="text-3xl font-bold mb-6 text-center"> Terms & Conditions</h1>
      <p className="mb-4">
        Welcome to AdToGro! By using our platform, you agree to the following terms:
      </p>

      <ul className="space-y-4 list-disc pl-5">
        <li>
          <strong>Eligibility:</strong> You must be 13 years or older to use AdToGro.
        </li>
        <li>
          <strong>Account Responsibility:</strong> Keep your login details secure. You’re responsible for all activity under your account.
        </li>
        <li>
          <strong>No Refund Policy:</strong> All purchases made on AdToGro are <strong>final</strong>. No refunds will be provided for any reason.
        </li>
        <li>
          <strong>Intellectual Property:</strong> You own your data. AdToGro owns the platform and all related features.
        </li>
        <li>
          <strong>Privacy:</strong> We handle your data according to our <Link to="/privacy" className="underline text-blue-400">Privacy Policy</Link>.
        </li>
        <li>
          <strong>Service Availability:</strong> AdToGro is provided "as is". We don’t guarantee uninterrupted or error-free service.
        </li>
        <li>
          <strong>Changes:</strong> We may update these terms at any time. Continued use means you accept the changes.
        </li>
        <li>
          <strong>Governing Law:</strong> These terms are governed by the laws of <span className="italic">[Your Country/State]</span>.
        </li>
      </ul>

      <p className="mt-6">
        <strong>Need help?</strong> Contact us at <a href="mailto:ad2gro@gmail.com" className="underline text-blue-400">ad2gro@gmail.com</a>.
      </p>
    </div>
    </Layout>
  )
}

export default Termscondition
