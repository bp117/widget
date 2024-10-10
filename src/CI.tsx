import React, { useState } from 'react';

interface Message {
  text: string;
  sender: 'user' | 'bot';
}

const ChatInterface = ({ setCitations }: { setCitations: (citations: string[]) => void }) => {
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState<Message[]>([]);

  const handleSendMessage = () => {
    if (message.trim() === '') return;

    const userMessage = { text: message, sender: 'user' } as Message;
    setConversation((prev) => [...prev, userMessage]);

    // Simulate bot response
    const botMessage = { text: 'In 2023, JPMorgan Chase reported an annual revenue of $155.29 billion...', sender: 'bot' } as Message;
    setTimeout(() => {
      setConversation((prev) => [...prev, botMessage]);
      setCitations([
        'Holistic Evaluation of Language Models Percy Liang, Rishi Bommasani...',
        'More sophisticated prompting methods could potentially lead to different findings...',
      ]);
    }, 1000); // simulate response delay

    setMessage(''); // clear input
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      <h1 className="text-2xl font-bold mb-6">Build Your Application</h1>
      <div className="flex-1 overflow-auto bg-white shadow rounded-lg p-4 mb-4 h-full">
        {conversation.map((msg, index) => (
          <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : ''} mb-4`}>
            {msg.sender === 'bot' && (
              <img src="bot-avatar-url" alt="bot" className="w-8 h-8 rounded-full mr-2" />
            )}
            <div className={`p-3 rounded-lg ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-black'}`}>
              {msg.text}
            </div>
            {msg.sender === 'user' && (
              <img src="user-avatar-url" alt="user" className="w-8 h-8 rounded-full ml-2" />
            )}
          </div>
        ))}
      </div>
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
