import './App.css';
import CalendarView from './components/Calendar/CalendarView';

// using npm big calendar app. Tried npm react scheduler component but this is better
function App() {
  //   const [count, setCount] = useState(0);

  return (
    <>
      <div className="App">
        {/* <h1>Sweat_v2</h1> */}
        <CalendarView />
      </div>
    </>
  );
}

export default App;
