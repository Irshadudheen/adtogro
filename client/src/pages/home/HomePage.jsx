import { Helmet } from 'react-helmet';
import { useContext } from "react"
import AdBanner from "@/components/AdBanner"
import Layout from "@/components/Layout"
import DraggableLiveCount from "@/components/live-count"
import { Link } from "react-router-dom"
import { LiveCountContext } from "@/context/LiveCountContext"
import { useOnlineStatus } from "../../hooks/useOnlineStatus"
import { useTranslation } from "react-i18next"

export default function HomePage() {
  const liveCount = useContext(LiveCountContext)
  const isOnline = useOnlineStatus();
  const { t } = useTranslation();
  return (
    <>
    <Helmet>
       <title>{t('adtogro')}</title>
        <meta name="description" content={t('description')} />
    </Helmet>
    <Layout>
      <div className="bg-[url('/bground_talkspace.jpg')] bg-cover bg-center bg-fixed min-h-screen py-8 px-4">
        <div className="max-w-6xl mx-auto p-4">
          {/* Hero section highlighting Talkspace first */}
          <div className="text-center mb-12 pt-4">
            <h1 className="text-5xl font-bold mb-6"> 
              <img src="/logo/logo_text_black.png" draggable={false} alt="Adtogro Logo" className="h-12 px-1 inline-block" />
              dtogro</h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              {t('Connect, collaborate, and grow with like-minded professionals in our vibrant community platform')}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/talkspace"
                className="px-8 py-4 bg-black text-white rounded-lg font-semibold inline-block transition-colors hover:bg-gray-800 text-lg shadow-lg"
              >
                {t('Enter Talkspace')}
              </Link>
              <Link
                to="/advertise"
                className="px-8 py-4 border border-black bg-white text-black rounded-lg font-semibold inline-block transition-colors hover:bg-gray-100 text-lg"
              >
                {t('Advertise With Us')}
              </Link>
            </div>
          </div>

          {/* Enhanced "Why Join Talkspace?" section */}
          <div className="bg-white p-8 rounded-lg shadow-lg mb-16 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-black">{t('Why Join Talkspace?')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="flex items-start">
                <div className="mr-3 mt-1 bg-black rounded-full p-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-white"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{t('Connect with Professionals')}</h3>
                  <p className="text-gray-700">{t('Network with experts and peers in your industry')}</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="mr-3 mt-1 bg-black rounded-full p-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-white"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{t('Share Ideas')}</h3>
                  <p className="text-gray-700">{t('Discuss business concepts and get valuable feedback')}</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="mr-3 mt-1 bg-black rounded-full p-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-white"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{t('Learn & Grow')}</h3>
                  <p className="text-gray-700">{t('Access resources and insights to develop your skills')}</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="mr-3 mt-1 bg-black rounded-full p-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-white"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{t('Build Relationships')}</h3>
                  <p className="text-gray-700">{t('Form lasting professional connections and partnerships')}</p>
                </div>
              </div>
            </div>
            <div className="flex justify-center mt-6">
              <Link to="/talkspace" className="text-black font-medium text-lg hover:underline flex items-center">
                {t('Explore Talkspace')}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 ml-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            </div>
          </div>

          {/* Features section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">{t('Active Community')}</h3>
              <p>{t('Join thousands of active users sharing insights and experiences daily.')}</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">{t('Expert Discussions')}</h3>
              <p>{t('Participate in moderated discussions led by industry experts and thought leaders.')}</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">{t('Networking Events')}</h3>
              <p>{t('Attend virtual and in-person events to expand your professional network.')}</p>
            </div>
          </div>

          {/* Ad banner moved lower on the page */}
          <div className="mb-16 max-w-4xl mx-auto">
            <h3 className="text-xl font-semibold mb-4 text-center">{t('From Our Partners')}</h3>
            <AdBanner />
          </div>

          {/* Business benefits section */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-16 max-w-3xl mx-auto">
            <h3 className="text-xl font-semibold mb-4 text-black text-center">{t('For Businesses')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
              <div className="text-center">
                <h4 className="font-semibold mb-2">{t('Targeted Audience')}</h4>
                <p className="text-sm">{t('Reach customers looking for your products and services.')}</p>
              </div>
              <div className="text-center">
                <h4 className="font-semibold mb-2">{t('Detailed Analytics')}</h4>
                <p className="text-sm">{t('Track performance with comprehensive metrics.')}</p>
              </div>
              <div className="text-center">
                <h4 className="font-semibold mb-2">{t('Flexible Pricing')}</h4>
                <p className="text-sm">{t('Choose ad options that fit your budget and goals.')}</p>
              </div>
            </div>
            <div className="flex justify-center mt-4">
              <Link to="/advertise" className="text-black font-medium hover:underline">
                {t('Learn about advertising →')}
              </Link>
            </div>
          </div>

          {/* Call to action */}
          <div className="text-center pb-12">
            <h2 className="text-3xl font-bold mb-4">{t('Join our growing community today')}</h2>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/talkspace"
                className="px-6 py-3 bg-black text-white rounded-lg font-semibold inline-block transition-colors hover:bg-gray-800"
              >
                {t('Enter Talkspace')}
              </Link>
              <Link
                to="/pricing"
                className="px-6 py-3 bg-white text-black border border-black rounded-lg font-semibold transition-colors hover:bg-gray-100"
              >
                {t('View Membership Options')}
              </Link>
            </div>
          </div>
        </div>

        {/* Draggable live user count */}
        {isOnline&&<DraggableLiveCount liveCount={liveCount} />}
      </div>
    </Layout>
    </>
  )
}