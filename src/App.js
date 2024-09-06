import logo from './logo.svg';
import './App.css';
import LandingPage from './pages/landing/LandingPage';
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from 'react-router-dom';
import LoginPage from './pages/login/LoginPage';
import BuyerItemPostPage from './pages/buyer/BuyerItemPostPage';
import ManufactureHistoryPage from './pages/history/ManufactureHistoryPage';
import SalesHistoryPage from './pages/history/SalesHistoryPage';
import ItemPostPage from './pages/item/ItemPostPage';
import ManufacturerItemPostPage from './pages/manufacturer/ManufacturerItemPostPage';
import ManufacturerPostPage from './pages/manufacturer/ManufacturerPostPage';
import MyPage from './pages/mypage/MyPage';
import CancelledOrdersPage from './pages/OrderManagement/CancelledOrdersPage';
import OrderApprovalPage from './pages/OrderManagement/OrderApprovalPage';
import OrderPostPage from './pages/OrderManagement/OrderPostPage';
import RegistrationPage from './pages/registration/RegistrationPage';
import BuyerPostPage from './pages/buyer/BuyerPostPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LandingPage/>}/>
        <Route path='/login' element={<LoginPage/>}/>
        <Route path='/buyer' element={<BuyerPostPage/>}/>
        <Route path='/buyer-item' element={<BuyerItemPostPage/>}/>
        <Route path='/manufacture-history' element={<ManufactureHistoryPage/>}/>
        <Route path='/sales-history' element={<SalesHistoryPage/>}/>
        <Route path='/item' element={<ItemPostPage/>}/>
        <Route path='/manufacturer-item' element={<ManufacturerItemPostPage/>}/>
        <Route path='/manufacturer' element={<ManufacturerPostPage/>}/>
        <Route path='/mypage' element={<MyPage/>}/>
        <Route path='/cancelled-order' element={<CancelledOrdersPage/>}/>
        <Route path='/order-approval' element={<OrderApprovalPage/>}/>
        <Route path='/order' element={<OrderPostPage/>}/>
        <Route path='/registration' element={<RegistrationPage/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
