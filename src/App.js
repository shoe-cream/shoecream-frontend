import logo from './logo.svg';
import './App.css';
import LandingPage from './pages/landing/LandingPage';
import { BrowserRouter as Router, Routes, Route, BrowserRouter, useNavigate } from 'react-router-dom';
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
import { AuthProvider } from './auth/AuthContext';
import '@fortawesome/fontawesome-free/css/all.min.css';
import OrderDetail from './pages/OrderManagement/OrderDetail';


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<LoginPage />} />
          <Route path='/dashboard' element={<LandingPage />} />
          <Route path='/buyers' element={<BuyerPostPage />} />
          <Route path='/buyer-items' element={<BuyerItemPostPage />} />
          <Route path='/manufacture-history' element={<ManufactureHistoryPage />} />
          <Route path='/sales-history' element={<SalesHistoryPage />} />
          <Route path='/items' element={<ItemPostPage />} />
          <Route path='/manufacturer-items' element={<ManufacturerItemPostPage />} />
          <Route path='/manufacturers' element={<ManufacturerPostPage />} />
          <Route path='/mypage' element={<MyPage />} />
          <Route path='/cancelled-order' element={<CancelledOrdersPage />} />
          <Route path='/order-approval' element={<OrderApprovalPage />} />
          <Route path='/order' element={<OrderPostPage />} />
          <Route path="/order-detail/:orderCd" element={<OrderDetail />} />
          <Route path='/registration' element={<RegistrationPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
