// src/components/sidebarMenu.ts
// import { AiFillMoneyCollect } from 'react-icons/ai';
// import { BiSpreadsheet } from 'react-icons/bi';
import { BsFilePerson } from 'react-icons/bs';
import { FaUser } from 'react-icons/fa6';
import {
  FiHome,
  // FiBarChart2,
  // FiSettings,
  // FiUserCheck,
} from 'react-icons/fi';
// import { MdPassword } from 'react-icons/md';

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
      { label: 'Students', path: '/admin/students' },
      { label: 'New Student', path: '/admin/newstudent' },
    ],
  },
  //  {
  //   label: 'Attendance',
  //   icon: BiSpreadsheet,
  //   children: [
  //     { label: 'Daily Attendance', path: '/users' },
  //     { label: 'Individual Attendance', path: '/users/admins' },
  //     { label: 'Monthly Attendance', path: '/users/customers' },
  //   ],
  // },
  // {
  //   label: 'Reports',
  //   icon:FiBarChart2,
  //   children: [
  //     { label: 'Students Absent', path: '/report/tours-rejected' },
  //     { label: 'Students Present', path: '/report/engineers-in-tour' },
  //   ],
  // },
  
  {
    label: 'User Management',
    icon: FaUser,
    children: [
      { label: 'App Users', path: '/users/listusers' },
      { label: 'Admins', path: '/users/admins' },
      { label: 'Map Roles', path: '/users/maproles' },
    ],
  },
  // {
  //   label: 'Settings',
  //   icon: FiSettings,
  //   children: [
  //     { label: 'Profile', path: '', icon: FiUserCheck },
  //     { label: 'System', path: '' },
  //   ],
  // },
];
