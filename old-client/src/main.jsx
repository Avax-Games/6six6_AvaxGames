import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { Battle, Home } from './page';
import './index.css';

// Error boundary component to catch any context-related errors
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-screen flex flex-col items-center justify-center bg-black text-white p-4">
          <h1 className="text-2xl mb-4">Something went wrong</h1>
          <p className="mb-4">Please refresh the page and try again.</p>
          <pre className="bg-gray-800 p-4 rounded max-w-full overflow-auto">
            {this.state.error && this.state.error.toString()}
          </pre>
          <button 
            className="mt-4 px-4 py-2 bg-red-600 rounded hover:bg-red-700"
            onClick={() => window.location.reload()}
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/battle/:battleName" element={<Battle />} />
        </Routes>
    </BrowserRouter>
  </ErrorBoundary>,
);
