import React from 'react'

function MessageInput() {
      const [messageInput, setMessageInput] = useState('');
        const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };
  const sendMessage = () => {
    if (messageInput.trim() === '') return;
    
    const newMessage = {
      type: 'local',
      content: messageInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    // Add message to local state
    setMessages(prev => [...prev, newMessage]);
    
    // Send message through socket
    socketRef.current.emit('chat_message', {
      roomId,
      message: messageInput
    });
    
    // Clear input
    setMessageInput('');
  };
  return (
    <div>
      <div className="p-3 border-t border-gray-300">
              <div className="flex">
                <textarea
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Type a message..."
                  className="flex-1 p-2 border border-gray-300 rounded-l focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                  rows="2"
                />
                <button
                  onClick={sendMessage}
                  disabled={!messageInput.trim()}
                  className={`p-2 mx-0.5 rounded-r flex items-center justify-center ${!messageInput.trim() ? 'bg-gray-300' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
                >
                  <Send size={20} />
                </button>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Press Enter to send, Shift+Enter for new line
              </div>
            </div>
    </div>
  )
}

export default MessageInput
