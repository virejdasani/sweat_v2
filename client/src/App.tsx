import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import DateSetter from './components/TermDateSetter/DateSetter';
import CourseworkCalendar from './components/CourseworkCalendar/CourseworkCalendar';
import Home from './components/Home/Home';

function App() {
  return (
    <Router>
      <Routes>
        {/* home */}
        <Route path="/" element={<Home />} />

        <Route path="/admin/set-key-dates" element={<DateSetter />} />
        <Route path="/coursework-calendar" element={<CourseworkCalendar />} />
      </Routes>
    </Router>
  );
}

export default App;
