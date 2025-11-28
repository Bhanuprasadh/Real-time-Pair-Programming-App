import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import JoinRoom from './features/room/JoinRoom';
import Room from './features/room/Room';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<JoinRoom />} />
        <Route path="/room/:id" element={<Room />} />
      </Routes>
    </Router>
  );
}

export default App;
