// // // src/pages/DashboardHome.tsx
// // import { Box, Text } from '@chakra-ui/react';
// // export default function DashboardHome() {
// //   return (
// //     <Box>
// //       <Text fontSize="2xl" fontWeight="bold">Dashboard</Text>
// //       <Text mt={2}>Main overview content here.</Text>
      


// //     </Box>
// //   );
// // }
// //--------------------------
// // import React from 'react';
// // import { Users, DollarSign, ShoppingCart } from 'lucide-react';
// // import StatCard from '../pages/dashboard/StatCard';
// // import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// // const mockData = [
// //   { name: 'Mon', value: 400 },
// //   { name: 'Tue', value: 300 },
// //   { name: 'Wed', value: 500 },
// // ];

// // const DashboardHome: React.FC = () => {
// //   return (
// //     <div className="p-8 max-w-7xl mx-auto space-y-8">
// //       {/* 4-Column Metric Grid */}
// //       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
// //         <StatCard id="1" title="Revenue" value="$12,450" trend={14.5} icon={DollarSign} />
// //         <StatCard id="2" title="New Users" value="842" trend={-2.4} icon={Users} />
// //         <StatCard id="3" title="Conversions" value="3.2%" trend={8.1} icon={ShoppingCart} />
// //         {/* Add more as needed */}
// //       </div>

// //       {/* Main Chart Section */}
// //       <div className="bg-white p-6 rounded-xl border border-slate-200 h-[400px]">
// //         <h3 className="font-bold text-slate-900 mb-6">User Growth Trend</h3>
// //         <ResponsiveContainer width="100%" height="100%">
// //           <AreaChart data={mockData}>
// //             <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
// //             <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
// //             <YAxis hide />
// //             <Tooltip />
// //             <Area type="monotone" dataKey="value" stroke="#3b82f6" fill="#eff6ff" strokeWidth={2} />
// //           </AreaChart>
// //         </ResponsiveContainer>
// //       </div>
// //     </div>
// //   );
// // };
// // export default DashboardHome;

// import { Container, SimpleGrid, Heading, Text, VStack, Box } from '@chakra-ui/react';
// import { FiDollarSign, FiUsers, FiShoppingCart } from 'react-icons/fi';
// import { StatCard } from './dashboard/StatCard';

// export const DashboardHome = () => {
//   return (
//     <Box bg="gray.50" minH="100vh">
//       {/* Header Bar */}
//       <Box bg="#2d4263" py={4} color="white">
//         <Container maxW="container.xl">
//           <Heading size="md">Dashboard <Text as="span" color="gray.400" fontWeight="normal">/ Overview</Text></Heading>
//         </Container>
//       </Box>

//       <Container maxW="container.xl" py={8}>
//         {/* SimpleGrid ensures items are horizontal on desktop and stack on mobile */}
//         <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} mb={8}>
//           <StatCard 
//             label="Revenue" 
//             value="$12,450" 
//             change={14.5} 
//             icon={FiDollarSign} 
//             color="blue" 
//           />
//           <StatCard 
//             label="New Users" 
//             value="842" 
//             change={-2.4} 
//             icon={FiUsers} 
//             color="purple" 
//           />
//           <StatCard 
//             label="Conversions" 
//             value="3.2%" 
//             change={8.1} 
//             icon={FiShoppingCart} 
//             color="orange" 
//           />
//         </SimpleGrid>

//         {/* Chart Section */}
//         <Box p={6} bg="white" rounded="xl" border="1px" borderColor="gray.200">
//           <Heading size="sm" mb={4}>User Growth Trend</Heading>
//           <Box h="300px" bg="gray.50" rounded="md" display="flex" alignItems="center" justifyContent="center">
//              <Text color="gray.400">Insert Recharts Component Here</Text>
//           </Box>
//         </Box>
//       </Container>
//     </Box>
//   );
// };

import React from 'react';
// import { 
//   Box, 
//   SimpleGrid, 
//   Text, 
//   Stat, 
//   StatLabel, 
//   StatNumber, 
//   StatHelpText, 
//   StatArrow, 
//   Flex,
//   Icon,
//   Container,
//   Heading
// } from '@chakra-ui/react';
// Make sure to run: npm install react-icons
import { FiShoppingCart, FiTruck, FiUsers } from 'react-icons/fi';

// import React from 'react';
import type { IconType } from 'react-icons';
import { 
  Box, 
  Flex, 
  Stat, 
  StatLabel, 
  StatNumber, 
  Icon, 
  Container,
  Heading,
  SimpleGrid
} from '@chakra-ui/react';

interface StatCardProps {
  label: string;
  value: string | number;
  change: number;
  icon: IconType;
  colorScheme: string;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, icon, colorScheme }) => {
  return (
    <Box p={5} shadow="md" borderWidth="1px" borderRadius="xl" bg="white">
      {/* 1. Stat is the PARENT container for all stat sub-components */}
      <Stat>
        <Flex justifyContent="space-between" alignItems="center">
          <Box>
            {/* These MUST be inside <Stat> */}
            <StatLabel color="gray.500">{label}</StatLabel>
            <StatNumber fontSize="2xl" fontWeight="bold">{value}</StatNumber>
          </Box>
          
          <Box p={3} bg={`${colorScheme}.50`} borderRadius="lg" color={`${colorScheme}.500`}>
            <Icon as={icon} boxSize={6} />
          </Box>
        </Flex>

        {/* This was likely the cause of your crash. It MUST be inside <Stat> */}
        {/* <StatHelpText mt={2}>
          <StatArrow type={change >= 0 ? 'increase' : 'decrease'} />
          {Math.abs(change)}%
        </StatHelpText> */}
      </Stat>
    </Box>
  );
};

// 3. The Main Dashboard
export const DashboardHome = () => {
  return (
    <Box bg="gray.50" minH="100vh">
      <Box bg="white" py={2} color="black" mb={1}>
        <Container maxW="container.xl">
          <Heading size="sm">Machines Details</Heading>
        </Container>
      </Box>

      <Container maxW="container.xl">
        <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6}>
          <StatCard 
            label="Machine Count" 
            value="2500" 
            change={14.5} 
            icon={FiTruck} 
            colorScheme="blue" 
          />
          <StatCard 
            label="Volvo" 
            value="842" 
            change={-2.4} 
            icon={FiUsers} 
            colorScheme="purple" 
          />
          <StatCard 
            label="SDLG" 
            value="3.2%" 
            change={8.1} 
            icon={FiShoppingCart} 
            colorScheme="orange" 
          />
          <StatCard 
            label="SDLG" 
            value="3.2%" 
            change={8.1} 
            icon={FiShoppingCart} 
            colorScheme="orange" 
          />
        </SimpleGrid>
      </Container>


      <Box bg="white" py={2} color="black" mb={1}>
        <Container maxW="container.xl">
          <Heading size="sm">Tour Count</Heading>
        </Container>
      </Box>
      <Container maxW="container.xl">
        <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6}>
          <StatCard 
            label="Machine Count" 
            value="2500" 
            change={14.5} 
            icon={FiTruck} 
            colorScheme="blue" 
          />
          <StatCard 
            label="Volvo" 
            value="842" 
            change={-2.4} 
            icon={FiUsers} 
            colorScheme="purple" 
          />
          <StatCard 
            label="SDLG" 
            value="3.2%" 
            change={8.1} 
            icon={FiShoppingCart} 
            colorScheme="orange" 
          />
          <StatCard 
            label="SDLG" 
            value="3.2%" 
            change={8.1} 
            icon={FiShoppingCart} 
            colorScheme="orange" 
          />
        </SimpleGrid>
      </Container>
    </Box>


    
  );
};