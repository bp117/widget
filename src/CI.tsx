import React, { useState } from 'react';

interface Message {
  text: string;
  sender: 'user' | 'bot';
  tokens?: number;
  latency?: string;
}

const ChatInterface = ({ setCitationsVisible }: { setCitationsVisible: (visible: boolean) => void }) => {
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState<Message[]>([]);

  const handleSendMessage = () => {
    if (message.trim() === '') return;

    const userMessage = { text: message, sender: 'user' } as Message;
    setConversation((prev) => [...prev, userMessage]);

    // Simulate bot response with tokens, latency, and citations link
    const botMessage = {
      text: 'In 2023, JPMorgan Chase reported an annual revenue of $155.29 billion...',
      sender: 'bot',
      tokens: 298,
      latency: '2.5s',
    } as Message;

    setTimeout(() => {
      setConversation((prev) => [...prev, botMessage]);
      setCitationsVisible(false); // Ensure citations section is hidden until link is clicked
    }, 1000); // simulate response delay

    setMessage(''); // clear input field
  };

  const handleCitationsClick = () => {
    setCitationsVisible(true); // Show citations section when clicked
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      <h1 className="text-2xl font-bold mb-6">Build Your Application</h1>

      {/* Chat Container */}
      <div className="flex-1 overflow-auto bg-white shadow rounded-lg p-4 mb-4 h-full">
        {conversation.length === 0 && (
          <div className="text-gray-500 text-center">Start the conversation by sending a message.</div>
        )}

        {conversation.map((msg, index) => (
          <div key={index} className={`flex items-end mb-4 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
            {msg.sender === 'bot' && (
              <img src="https://via.placeholder.com/40" alt="bot" className="w-8 h-8 rounded-full mr-2" />
            )}
            <div className={`p-3 max-w-xs rounded-lg ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-black'}`}>
              {msg.text}
              {msg.sender === 'bot' && (
                <div className="text-sm text-gray-500 mt-2">
                  <span>Tokens: {msg.tokens}</span> | <span>Latency: {msg.latency}</span> | 
                  <button onClick={handleCitationsClick} className="underline text-blue-500">Citations</button>
                </div>
              )}
            </div>
            {msg.sender === 'user' && (
              <img src="https://via.placeholder.com/40" alt="user" className="w-8 h-8 rounded-full ml-2" />
            )}
          </div>
        ))}
      </div>

      {/* Input Section */}
      <div className="flex">
        <input
          type="text"
          placeholder="Send your message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="border border-gray-300 rounded-l px-4 py-2 w-full"
        />
        <button onClick={handleSendMessage} className="bg-blue-500 text-white px-4 py-2 rounded-r">Send</button>
      </div>
    </div>
  );
};

export default ChatInterface;
