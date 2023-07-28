import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from 'react/pages/home';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}
