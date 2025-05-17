import './App.css';
import React, { useState } from "react";
import axios from 'axios';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

// Axios default config
axios.defaults.baseURL = 'https://conversational-server.vercel.app';
axios.defaults.withCredentials = true;

function App() {
  const [question, setQuestion] = useState('');
  const [result, setResult] = useState([]);
  const [sql, setSql] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/query', { question });
      setSql(response.data.sql);
      setResult(response.data.result);
      setMessage(response.data.message || '');
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const isNumeric = (val) => typeof val === 'number' || !isNaN(Number(val));

  const numericColumn = result?.length > 0
    ? Object.keys(result[0]).find(key => isNumeric(result[0][key]))
    : null;

  const labelColumn = result?.length > 0
    ? Object.keys(result[0]).find(key => key !== numericColumn)
    : null;

  return (
    <div className="App" style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h2>Ask Your Database</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Type your question..."
          style={{ padding: '10px', width: '300px', marginRight: '10px' }}
        />
        <button type="submit" style={{ padding: '10px 20px' }}>Submit</button>
      </form>

      {/* {sql && (
        <p><strong>Generated SQL:</strong> <code>{sql}</code></p>
      )} */}

      {message && (
        <p><strong>Relevant Tables:</strong> {message}</p>
      )}

      {result?.length > 0 && (
        <>
          {numericColumn && labelColumn ? (
            <BarChart width={600} height={300} data={result}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={labelColumn} />
              <YAxis />
              <Tooltip />
              <Bar dataKey={numericColumn} fill="#8884d8" />
            </BarChart>
          ) : Object.keys(result[0]).length > 1 ? (
            <table border="1" cellPadding="10" style={{ marginTop: '20px', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {Object.keys(result[0]).map((key) => (
                    <th key={key}>{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {result.map((row, index) => (
                  <tr key={index}>
                    {Object.keys(row).map((key) => (
                      <td key={key}>{row[key]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={{ marginTop: '20px' }}>
              <h3>Result:</h3>
              <ul>
                {result.map((row, index) => (
                  <li key={index}>{row[Object.keys(row)[0]]}</li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;
