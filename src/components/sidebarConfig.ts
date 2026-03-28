// src/components/sidebarMenu.ts
// import { AiFillMoneyCollect } from 'react-icons/ai';
import { BiBus, BiMoney,  BiSpreadsheet } from 'react-icons/bi';
import { BsFilePerson } from 'react-icons/bs';
import { FaIndianRupeeSign, FaStamp } from 'react-icons/fa6';
import {
  FiHome,
  FiUsers,
  FiBarChart2,
  FiSettings,
  // FiFileText,
  FiUserCheck,
} from 'react-icons/fi';
import { IoLogoModelS } from 'react-icons/io';
import { MdPassword } from 'react-icons/md';
import { TbReport } from 'react-icons/tb';

export const nestedMenu = [
  {
    label: 'Dashboard',
    icon: FiHome,
    path: '/dashboard',
  },
  {
    label: 'Admin',
    icon: BsFilePerson,
    children: [
      { label: 'Employees', path: '/admin/employees' },
      { label: 'Customers', path: '/admin/customers' },
      { label: 'Change Tour Status', path: '/admin/change-tour-status' },
      { label: 'Change Odometer', path: '/admin/change-odometer' },
      { label: 'Change Timing', path: '/admin/change-timing' },
      { label: 'Email Update', path: '/admin/emailupdate' },
    ],
  },
  {
    label: 'PFR',
    icon: TbReport,
    children: [
      { label: 'PFR Uploads', path: '/pfr/list' },
      // { label: 'Admins', path: '/users/admins' },
      // { label: 'Map Roles', path: '/users/maproles' },
    ],
  },
  //   {
  //   label: 'Tour Bill',
  //   icon: TbReport,
  //   children: [
  //     { label: 'Uploaded PFRs', path: '/pfr/pfrlist' },
  //     // { label: 'Admins', path: '/users/admins' },
  //     // { label: 'Map Roles', path: '/users/maproles' },
  //   ],
  // },
  {
    label: 'Tour Manager',
    icon: FaStamp,
    children: [
      { label: 'Tour List', path: '/mgr/tourlist' },
      { label: 'Tour Submitted (Approval)', path: '/mgr/tours-submitted' },
      { label: 'Tours Approved', path: '/mgr/tours-approved' },
      { label: 'Tours Ongoing', path: '/mgr/tours-ongoing' },
      { label: 'Tours Completed', path: '/mgr/tours-completed' },
      { label: 'Bills Submitted for Approval', path: '/mgr/bill-submitted' },
      { label: 'Bills Approved by Mgr', path: '/mgr/bill-approved' },
      { label: 'Bills Returned/Rejected', path: '/mgr/bill-returned' },
    ],
  },
  {
    label: 'Finance',
    icon: BiMoney,
    children: [
      { label: 'Pending Bills(Finance)', path: '/finance/billpending' },
      { label: 'Bills Approved(Finance)', path: '/finance/billapproved' },
      { label: 'Bills Rejected(Finance)', path: '/finance/billrejected' },
    ],
  },
   {
    label: 'Attendance',
    icon: BiSpreadsheet,
    children: [
      { label: 'Daily Attendance', path: '/users' },
      { label: 'Individual Attendance', path: '/users/admins' },
      { label: 'Monthly Attendance', path: '/users/customers' },
      { label: 'Add Leave', path: '/users/customers' },
    ],
  },
  {
    label: 'Reports',
    // icon: BiSolidReport,
    icon:FiBarChart2,
    children: [
      { label: 'Rejected Tours', path: '/report/tours-rejected' },
      { label: 'Engineers in Tour', path: '/report/engineers-in-tour' },
      { label: 'Engineers Available', path: 'report/engineers-available' },
      { label: 'Machines Skipped Mandatory Maintenance', path: '/users/customers' },
      { label: 'Engineers Utilization', path: '/report/engineers-utilization' },
      { label: 'Branch Wise Revenue', path: '/report/branch-wise-revenue' },
      { label: 'Machine Aging Report', path: '/report/machine-ageing-report' },
    ],
  },
  {
    label: 'Revenue',
    icon: FaIndianRupeeSign,
    children: [
      { label: 'Add Bill Details', path: '/revenue/addbill' },
      { label: 'View Bill Details', path: '/revenue/viewbill' },
      { label: 'Revenue By Engineers', path: '/revenue/byengineers' },
    ],
  },
  {
    label: 'Machine',
    icon: BiBus,
    children: [
      { label: 'Add Customer Master', path: '/users' },
      { label: 'Add Machine Master', path: '/users/admins' },
      { label: 'View Coverage', path: '/users/customers' },
      { label: 'Machine List (Edit)', path: 'machine/machine-list' },
      { label: 'HMR Update', path: '/machine/hmrupdate' },
      { label: 'Mandatory Maintenance', path: '/users/customers' },
      { label: 'Add Servicing Details', path: '/users/customers' },
      { label: 'Servicing List', path: '/machine/servicing-list' },
      { label: 'HMR History', path: '/machine/hmrhistory' },
    ],
  },
  {
    label: 'Model',
    icon: IoLogoModelS,
    children: [
      { label: 'Add Customer Master', path: '/users' },
      { label: 'Add Machine Master', path: '/users/admins' },
      { label: 'View Coverage', path: '/users/customers' },
      { label: 'View Machine List(Edit)', path: '/users/customers' },
      { label: 'Update HMR', path: '/users/customers' },
      { label: 'Mandatory Maintenance', path: '/users/customers' },
      { label: 'Add Servicing Details', path: '/users/customers' },
      { label: 'Servicing List', path: '/users/customers' },
      { label: 'HMR History', path: '/users/customers' },
    ],
  },
  {
    label: 'Customer',
    icon: FiUsers,
    children: [
      { label: 'Add Customer Master', path: '/users' },
      { label: 'Add Machine Master', path: '/users/admins' },
      { label: 'View Coverage', path: '/users/customers' },
      { label: 'View Machine List(Edit)', path: '/users/customers' },
      { label: 'Update HMR', path: '/users/customers' },
      { label: 'Mandatory Maintenance', path: '/users/customers' },
      { label: 'Add Servicing Details', path: '/users/customers' },
      { label: 'Servicing List', path: '/users/customers' },
      { label: 'HMR History', path: '/users/customers' },
    ],
  },
  {
    label: 'App Users',
    icon: MdPassword,
    children: [
      { label: 'App Users', path: '/users/listusers' },
      { label: 'Admins', path: '/users/admins' },
      { label: 'Map Roles', path: '/users/maproles' },
    ],
  },
  
  {
    label: 'Settings',
    icon: FiSettings,
    children: [
      { label: 'Profile', path: '', icon: FiUserCheck },
      { label: 'System', path: '' },
    ],
  },
];
