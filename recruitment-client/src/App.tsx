import React, { useEffect, useState } from 'react';

function App() {
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    fetch('http://localhost:5000/api/test')
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch((err) => console.error('Error fetching API:', err));
  }, []);

  return (
    <div>
      <h1>Recruitment App Frontend</h1>
      <p>API Response: {message}</p>
    </div>
  );
}

export default App;