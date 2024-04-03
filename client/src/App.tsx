import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import ProgrammeDesignPage from './pages/admin/ProgrammeDesign/ProgrammeDesign';

function App() {
  return (
    <Router>
      <Routes>
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
