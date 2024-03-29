import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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
    </Router>
  );
}

export default App;
