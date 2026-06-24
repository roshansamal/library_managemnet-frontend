import { Box, Stat, StatLabel, StatNumber, Icon, Flex } from "@chakra-ui/react";
import type { IconType } from "react-icons";

interface Props {
  label: string;
  value: number | string;
  icon: IconType;
  colorScheme: string;
}

export const StatCard = ({ label, value, icon, colorScheme }: Props) => {
  return (
    <Box p={5} bg="white" borderRadius="xl" shadow="md">
      <Stat>
        <Flex justify="space-between" align="center">
          <Box>
            <StatLabel color="gray.500">{label}</StatLabel>
            <StatNumber fontSize="2xl">{value}</StatNumber>
          </Box>

          <Box p={3} bg={`${colorScheme}.50`} color={`${colorScheme}.500`} borderRadius="md">
            <Icon as={icon} boxSize={6} />
          </Box>
        </Flex>
      </Stat>
    </Box>
  );
};