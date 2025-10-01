
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/" element={<Navigate to="/admin" replace />} />
        </Routes>
      </div>
    </Router>
  );
}


export default App;

