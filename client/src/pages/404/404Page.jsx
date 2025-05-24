import React from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
// import logo from '../assets/logo.png'; // Uncomment and use if it's a local image

function NotFoundPage() {
  const navigate = useNavigate();

  const handleGoHome = () => {
    try {
      navigate('/');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
    <Helmet>
    <title>404 Not Found / adtogro</title>
    </Helmet>
    <div className="relative flex items-center justify-center min-h-screen bg-indigo-300 overflow-hidden">
      {/* 404 text - behind everything */}
      <h1 className="absolute text-[200px] text-white font-extrabold z-0 opacity-20 select-none">
        404
      </h1>

      {/* Full-width SVG foreground image */}
      <img
        src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1600 900'%3E%3Cpolygon fill='%23f0b608' points='957 450 539 900 1396 900'/%3E%3Cpolygon fill='%23e6d710' points='957 450 872.9 900 1396 900'/%3E%3Cpolygon fill='%23e7af05' points='-60 900 398 662 816 900'/%3E%3Cpolygon fill='%23e7d808' points='337 900 398 662 816 900'/%3E%3Cpolygon fill='%23d8a408' points='1203 546 1552 900 876 900'/%3E%3Cpolygon fill='%23f1e213' points='1203 546 1552 900 1162 900'/%3E%3Cpolygon fill='%23f0b607' points='641 695 886 900 367 900'/%3E%3Cpolygon fill='%23e4d506' points='587 900 641 695 886 900'/%3E%3Cpolygon fill='%23eab822' points='1710 900 1401 632 1096 900'/%3E%3Cpolygon fill='%23e8da14' points='1710 900 1401 632 1365 900'/%3E%3Cpolygon fill='%23e8b008' points='1210 900 971 687 725 900'/%3E%3Cpolygon fill='%23edde14' points='943 900 1210 900 971 687'/%3E%3C/svg%3E"
        alt="Foreground graphic"
        className="absolute inset-0 w-full h-full object-cover z-10"
        draggable={false}
      />

      {/* Logo - centered top */}
      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-20">
        {/* If using local image: <img src={logo} alt="Logo" className="h-16" /> */}
        <img
          src="/logo/logo.png"
          alt="Logo"
          className="h-16 drop-shadow-md  grayscale hover:grayscale-0 transition duration-300"
          draggable={false}
        />
      </div>

      {/* Button */}
      <button
        onClick={handleGoHome}
        className="absolute bottom-12 bg-green-500 text-white px-6 py-2 rounded-full font-semibold z-20 shadow hover:shadow-lg"
      >
        Go to Home
      </button>
    </div>
    </>
  );
}

export default NotFoundPage;
