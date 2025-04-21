import { useState } from 'react';
import axios from 'axios';

function App() {
  const [input, setInput] = useState('');
  const [isURL, setIsURL] = useState(false);
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);

  const GEMINI_API_KEY = 'AIzaSyAvBpszXtmqAnbOcReMn0WfqRNCxl-BAxU'; // 🔐 Replace with your actual API key

  const fetchTextFromURL = async (url) => {
    try {
      const res = await axios.get(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
      return res.data.contents;
    } catch (err) {
      console.error("Failed to fetch content from URL", err);
      return '';
    }
  };

  const handleSummarize = async () => {
    setLoading(true);
    let content = input;

    if (!input.trim()) {
      setSummary('Please enter some text or a valid URL.');
      setLoading(false);
      return;
    }

    if (isURL) {
      content = await fetchTextFromURL(input);
      if (!content) {
        setSummary('Failed to extract content from the URL.');
        setLoading(false);
        return;
      }
    }

    const prompt = `
You are an expert summarizer.

Your task is to read the following article or content and generate a clear, concise, and informative summary. 
Make sure the summary captures the key points, main arguments, and any important data or conclusions.

Here is the content to summarize:

""" 
${content}
"""

Please provide the summary in 4-6 sentences.
`;

    try {
      const res = await axios.post(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
        {
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': GEMINI_API_KEY,
          },
        }
      );

      const result = res.data.candidates?.[0]?.content?.parts?.[0]?.text || 'No summary generated.';
      setSummary(result);
    } catch (err) {
      console.error("Error while calling Gemini API:", err);
      setSummary('Error while summarizing. Please check your API key or try again later.');
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: "0 auto" }}>
      <h1>🧠 Simple Summarizer</h1>
      <textarea
        placeholder="Enter URL or article text..."
        rows={6}
        style={{ width: '100%', marginBottom: 10 }}
        onChange={(e) => setInput(e.target.value)}
        value={input}
      />
      <div style={{ marginBottom: 10 }}>
        <label>
          <input type="checkbox" onChange={(e) => setIsURL(e.target.checked)} /> This is a URL
        </label>
      </div>
      <button onClick={handleSummarize} disabled={loading}>
        {loading ? "Summarizing..." : "Summarize"}
      </button>

      {summary && (
        <div style={{ marginTop: 20 }}>
          <h3>Summary:</h3>
          <p>{summary}</p>
        </div>
      )}
    </div>
  );
}

export default App;
