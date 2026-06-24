// import { useState } from 'react';
// import {
//   Box, Flex, Text, Button, VStack, Avatar, IconButton,
//   Divider, HStack, useColorModeValue
// } from '@chakra-ui/react';
// import {
//   FiHome, FiUsers, FiBarChart2, FiSettings, FiLogOut,  // ✅ Fixed
//   FiMenu, FiX
// } from 'react-icons/fi';


// interface DashboardProps {
//   onLogout: () => void;
// }

// const menuItems = [
//   { icon: FiHome, label: 'Dashboard', href: '#' },
//   { icon: FiUsers, label: 'Users', href: '#' },
//   { icon: FiBarChart2, label: 'Analytics', href: '#' },
//   { icon: FiSettings, label: 'Settings', href: '#' },
// ];

// export default function Dashboard({ onLogout }: DashboardProps) {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   useEffect(() => {
//     const token = localStorage.getItem('authToken');
//     if (!token) {
//       window.location.href = '/'; // Redirect if no token
//     }
//   }, []);

//   return (
//     <Flex h="100vh" bg="gray.50">
//       {/* Mobile Sidebar Toggle */}
//       <IconButton
//         display={{ base: 'flex', md: 'none' }}
//         aria-label="Open Menu"
//         icon={isSidebarOpen ? <FiX /> : <FiMenu />}
//         onClick={() => setIsSidebarOpen(!isSidebarOpen)}
//         pos="fixed"
//         top={4}
//         left={4}
//         zIndex={10}
//       />

//       {/* Sidebar */}
//       <Box
//         w={{ base: isSidebarOpen ? 'full' : '0', md: '64' }}
//         bg="white"
//         boxShadow="lg"
//         transition="all 0.3s"
//         overflowY="auto"
//         pos="fixed"
//         h="full"
//         zIndex={5}
//         display={{ base: isSidebarOpen ? 'block' : 'none', md: 'block' }}
//       >
//         <VStack spacing={0} h="full" align="stretch">
//           {/* Profile Header */}
//           <Box p={6} bg="blue.500" color="white">
//             <HStack>
//               <Avatar size="md" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e" />
//               <Box>
//                 <Text fontWeight="bold">Admin User</Text>
//                 <Text fontSize="sm" opacity={0.9}>admin@company.com</Text>
//               </Box>
//             </HStack>
//           </Box>

//           {/* Menu Items */}
//           <VStack spacing={0} flex={1}>
//             {menuItems.map((item) => (
//               <Button
//                 key={item.label}
//                 leftIcon={<item.icon />}
//                 variant="ghost"
//                 justifyContent="start"
//                 h="12"
//                 _hover={{ bg: 'gray.100' }}
//               >
//                 {item.label}
//               </Button>
//             ))}
//           </VStack>

//           {/* Logout */}
//           <Box p={4}>
//             <Divider />
//             <Button
//               leftIcon={<FiLogOut />}
//               variant="ghost"
//               justifyContent="start"
//               mt={2}
//               colorScheme="red"
//               onClick={onLogout}
//             >
//               Logout
//             </Button>
//           </Box>
//         </VStack>
//       </Box>

//       {/* Overlay for mobile */}
//       <Box
//         display={{ base: isSidebarOpen ? 'block' : 'none', md: 'none' }}
//         pos="fixed"
//         top={0}
//         left={0}
//         right={0}
//         bottom={0}
//         bg="blackAlpha.300"
//         zIndex={4}
//         onClick={() => setIsSidebarOpen(false)}
//       />

//       {/* Main Content */}
//       <Box ml={{ base: 0, md: '64' }} p={{ base: 6, md: 10 }} flex={1}>
//         <Text fontSize="3xl" fontWeight="bold" mb={8} color="gray.800">
//           Dashboard Overview
//         </Text>
        
//         <VStack spacing={6} align="stretch">
//           {/* Stats Cards */}
//           <HStack spacing={4} flexWrap="wrap">
//             <Box bg="white" p={6} rounded="lg" shadow="md" flex={1} minW="250px">
//               <HStack justify="space-between">
//                 <Box>
//                   <Text fontSize="sm" color="gray.500">Total Users</Text>
//                   <Text fontSize="3xl" fontWeight="bold" color="gray.900">1,234</Text>
//                 </Box>
//                 <FiUsers size={40} color="blue.500" />
//               </HStack>
//             </Box>
            
//             <Box bg="white" p={6} rounded="lg" shadow="md" flex={1} minW="250px">
//               <HStack justify="space-between">
//                 <Box>
//                   <Text fontSize="sm" color="gray.500">Revenue</Text>
//                   <Text fontSize="3xl" fontWeight="bold" color="gray.900">$45,678</Text>
//                 </Box>
//                 <FiBarChart2 size={40} color="green.500" />
//               </HStack>
//             </Box>
//           </HStack>

//           {/* Welcome Section */}
//           <Box bg="white" p={8} rounded="lg" shadow="md">
//             <Text fontSize="xl" fontWeight="semibold" mb={4}>
//               Welcome back, Admin!
//             </Text>
//             <Text color="gray.600">
//               Here's what's happening with your store today. Manage users, view analytics, 
//               and configure settings from the sidebar.
//             </Text>
//           </Box>
//         </VStack>
//       </Box>
//     </Flex>
//   );
// }
// function useEffect(arg0: () => void, arg1: never[]) {
//   throw new Error('Function not implemented.');
// }
//-----------------------------------------------------
// src/components/Dashboard.tsx
import DashboardLayout from './DashboardLayout';
import { Box, Text } from '@chakra-ui/react';

interface DashboardProps {
  onLogout: () => void;
}

export default function Dashboard({ onLogout }: DashboardProps) {
  return (
    <DashboardLayout onLogout={onLogout}>
      <Box>
        <Text fontSize="2xl" fontWeight="bold" mb={4}>
          Welcome to the admin dashboard
        </Text>
        {/* Your cards, tables, charts here */}
      </Box>
    </DashboardLayout>
  );
}

