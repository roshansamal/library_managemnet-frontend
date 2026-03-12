import { useState } from 'react';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  useToast,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginScreenProps {
  onLogin?: () => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [formData, setFormData] = useState<LoginFormData>({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setIsLoading(true);

  //   try {
  //     const response = await fetch('/api/login', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify(formData),
  //       credentials: 'include',
  //     });

  //     if (response.ok) {
  //       toast({
  //         title: 'Login successful!',
  //         status: 'success',
  //         duration: 3000,
  //         isClosable: true,
  //       });
        
  //       onLogin?.();
  //       // window.location.href = '/dashboard'; // Use if no onLogin prop
  //     } else {
  //       toast({
  //         title: 'Invalid credentials',
  //         status: 'error',
  //         duration: 3000,
  //         isClosable: true,
  //       });
  //     }
  //   } catch (error) {
  //     toast({
  //       title: 'Login failed',
  //       description: 'Check your connection',
  //       status: 'error',
  //       duration: 3000,
  //       isClosable: true,
  //     });
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
  // src/components/LoginScreen.tsx - Replace handleSubmit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Real API call (Laravel / Supabase / etc.)
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        // Store auth token
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        toast({
          title: 'Login successful!',
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
        
        onLogin?.(); // Navigate to Dashboard
        
      } else {
        toast({
          title: data.message || 'Invalid credentials',
          status: 'error',
          duration: 4000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'Login failed',
        description: 'Server error. Try again.',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <Flex minH="100vh" align="center" justify="center" bg="gray.50" p={4}>
      <Box bg="white" p={8} rounded="lg" shadow="lg" maxW="md" w="full">
        <Stack spacing={6}>
          <Heading size="lg" textAlign="center" color="gray.800">
            Admin Login
          </Heading>
          
          <form onSubmit={handleSubmit}>
            <Stack spacing={4}>
              <FormControl id="email" isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="admin@example.com"
                  focusBorderColor="blue.400"
                  autoComplete="email"
                />
              </FormControl>

              <FormControl id="password" isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <Input
                    pr="4.5rem"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Enter password"
                    autoComplete="current-password"
                  />
                  <InputRightElement width="4.5rem">
                    <Button
                      h="1.75rem"
                      size="sm"
                      variant="ghost"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <ViewOffIcon /> : <ViewIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>

              <Button
                type="submit"
                colorScheme="blue"
                size="lg"
                isLoading={isLoading}
                loadingText="Signing in..."
                w="full"
              >
                Sign In
              </Button>
            </Stack>
          </form>
        </Stack>
      </Box>
    </Flex>
  );
}
