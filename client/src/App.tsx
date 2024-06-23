import DateSetter from './components/TermDateSetter/DateSetter';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import ProgrammeDesignPage from './pages/admin/ProgrammeDesign/ProgrammeDesignPage';
import CreateModulePage from './pages/admin/CreateModule/CreateModulePage';
import CourseworkCalendar from './components/CourseworkCalendar/CourseworkCalendar';
import AcademicEventCalendar from './components/AcademicEventCalendar/AcademicEventCalendar';
import Home from './components/Home/Home';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/admin/set-key-dates" element={<DateSetter />} />
        <Route path="/coursework-calendar" element={<CourseworkCalendar />} />
        <Route
          path="/academic-event-calendar"
          element={<AcademicEventCalendar />}
        />
        <Route path="/admin/create-module" element={<CreateModulePage />} />
        <Route
          path="/admin/programme-design"
          element={<ProgrammeDesignPage />}
        />
      </Routes>
      <ToastContainer />
    </Router>
  );
}

export default App;
