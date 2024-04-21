import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import DateSetter from './components/TermDateSetter/DateSetter';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin/set-key-dates" element={<DateSetter />} />
      </Routes>
    </Router>
  );
}

export default App;
