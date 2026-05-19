import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/NavBar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Veiculo from './pages/Veiculo';
import Oficinas from './pages/Oficinas';
import SobreNos from './pages/SobreNos';

import './assets/css/style.css'; // CSS Global

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/veiculo/:id" element={<Veiculo />} />
        <Route path="/oficinas" element={<Oficinas />} />
        <Route path="/sobre-nos" element={<SobreNos />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;