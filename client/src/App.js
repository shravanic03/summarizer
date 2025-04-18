import { useState } from 'react';
import axios from 'axios';

function App() {
  const [input, setInput] = useState('');
  const [isURL, setIsURL] = useState(false);
  const [summary, setSummary] = useState('');

  const handleSummarize = async () => {
    const endpoint = isURL ? 'http://localhost:8000/url' : 'http://localhost:8000/text';
    const payload = isURL ? { url: input } : { text: input };

    const res = await axios.post(endpoint, payload);
    setSummary(res.data.summary);
  };

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: "0 auto" }}>
      <h1>🧠 Simple Summarizer</h1>
      <textarea
        placeholder="Enter URL or article text..."
        rows={6}
        style={{ width: '100%', marginBottom: 10 }}
        onChange={(e) => setInput(e.target.value)}
      />
      <div style={{ marginBottom: 10 }}>
        <label>
          <input type="checkbox" onChange={(e) => setIsURL(e.target.checked)} /> This is a URL
        </label>
      </div>
      <button onClick={handleSummarize}>Summarize</button>

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
