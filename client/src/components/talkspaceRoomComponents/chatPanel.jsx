import React from 'react'
import MessageContainer from './messageContainer'
import MessageInput from './MessageInput'

function ChatPanel() {
  return (
    <div>
      <div className=" w-1/4 min-w-64 border-l border-gray-300 flex flex-col bg-white">
            <div className="p-3 bg-gray-100 border-b border-gray-300 font-medium flex justify-between items-center">
              <span>Chat</span>
              <button onClick={toggleChat} className="text-gray-500 hover:text-gray-700">
                <X size={18} />
              </button>
            </div>
            
            {/* Messages container */}
           <MessageContainer/>
            
            {/* Message input */}
            <MessageInput/>
          </div>
    </div>
  )
}

export default ChatPanel
