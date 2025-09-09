// AIChatbox.jsx
import React, { useState } from 'react';
const API_KEY = "AIzaSyDgDLx3jzBCg_fNR6uZF1Mb6DCwfOa1u_w";
function AIChatbox() {
    const [chatMessages, setChatMessages] = useState([{ sender: 'bot', text: "Hello! I'm here to help you. What would you like to know?" }]);
    const [chatInput, setChatInput] = useState('');
    const [isThinking, setIsThinking] = useState(false);

    const sendMessageToBot = async (message) => {
        setIsThinking(true);
        setChatMessages(prev => [...prev, { sender: 'user', text: message }]);
        setChatInput('');
        
        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: message }] }],
                    tools: [{ "google_search": {} }],
                    systemInstruction: {
                        parts: [{ text: "You are an AI assistant. Provide helpful, concise information. Do not give financial advice." }]
                    }
                })
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.statusText}`);
            }

            const result = await response.json();
            const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;
            
            if (text) {
                setChatMessages(prev => [...prev, { sender: 'bot', text }]);
            } else {
                setChatMessages(prev => [...prev, { sender: 'bot', text: "I'm sorry, I couldn't get a response. Please try again." }]);
            }

        } catch (error) {
            console.error("Error calling Gemini API:", error);
            setChatMessages(prev => [...prev, { sender: 'bot', text: "An error occurred while fetching a response." }]);
        } finally {
            setIsThinking(false);
        }
    };

  return (
      <div className="min-h-screen bg-gray-700 flex items-center justify-center">
            <div className="w-1/2 flex flex-col h-[80vh] bg-gray-800 rounded-lg shadow-xl ">
                <div className="flex-grow overflow-y-auto p-4 space-y-4">
                    {chatMessages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`p-3 rounded-lg max-w-xs ${msg.sender === 'user' ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-200'}`}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    {isThinking && (
                        <div className="flex justify-start">
                            <div className="p-3 rounded-lg max-w-xs bg-gray-700 text-gray-200">
                                <div className="loading-dots flex space-x-1">
                                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
                                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <div className=" flex items-center space-x-2 border-t border-gray-700">
                    <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && chatInput.trim() && sendMessageToBot(chatInput)}
                        className="flex-grow p-2 border rounded-full bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-600"
                        placeholder="Ask me a question..."
                    />
                    <button
                        onClick={() => chatInput.trim() && sendMessageToBot(chatInput)}
                        className="bg-green-600 text-white w-10 h-10 flex items-center justify-center rounded-full hover:bg-green-700"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 rotate-45" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l.643-.172a.5.5 0 01.189-.009l.344.085a1 1 0 00.957-.465l1.32-2.31a.5.5 0 01.454-.25l2.67-1.12a.5.5 0 01.385-.018l2.645 1.058a1 1 0 001.127-.087l.343-.244a.5.5 0 01.18-.04l.707.707z" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
  );
}

export default AIChatbox;
