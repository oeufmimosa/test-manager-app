import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Suites from './components/Suites';
import Tests from './components/Tests';
import Execution from './components/Execution';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/suites"
          element={
            <ProtectedRoute>
              <Suites />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tests"
          element={
            <ProtectedRoute>
              <Tests />
            </ProtectedRoute>
          }
        />
        <Route
          path="/execution"
          element={
            <ProtectedRoute>
              <Execution />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

