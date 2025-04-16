import React, { useState } from 'react';

function NotFoundPage() {
  const [culprit, setCulprit] = useState(null);
  const [forgiven, setForgiven] = useState(false);

  const developers = [
    { id: 1, name: 'Irshadudheen', excuse: 'Was too busy fixing other bugs' ,image:'/Irshadudheen.jpg' },
    { id: 2, name: 'Shamil', excuse: 'Blamed it on a "network issue"',image:'https://media.licdn.com/dms/image/v2/D5622AQEn90wMu7SuVg/feedshare-shrink_800/feedshare-shrink_800/0/1733151933599?e=1747872000&v=beta&t=xGnKrgJF8aPqgMIk3d3QqCz0dyIeCi1fnKFHog4pF2o' },
    { id: 3, name: 'Harshad', excuse: 'Said "It works on my machine!"',image:'/harshad.png' },
    
  ];

  const handleBlame = (devId) => {
    setCulprit(developers.find(dev => dev.id === devId));
  };

  const handleForgive = () => {
    setForgiven(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-6 text-center">
        <h1 className="text-6xl font-bold text-black mb-2">Whoops!</h1>
        <h2 className="text-2xl text-gray-700 mb-6">404 - Page not found</h2>
        
        <p className="text-lg text-gray-600 mb-8">
          One of our development team must be punished for this unacceptable failure!
        </p>
        
        {!culprit && !forgiven && (
          <>
            <div className="text-xl font-semibold text-black mb-6">
              PICK WHO TO BLAME!
            </div>
            
            <div className="flex flex-wrap justify-center gap-6 mb-10">
              {developers.map(dev => (
                <div key={dev.id} className="w-64 flex flex-col items-center">
                  <div className="mb-4 bg-gray-200 rounded-lg overflow-hidden h-48 w-48 flex items-center justify-center">
                    <img 
                      src={`${dev.image}`} 
                      alt={dev.name} 
                      className="w-full transition-transform hover:scale-105 cursor-pointer"
                      onClick={() => handleBlame(dev.id)}
                    />
                  </div>
                  <button 
                    className="bg-black hover:bg-gray-800 text-white py-2 px-6 rounded-md transition-colors"
                    onClick={() => handleBlame(dev.id)}
                  >
                    {dev.name}
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
        
        {culprit && !forgiven && (
          <div className="mb-8">
            <div className="text-xl font-bold mb-2">You blamed {culprit.name}!</div>
            <div className="text-lg mb-6">"{culprit.excuse}"</div>
            <div className="flex justify-center gap-4">
              <button 
                className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-md transition-colors"
                onClick={handleForgive}
              >
                Forgive them
              </button>
              <button 
                className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-6 rounded-md transition-colors"
                onClick={() => setCulprit(null)}
              >
                Choose someone else
              </button>
            </div>
          </div>
        )}
        
        {forgiven && (
          <div className="mb-8">
            <div className="text-xl font-bold text-green-600 mb-4">
              In a forgiving mood? Everyone gets to keep their jobs!
            </div>
            <div className="text-lg mb-6">
              Our developers appreciate your mercy and promise to fix this issue... eventually.
            </div>
            <button 
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md transition-colors"
              onClick={() => {
                setCulprit(null);
                setForgiven(false);
              }}
            >
              Start over
            </button>
          </div>
        )}
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <a 
            href="/" 
            className="text-black hover:text-gray-800 font-medium"
          >
            Return to the homepage
          </a>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;