import React, { useState } from 'react';

const ChatInterface = () => {
  const [message, setMessage] = useState('');
  const [citations, setCitations] = useState<string[]>([]);

  const handleCitationsClick = () => {
    setCitations([
      "Holistic Evaluation of Language Models Percy Liang, Rishi Bommasani...",
      "More sophisticated prompting methods could potentially lead to different findings...",
    ]);
  };

  const handleSendMessage = () => {
    // Simulate response and add message handling logic here.
    console.log("Message sent: ", message);
    setMessage('');  // Clear input field
  };

  return (
    <div className="flex-1 p-6">
      <h1 className="text-2xl font-bold mb-6">Build Your Application</h1>
      <div className="bg-white shadow rounded-lg p-4 mb-4">
        <div className="font-semibold mb-2">What is the revenue of JPMC in 2023?</div>
        <div className="text-gray-700 mb-4">
          In 2023, JPMorgan Chase reported an annual revenue of approximately $155.29 billion...
        </div>
        <div className="flex space-x-4 text-sm text-gray-600">
          <div>Tokens: 298</div>
          <div>Latency: 2.5s</div>
          <div>Confidence: 85%</div>
          <button onClick={handleCitationsClick} className="underline text-blue-500">Citations</button>
        </div>
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
