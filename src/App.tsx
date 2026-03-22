// src/App.tsx
import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginScreen from './components/LoginScreen';
import DashboardHome from './pages/DashboardHome';
import UsersPage from './pages/UsersPage';
import DashboardLayout from './components/DashboardLayout';
import FilteredTablePage from './pages/FilteredTablePage';
import BillSubmitted from './pages/BillSubmitted';
import TourListPage from './pages/TourListPage';
import TourSubmitted from './pages/TourSubmitted';
import ToursApproved from './pages/ToursApproved';
import ToursOngoing from './pages/ToursOngoing';
import ToursCompleted from './pages/ToursCompleted';
import MgrBillReturned from './pages/mgr_bill_returned';
import MgrBillApproved from './pages/mgr_bill_approved';
import FinBillApproved from './pages/fin_bill_approved';
import FinBillRejected from './pages/fin_bill_rejected';
import FinPendingBills from './pages/fin_bill_pending';
import ToursRejected from './pages/reports/tours_rejected';
import EngineersInTour from './pages/reports/engineers_in_tour';
import EngineersAvailable from './pages/reports/engineers_available';
import EngineersUtilization from './pages/reports/engineers_utilization';
import BranchWiseRevenue from './pages/reports/branch_wise_revenue';
import MachineAgeingReport from './pages/reports/machine_ageing_report';
import RevenueAddBill from './pages/revenue/revenue_add_bill';
import Employees from './pages/admin/Employees';
import Customers from './pages/admin/Customers';
import EmailUpdate from './pages/admin/EmailUpdate';
import ChangeTourStatus from './pages/admin/ChangeTourStatus';
import ChangeOdometer from './pages/admin/ChangeOdometer';
import PfrUploaded from './pages/pfr/pfr_uploaded';
import ChangeTiming from './pages/admin/ChangeTiming';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('name');
    localStorage.removeItem('email');
    localStorage.removeItem('avatar');
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    // return <LoginScreen />;
    // IMPORTANT: pass handleLogin into LoginScreen and don't render Routes here
    return <LoginScreen onLogin={handleLogin} />;
  }

  // return isLoggedIn ? (
  //   <Dashboard onLogout={handleLogout} />
  // ) : (
  //   <LoginScreen onLogin={handleLogin} />
  // );
  return (
    <Routes>
        {/* redirect root to /dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        {/* layout route: sidebar + topbar */}
        {/* <Route path="/" element={<DashboardLayout onLogout={() => { } } children={undefined} />}> */}
        <Route path="/" element={<DashboardLayout onLogout={handleLogout} children={undefined} />}>
        <Route path="dashboard" element={<DashboardHome />} />
        {/* Admin Section */}
        <Route path="admin/employees" element={<Employees />} />
        <Route path="admin/customers" element={<Customers />} />
        <Route path="/admin/emailupdate" element={<EmailUpdate />} />
        <Route path="/admin/change-timing" element={<ChangeTiming />} />
        <Route path="/admin/change-tour-status" element={<ChangeTourStatus />} />
        <Route path="/admin/change-odometer" element={<ChangeOdometer />} />

        {/* PFR Section */}
        <Route path="pfr/list" element={<PfrUploaded />} />

        {/* Tour Manager Section */}
        <Route path="/mgr/tours-submitted" element={<TourSubmitted />} />
        <Route path="/mgr/tours-approved" element={<ToursApproved />} />
        <Route path="/mgr/tours-ongoing" element={<ToursOngoing />} />
        <Route path="/mgr/tours-completed" element={<ToursCompleted />} />
          
        {/* Tours Section */}
        <Route path="mgr/tourlist" element={<TourListPage />} />
        <Route path="mgr/toursubmitted" element={<TourSubmitted />} />
        <Route path="/mgr/toursapproved" element={<ToursApproved />} />
        <Route path="/mgr/tourongoing" element={<ToursOngoing />} />
        <Route path="/mgr/tourcompleted" element={<ToursCompleted />} />
        
        {/* Bills Section */}
        {/* <Route path="dashboard" element={<DashboardHome />} /> */}
        <Route path="users" element={<UsersPage />} />
        <Route path="reports/transactions" element={<FilteredTablePage />} />
        <Route path="mgr/bill-submitted" element={<BillSubmitted />} />
        <Route path="mgr/bill-approved" element={<MgrBillApproved />} />
        <Route path="mgr/bill-returned" element={<MgrBillReturned />} />
        {/* Finance Section */}
        <Route path="finance/billpending" element={<FinPendingBills />} />
        <Route path="finance/billapproved" element={<FinBillApproved />} />
        <Route path="finance/billrejected" element={<FinBillRejected />} />
        {/* Reports Section */}
        <Route path="report/tours-rejected" element={<ToursRejected />} />
        <Route path="report/engineers-in-tour" element={<EngineersInTour />} />
        <Route path="report/engineers-available" element={<EngineersAvailable />} />
        <Route path="report/engineers-utilization" element={<EngineersUtilization />} />
        <Route path="report/branch-wise-revenue" element={<BranchWiseRevenue />} />
        <Route path="report/machine-ageing-report" element={<MachineAgeingReport />} />
        {/* Revenue Section */}
        <Route path="revenue/addbill" element={<RevenueAddBill />} />
        {/* <Route path="reports/sales" element={<ReportsSalesPage />} /> */}
        {/* add other pages matching your sidebarConfig paths */}
      </Route>
    </Routes>
  );
}
