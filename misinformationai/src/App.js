import React, { useState } from 'react';
import './App.css';

function App() {
  // State to hold the user's input
  const [fact, setFact] = useState('');

  // State to hold the result of the fact check
  const [isCorrect, setIsCorrect] = useState(null); // null indicates no result yet

  // State to hold the submission text from the API
  const [submissionText, setSubmissionText] = useState('');

  // State to manage loading status
  const [loading, setLoading] = useState(false);

  // State to manage error messages
  const [error, setError] = useState('');

  // Predefined example prompts
  const examplePrompts = [
    "The Great Wall of China is visible from space.",
    "Bananas grow on trees.",
    "Lightning never strikes the same place twice."
  ];

  // Handler for textarea changes
  const handleChange = (e) => {
    setFact(e.target.value);
  };

  // Handler for form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous results and errors
    setIsCorrect(null);
    setSubmissionText('');
    setError('');

    // Validate input
    if (!fact.trim()) {
      setError('Please enter a fun fact to check.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:5000', {
        method: 'POST',
        body: JSON.stringify( fact),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      // Assuming your API returns:
      // {
      //   isCorrect: true, // or false
      //   submissionText: "Your two-sentence analysis here."
      // }
      console.log(data);
      setIsCorrect(data["isCorrect"]);
      setSubmissionText(data["submissionText"]);
    } catch (error) {
      console.error('Error:', error);
      setError('⚠️ An error occurred while checking the fact. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Handler for example button clicks
  const handleExampleClick = (example) => {
    setFact(example);
    // Automatically submit after setting the fact
    // Use a timeout to ensure state is updated before submission
    setTimeout(() => {
      handleSubmit({ preventDefault: () => {} });
    }, 0);
  };

  // Determine background color based on isCorrect
  const getBackgroundColor = () => {
    if (isCorrect === true) return '#d4edda'; // Light green
    if (isCorrect === false) return '#f8d7da'; // Light red
    return '#ffffff'; // Default white
  };

  return (
    <div className="App" style={{ backgroundColor: getBackgroundColor(), transition: 'background-color 0.5s' }}>
      <header className="App-header">
        <h1>AI Misinformation Checker</h1>
      </header>

      <div className="container">
        {/* Sidebar with example prompts */}
        <div className="sidebar">
          <h2>Example Prompts</h2>
          {examplePrompts.map((example, index) => (
            <button
              key={index}
              className="example-button"
              onClick={() => handleExampleClick(example)}
              disabled={loading}
            >
              Example {index + 1}
            </button>
          ))}
        </div>

        {/* Main content area */}
        <div className="main-content">
          <form onSubmit={handleSubmit}>
            <textarea
              value={fact}
              onChange={handleChange}
              placeholder="Enter a fun fact here..."
              rows="6"
              className="fact-textarea"
              disabled={loading}
            />
            <br />
            <button type="submit" className="submit-button" disabled={loading || !fact.trim()}>
              {loading ? "Checking..." : "Submit"}
            </button>
          </form>

          {/* Display error message */}
          {error && <p className="error">{error}</p>}

          {/* Display the result */}
          {isCorrect !== null && (
            <div className="result-container">
              <p className="result-icon">
                {isCorrect ? '✅ Fact is correct.' : '❌ Fact is incorrect.'}
              </p>
              <p className="submission-text">{submissionText}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
