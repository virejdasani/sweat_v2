import DateSetter from './components/TermDateSetter/DateSetter';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import ProgrammeDesignPage from './pages/admin/ProgrammeDesign/ProgrammeDesign';
import { ChakraProvider } from '@chakra-ui/react';
function App() {
  return (
    <ChakraProvider>
      <Router>
        <Routes>
          <Route
            path="/admin/programme-design"
            element={<ProgrammeDesignPage />}
          />
          <Route path="/admin/set-key-dates" element={<DateSetter />} />
        </Routes>
        <ToastContainer />
      </Router>
    </ChakraProvider>
  );
}

export default App;
