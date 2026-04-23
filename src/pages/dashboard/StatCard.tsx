// import React from 'react';
// import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
// import type { StatMetric } from '../../types/dashboard';

// const StatCard: React.FC<StatMetric> = ({ title, value, trend, icon: Icon }) => {
//   const isPositive = trend > 0;

//   return (
//     <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm transition-hover hover:border-blue-200">
//       <div className="flex items-center justify-between mb-4">
//         <div className="p-2 bg-slate-50 rounded-lg text-slate-600">
//           <Icon size={20} />
//         </div>
//         <div className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${
//           isPositive ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
//         }`}>
//           {isPositive ? <ArrowUpRight size={14} className="mr-1" /> : <ArrowDownRight size={14} className="mr-1" />}
//           {Math.abs(trend)}%
//         </div>
//       </div>
//       <h3 className="text-slate-500 text-sm font-medium leading-none">{title}</h3>
//       <p className="text-2xl font-bold text-slate-900 mt-2">{value}</p>
//     </div>
//   );
// };

// export default StatCard;

import { 
  Box, 
  Flex, 
  Stat, 
  StatLabel, 
  StatNumber, 
  StatHelpText, 
  StatArrow, 
  Icon 
} from '@chakra-ui/react';
import type { MetricData } from '../../types/MetricData';

export const StatCard = ({ label, value, change, icon, color }: MetricData) => {
  return (
    <Box 
      p={5} 
      shadow="sm" 
      borderWidth="1px" 
      borderRadius="xl" 
      bg="white"
    >
      <Flex justifyContent="space-between" alignItems="center" mb={4}>
        <Box p={2} bg={`${color}.50`} borderRadius="lg" color={`${color}.500`}>
          <Icon as={icon} boxSize={5} />
        </Box>
        <StatHelpText m={0} fontWeight="bold" color={change >= 0 ? 'green.500' : 'red.500'}>
          <StatArrow type={change >= 0 ? 'increase' : 'decrease'} />
          {Math.abs(change)}%
        </StatHelpText>
      </Flex>
      
      <Stat>
        <StatLabel color="gray.500" fontWeight="medium">{label}</StatLabel>
        <StatNumber fontSize="2xl" fontWeight="bold">{value}</StatNumber>
      </Stat>
    </Box>
  );
};