import { useState, useEffect } from 'react';
import { Editor, DiffEditor } from '@monaco-editor/react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import Auth from './components/Auth';
import './App.css';

function App() {
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [code, setCode] = useState(() => localStorage.getItem('savedCode') || `// Paste your code here...`);
  const [language, setLanguage] = useState(() => localStorage.getItem('savedLanguage') || 'javascript');
  const [review, setReview] = useState(() => JSON.parse(localStorage.getItem('savedReview')) || null);
  
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('metrics');

  useEffect(() => { localStorage.setItem('savedCode', code); }, [code]);
  useEffect(() => { localStorage.setItem('savedLanguage', language); }, [language]);
  useEffect(() => {
    if (review) localStorage.setItem('savedReview', JSON.stringify(review));
    else localStorage.removeItem('savedReview');
  }, [review]);

  function handleLogout() {
    localStorage.removeItem('token');
    setToken(null);
    setHistory([]);
    setReview(null);
    toast.success('Logged out successfully');
  }

  async function reviewCode() {
    try {
      setLoading(true);
      setReview(null); 
      setActiveTab('metrics'); 
      
      const response = await axios.post(
        'https://ai-code-reviewer-bice-pi.vercel.app/ai/get-review', 
        { code, language },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setReview(response.data);
      setHistory([]); 
      toast.success('Code analyzed successfully!');
    } catch (error) {
      console.error("Error fetching review:", error);
      if (error.response?.status === 401) handleLogout();
      toast.error('Failed to get review. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function fetchHistory() {
    setActiveTab('history');
    try {
      setLoading(true);
      const response = await axios.get(
        'https://ai-code-reviewer-bice-pi.vercel.app/ai/history',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setHistory(response.data);
    } catch (error) {
      console.error("Error fetching history:", error);
      if (error.response?.status === 401) handleLogout();
      toast.error('Failed to fetch history.');
    } finally {
      setLoading(false);
    }
  }

  function loadHistoricalReview(historicalItem) {
    setCode(historicalItem.originalCode);
    setLanguage(historicalItem.language || 'javascript');
    setReview(historicalItem.aiResponse);
    setActiveTab('metrics');
    toast.success('Past review loaded!');
  }

  function handleNewCode() {
    setCode(`// Write or paste your new code here...`);
    setReview(null);
    setActiveTab('metrics');
    toast.success('Workspace cleared for new code!');
  }

  async function deleteHistoryItem(id) {
    try {
      await axios.delete(
        `https://ai-code-reviewer-bice-pi.vercel.app/ai/history/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setHistory(prev => prev.filter(item => item._id !== id));
      toast.success('Review deleted permanently.');
    } catch (error) {
      console.error("Error deleting review:", error);
      if (error.response?.status === 401) handleLogout();
      toast.error('Failed to delete review.');
    }
  }

  const confirmDelete = (id, e) => {
    e.stopPropagation();
    toast(
      (t) => (
        <div>
          <p style={{ margin: '0 0 10px 0', fontWeight: 'bold' }}>Delete this review?</p>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => {
                toast.dismiss(t.id);
                deleteHistoryItem(id);
              }}
              style={{ background: '#ff5252', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              Yes, Delete
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              style={{ background: '#444', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { duration: 5000, id: 'delete-toast' }
    );
  };

  if (!token) {
    return (
      <>
        <Toaster toastOptions={{ style: { background: '#333', color: '#fff' } }} />
        <Auth setToken={setToken} />
      </>
    );
  }

  return (
    <main>
      <Toaster toastOptions={{ style: { background: '#333', color: '#fff' } }} />

      <div className="left">
        <div className="editor-header">
          <span className="editor-title">Developer Editor</span>
          <div className="header-actions">
            <select 
              className="language-selector" 
              value={language} 
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="javascript">JavaScript</option>
              <option value="cpp">C++</option>
              <option value="java">Java</option>
              <option value="python">Python</option>
              <option value="c">C</option>
            </select>
            <button className="new-code-btn" onClick={handleNewCode}>+ New Code</button>
            <button 
              onClick={handleLogout} 
              style={{ background: '#ff5252', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', marginLeft: '10px' }}
            >
              Logout
            </button>
          </div>
        </div>

        <div className="editor-container">
          <Editor
            height="100%"
            language={language}
            theme="vs-dark"
            value={code}
            onChange={(value) => setCode(value || "")}
            options={{ minimap: { enabled: false }, fontSize: 16, formatOnPaste: true }}
          />
        </div>
        <button onClick={reviewCode} className="review-btn" disabled={loading}>
          {loading ? "Analyzing..." : "Review Code"}
        </button>
      </div>

      <div className="right">
        <div className="tabs">
          <button className={`tab ${activeTab === 'metrics' ? 'active' : ''}`} onClick={() => setActiveTab('metrics')}>
            Metrics & Issues
          </button>
          <button className={`tab ${activeTab === 'diff' ? 'active' : ''}`} onClick={() => setActiveTab('diff')}>
            Code Diff Viewer
          </button>
          <button className={`tab ${activeTab === 'history' ? 'active' : ''}`} onClick={fetchHistory}>
            Past Reviews
          </button>
        </div>

        <div className="tab-content-container">
          {loading && (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Analyzing architecture and generating tests...</p>
            </div>
          )}

          {activeTab === 'metrics' && !loading && (
            <>
              {!review ? (
                <div className="empty-state">
                  <h2>AI Code Reviewer 🚀</h2>
                  <p>Select your language, paste your code, and click Review to get AI-powered insights.</p>
                </div>
              ) : (
                <div className="tab-content scrollable">
                  <div className="metrics-row">
                    <div className="metric-card score">
                      <h3>Quality Score</h3>
                      <span className="value">{review.codeQualityScore} / 10</span>
                    </div>
                    <div className="metric-card complexity">
                      <h3>Time Complexity</h3>
                      <span className="value">{review.timeComplexity}</span>
                    </div>
                    <div className="metric-card complexity">
                      <h3>Space Complexity</h3>
                      <span className="value">{review.spaceComplexity}</span>
                    </div>
                  </div>

                  {review.issues && review.issues.length > 0 && (
                    <div className="section issues">
                      <h3>⚠️ Detected Issues</h3>
                      <ul>
                        {review.issues.map((issue, index) => (
                          <li key={index}>
                            <strong>[{issue.type.toUpperCase()}] Line {issue.line}:</strong> {issue.description}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {review.suggestions && review.suggestions.length > 0 && (
                    <div className="section suggestions">
                      <h3>💡 Suggestions</h3>
                      <ul>
                        {review.suggestions.map((suggestion, index) => (
                          <li key={index}>{suggestion}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {review.testCases && review.testCases.length > 0 && (
                    <div className="section test-cases">
                      <h3>🧪 AI Generated Edge Cases</h3>
                      <div className="test-case-list">
                        {review.testCases.map((tc, index) => (
                          <div key={index} className="test-case-card">
                            <div className="tc-row"><strong>Input:</strong> <code>{tc.input}</code></div>
                            <div className="tc-row"><strong>Expected:</strong> <code>{tc.expectedOutput}</code></div>
                            <div className="tc-explanation">{tc.explanation}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {activeTab === 'diff' && !loading && (
            <>
              {!review ? (
                <div className="empty-state"><p>No code reviewed yet. Submit code to see the diff viewer.</p></div>
              ) : (
                <div className="tab-content diff-viewer-container">
                  <DiffEditor
                    height="100%"
                    language={language}
                    theme="vs-dark"
                    original={code}
                    modified={review.refactoredCode}
                    options={{ minimap: { enabled: false }, readOnly: true, renderSideBySide: true, fontSize: 14 }}
                  />
                </div>
              )}
            </>
          )}

          {activeTab === 'history' && !loading && (
            <div className="tab-content scrollable">
              <div className="history-header">
                <h2>Your Review History</h2>
                <p>Click on any past review to load it into the editor.</p>
              </div>
              
              {history.length === 0 ? (
                <div className="empty-state"><p>No past reviews found in the database.</p></div>
              ) : (
                <div className="history-list">
                  {history.map((item) => (
                    <div key={item._id} className="history-card" onClick={() => loadHistoricalReview(item)}>
                      <div className="history-card-header">
                        <span className="date">
                          {new Date(item.createdAt).toLocaleString()} 
                          <span style={{marginLeft: '10px', color: '#4CAF50'}}>[{item.language.toUpperCase()}]</span>
                        </span>
                        
                        <div className="card-actions">
                          <span className={`score-badge ${item.aiResponse?.codeQualityScore >= 8 ? 'good' : 'warning'}`}>
                            Score: {item.aiResponse?.codeQualityScore}/10
                          </span>
                          <button className="delete-btn" onClick={(e) => confirmDelete(item._id, e)} title="Delete Review">
                            🗑️
                          </button>
                        </div>
                      </div>
                      <div className="history-card-body">
                        <pre><code>{item.originalCode.substring(0, 100)}...</code></pre>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default App;