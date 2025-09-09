import React, { useState, useEffect } from 'react';
import { RefreshCcw } from 'lucide-react';

const Add = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

 const fetchNews = async () => {
  setLoading(true);
  setError(null);

  try {
    const API_KEY = "AIzaSyDgDLx3jzBCg_fNR6uZF1Mb6DCwfOa1u_w";
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5:generateContent?key=${API_KEY}`;

    const payload = {
      // Using "messages" instead of "prompt"
      messages: [
        {
          role: "system",
          content: [
            { type: "text", text: "You are a financial news aggregator for India." }
          ]
        },
        {
          role: "user",
          content: [
            { type: "text", text: "Provide the top 6 latest financial news headlines from India in JSON format with 'title', 'summary', and 'source'." }
          ]
        }
      ],
      temperature: 0.5,
      maxOutputTokens: 500
    };

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const textResult = data.candidates?.[0]?.content?.[0]?.text;

    if (textResult) {
      const parsedNews = JSON.parse(textResult); // Make sure the API returns valid JSON
      setNews(parsedNews);
    } else {
      throw new Error("Invalid response from API.");
    }

  } catch (e) {
    console.error("Failed to fetch news:", e);
    setError("Failed to fetch news. Please try again later.");
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchNews();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8 font-sans">
      <header className="flex flex-col items-center justify-center mb-12 text-center">
        <h1 className="text-5xl font-extrabold text-blue-400 mb-2">India Finance News</h1>
        <p className="text-xl font-light text-gray-400">Top headlines from the Indian financial world.</p>
      </header>
      
      <div className="flex justify-center mb-8">
        <button
          onClick={fetchNews}
          className="bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-xl transition duration-300 transform hover:scale-105 shadow-md flex items-center space-x-2"
          disabled={loading}
        >
          <RefreshCcw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? 'Refreshing...' : 'Refresh News'}</span>
        </button>
      </div>

      {error && (
        <div className="text-center text-red-400 p-4 bg-gray-800 rounded-xl max-w-lg mx-auto mb-8">
          {error}
        </div>
      )}

      {loading && !error && (
        <div className="text-center text-lg text-gray-400">
          <p>Fetching the latest news...</p>
        </div>
      )}

      {!loading && news.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((item, index) => (
            <div key={index} className="bg-gray-800 p-6 rounded-2xl shadow-xl transition-transform transform hover:scale-105">
              <h2 className="text-xl font-bold text-blue-400 mb-2">{item.title}</h2>
              <p className="text-gray-300 mb-4">{item.summary}</p>
              <span className="text-sm text-gray-500 font-medium">{item.source}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Add;
