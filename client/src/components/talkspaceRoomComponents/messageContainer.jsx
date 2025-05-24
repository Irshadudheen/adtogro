import React, { useRef, useState } from 'react'

function MessageContainer() {
      const chatContainerRef = useRef(null);
        const [messages, setMessages] = useState([]);
  return (
    <div>
       <div 
              ref={chatContainerRef} 
              className="flex-1 overflow-y-auto p-4 space-y-3"
            >
              {messages.map((msg, index) => (
                <div key={index} className={`max-w-xs ${msg.type === 'local' ? 'ml-auto' : msg.type === 'system' ? 'mx-auto text-center' : ''}`}>
                  {msg.type === 'system' ? (
                    <div className="text-xs text-gray-500 py-1 px-2 bg-gray-100 rounded inline-block">
                      {msg.content}
                    </div>
                  ) : (
                    <div className={`p-3 rounded-lg ${msg.type === 'local' ? 'bg-black text-white' : 'bg-gray-200'}`}>
                      {msg.type === 'remote' && (
                        <div className="text-xs font-medium text-gray-700 mb-1">
                           {msg.sender}
                        </div>
                      )}
                      <div>{msg.content}</div>
                      <div className="text-xs mt-1 text-right opacity-75">
                        {msg.time}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
    </div>
  )
}

export default MessageContainer
