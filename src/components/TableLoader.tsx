import { Box, Center, Spinner, Text, VStack } from '@chakra-ui/react';

interface TableLoaderProps {
  isLoading: boolean;
  message?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function TableLoader({
  isLoading,
  message = 'Loading data...',
  size = 'lg'
}: TableLoaderProps) {
  if (!isLoading) return null;

  return (
    <Center
      position="absolute"
      top="50%"
      left="50%"
      transform="translate(-50%, -50%)"
      bg="white"
      p={{ base: 4, md: 6 }}
      borderRadius="lg"
      boxShadow="2xl"
      border="2px solid"
      borderColor="gray.200"
      zIndex="docked"
      minW={{ base: '160px', md: '200px' }}
      textAlign="center"
    >
      <VStack spacing={3}>
        <Spinner size={size} color="blue.500" thickness="3px" />
        <Text 
          fontSize={{ base: 'sm', md: 'md' }} 
          fontWeight="medium" 
          color="gray.700"
        >
          {message}
        </Text>
      </VStack>
    </Center>
  );
}
