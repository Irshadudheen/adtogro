import React, { useState } from 'react';
import { Heart, Coffee, MessageCircle, Users, DollarSign, Gift, Star, User } from 'lucide-react';
import { Helmet } from 'react-helmet';

function CoffeeSupport() {
  const [selectedAmount, setSelectedAmount] = useState(10);
  const [customAmount, setCustomAmount] = useState('');
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('supporters');
  const handlePayment = ()=>{
    try {
 
      if(customAmount){

        if(customAmount>selectedAmount &&customAmount>=10){
          console.log(customAmount,selectedAmount)
         
        }
      }
    } catch (error) {
      
    }
  }
  // Mock data for supporters
  const supporters = [
    {
      id: 1,
      name: "Sarah Johnson",
      amount: 25,
      message: "Love your work! Keep it up! ☕",
      avatar: "SJ",
      timestamp: "2 hours ago",
      coffees: 5
    },
    {
      id: 2,
      name: "Mike Chen",
      amount: 10,
      message: "Thanks for the amazing content",
      avatar: "MC",
      timestamp: "5 hours ago",
      coffees: 2
    },
    {
      id: 3,
      name: "Emma Davis",
      amount: 50,
      message: "Your tutorials saved me so much time! Here's a big coffee for you! 🚀",
      avatar: "ED",
      timestamp: "1 day ago",
      coffees: 10
    },
    {
      id: 4,
      name: "Alex Rodriguez",
      amount: 15,
      message: "Great work on the latest project!",
      avatar: "AR",
      timestamp: "2 days ago",
      coffees: 3
    },
    {
      id: 5,
      name: "Lisa Wang",
      amount: 20,
      message: "Supporting creativity one coffee at a time ☕❤️",
      avatar: "LW",
      timestamp: "3 days ago",
      coffees: 4
    }
  ];

  const totalSupport = supporters.reduce((sum, supporter) => sum + supporter.amount, 0);
  const totalSupporters = supporters.length;

  const handleAmountSelect = (amount) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmount = (value) => {
    setCustomAmount(value);
    setSelectedAmount(0);
  };

  const getCurrentAmount = () => {
    return customAmount ? parseFloat(customAmount) || 0 : selectedAmount;
  };

  const getCoffeeCount = () => {
    return Math.floor(getCurrentAmount() / 5);
  };

  return (
    <>
      <Helmet>
        <title>Buy Me a Coffee / AdToGro</title>
        <meta name="description" content="Support my work by buying me a coffee! Every contribution helps me continue creating content and pursuing my passion." />
        <meta name="keywords" content="buy me a coffee, support, donation, coffee, creator support" />
        <meta name="author" content="Irshadudheen" />
        <link rel="canonical" href="https://www.adtogro.com/coffee" />
      </Helmet>
    <div className="bg-[url('/backgroundImage/medium-shot-man-woman-with-coffee.jpg')] bg-amber-500 bg-cover bg-center bg-fixed min-h-screen py-8 px-4">
    <div className="min-h-screen bg-gradient-to-br  py-8 px-4">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full mb-4 shadow-lg">
            <Coffee className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Buy Me a Coffee</h1>
          
        </div>
    <div className="bg-white rounded-2xl p-8 shadow-lg border border-orange-100 mb-10">
  <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
    The Human Behind the Code / Content / Art
  </h2>
  <p className="text-gray-700 leading-relaxed font-poppins">
    Hey there, I'm <span className="text-orange-500">Irshadudheen</span>.
     I love creating things that people can actually use and enjoy.
      I'm always up for random conversations, meeting new people,
       and learning about different cultures. Whether it’s sharing ideas
        or picking up something new, 
        I enjoy being part of anything that helps me grow and connect.
         Thanks for being here.
  </p>
</div>
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-r from-amber-400 to-orange-500  rounded-xl p-6 text-center shadow-sm border border-orange-300">
            <DollarSign className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">${totalSupport}</div>
            <div className="text-sm text-white">Total Support</div>
          </div>
          <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-orange-100">
            <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-800">{totalSupporters}</div>
            <div className="text-sm text-gray-600">Supporters</div>
          </div>
          <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-orange-100 col-span-2 md:col-span-1">
            <Coffee className="w-8 h-8 text-amber-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-800">{Math.floor(totalSupport / 5)}</div>
            <div className="text-sm text-gray-600">Coffees Bought</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Support Form */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-orange-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <Gift className="w-6 h-6 mr-2 text-orange-500" />
              Support My Work
            </h2>

            {/* Amount Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">Choose Amount</label>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {[10, 20, 50].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => handleAmountSelect(amount)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      selectedAmount === amount
                        ? 'border-orange-500 bg-orange-50 text-orange-600'
                        : 'border-gray-200 hover:border-orange-300'
                    }`}
                  >
                    <div className="text-lg font-bold">${amount}</div>
                    <div className="text-xs text-gray-500">{Math.floor(amount / 5)} coffees</div>
                  </button>
                ))}
              </div>
              
              <div>
                <label className="block text-sm text-gray-600 mb-2">Custom Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={customAmount}
                    onChange={(e) => handleCustomAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    min="1"
                  />
                </div>
              </div>
            </div>

            {/* Message */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Leave a message (optional)
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Say something nice... ☕"
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
                rows="3"
              />
            </div>

            {/* Coffee Preview */}
            {getCurrentAmount() > 0 && (
              <div className="bg-orange-50 rounded-xl p-4 mb-6 border border-orange-200">
                <div className="flex items-center justify-between">
                  <span className="text-orange-700 font-medium">
                    You're buying {getCoffeeCount()} coffee{getCoffeeCount() !== 1 ? 's' : ''}!
                  </span>
                  <div className="flex">
                    {[...Array(Math.min(getCoffeeCount(), 5))].map((_, i) => (
                      <Coffee key={i} className="w-5 h-5 text-orange-500 ml-1" />
                    ))}
                    {getCoffeeCount() > 5 && (
                      <span className="text-orange-500 ml-1 font-bold">+{getCoffeeCount() - 5}</span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Support Button */}
            <button onClick={handlePayment} className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold py-4 px-6 rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all transform hover:scale-105 shadow-lg">
              <div className="flex items-center justify-center">
                <Heart className="w-5 h-5 mr-2" />
                Support with ${getCurrentAmount() || 0}
              </div>
            </button>
          </div>

          {/* Supporters List */}
          <div className="bg-white rounded-2xl shadow-lg border border-orange-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                  <Users className="w-6 h-6 mr-2 text-orange-500" />
                  Recent Supporters
                </h2>
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setActiveTab('supporters')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                      activeTab === 'supporters'
                        ? 'bg-white text-orange-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    Supporters
                  </button>
                  <button
                    onClick={() => setActiveTab('comments')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                      activeTab === 'comments'
                        ? 'bg-white text-orange-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    Comments
                  </button>
                </div>
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {supporters.map((supporter) => (
                <div key={supporter.id} className="p-6 border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {supporter.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-800 truncate">
                          {supporter.name}
                        </h3>
                        <div className="flex items-center text-sm text-gray-500">
                          <Coffee className="w-4 h-4 mr-1 text-amber-500" />
                          {supporter.coffees}
                        </div>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-lg font-bold text-green-600">
                          ${supporter.amount}
                        </span>
                        <span className="text-xs text-gray-500">{supporter.timestamp}</span>
                      </div>
                      {supporter.message && (
                        <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700">
                          <MessageCircle className="w-4 h-4 inline mr-2 text-gray-400" />
                          {supporter.message}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Message */}
        <div className="text-center mt-8 p-6 bg-gradient-to-r from-amber-400 to-orange-500 rounded-xl shadow-sm border border-orange-300">
          <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
          <h3 className="text-lg font-semibold text-white mb-2">Thank You for Your Support!</h3>
          <p className="text-white">
            Every contribution helps me continue creating content and pursuing my passion. 
            Your support means the world to me!
          </p>
        </div>
      </div>
    </div>
    </div>
        </>
  );
}

export default CoffeeSupport;