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
  app_id:string;
}

interface LoginScreenProps {
  onLogin?: () => void;
}

// function joinUrl(base: string, path: string) {
//   return `${base.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;
// }

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [formData, setFormData] = useState<LoginFormData>({ app_id:'nist-feedback',email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      console.log(JSON.stringify(formData));
      const apiUrl = import.meta.env.VITE_API_URL ?? 'https://localhost:5000';
      const response = await fetch(`${apiUrl}/api/auth/login`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(formData),
        }
      );
      const res = await response.json();
      //console.log(res.token);//working
      //console.log(res.data.avatar); //Working
      if (response.ok && res.token) {
        localStorage.setItem('authToken', res.token);
        // localStorage.setItem('name', JSON.stringify(res.data.name));
        // localStorage.setItem('email', JSON.stringify(res.data.email));
        // localStorage.setItem('avatar', JSON.stringify(res.data.avatar));
        localStorage.setItem('user', JSON.stringify(res.data));
        toast({
          title: 'Login successful!',
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
        onLogin?.(); // Navigate to Dashboard
        // navigate('/dashboard');
      } else {
        toast({
          title: res.message || 'Invalid credentials',
          status: 'error',
          duration: 4000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'Login failed',
        description: 'Server error. Try again.'+error,
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
          <Heading size="lg" textAlign="center" color="gray.500">
            Admin Login
          </Heading>
          <form onSubmit={handleSubmit}>
            <Stack spacing={4}>
              <FormControl id="app_id" isRequired hidden>
                <FormLabel>App ID</FormLabel>
                <Input
                  type="text"
                  value={formData.app_id}
                  onChange={(e) => setFormData({ ...formData, app_id: e.target.value })}
                  placeholder="admin@example.com"
                  focusBorderColor="blue.400"
                  autoComplete="appid"
                />
              </FormControl>
              <FormControl id="email" isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="admin@example.com"
                  focusBorderColor="red.400"
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
