
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import Marketplace from './components/Marketplace';
import CreateNFT from './components/CreateNFT';
import MyListedItems from './components/MyListedItems';
import MyPurchases from './components/MyPurchases';
import Navbar from './components/Navbar';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-950">
        <Navbar />
        <Routes>
          <Route path="/" element={<Marketplace />} />
          <Route path="/create" element={<CreateNFT />} />
          <Route path="/my-listed-items" element={<MyListedItems />} />
          <Route path="/my-purchases" element={<MyPurchases />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
