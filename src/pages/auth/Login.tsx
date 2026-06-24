import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../../services/auth.service";

import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Text,
  VStack,
  useToast,
  InputGroup,
  InputLeftElement,
  Icon,
} from "@chakra-ui/react";

import { EmailIcon, LockIcon } from "@chakra-ui/icons";

export default function Login() {
  const navigate = useNavigate();
  const toast = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = await loginUser(email, password);

      localStorage.setItem("token", data.token);

      toast({
        title: "Login Successful",
        description: "Welcome back!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "Invalid email or password",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex
      minH="100vh"
      align="center"
      justify="center"
      bgGradient="linear(to-r, blue.600, purple.700)"
      p={4}
    >
      <Box
        bg="rgba(255,255,255,0.15)"
        backdropFilter="blur(15px)"
        border="1px solid rgba(255,255,255,0.2)"
        p={10}
        rounded="2xl"
        shadow="2xl"
        w="100%"
        maxW="450px"
      >
        <VStack spacing={6} as="form" onSubmit={handleLogin}>
          <Box textAlign="center">
            <Text fontSize="5xl">📚</Text>

            <Heading
              size="lg"
              color="white"
              mt={2}
            >
              Library Management
            </Heading>

            <Text
              color="gray.200"
              mt={2}
              fontSize="sm"
            >
              Login to access your dashboard
            </Text>
          </Box>

          <FormControl>
            <FormLabel color="white">
              Email Address
            </FormLabel>

            <InputGroup>
              <InputLeftElement>
                <EmailIcon color="gray.400" />
              </InputLeftElement>

              <Input
                type="email"
                placeholder="Enter your email"
                bg="white"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
              />
            </InputGroup>
          </FormControl>

          <FormControl>
            <FormLabel color="white">
              Password
            </FormLabel>

            <InputGroup>
              <InputLeftElement>
                <LockIcon color="gray.400" />
              </InputLeftElement>

              <Input
                type="password"
                placeholder="Enter your password"
                bg="white"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
              />
            </InputGroup>
          </FormControl>

          <Button
            type="submit"
            w="full"
            size="lg"
            bg="white"
            color="blue.600"
            _hover={{
              bg: "gray.100",
              transform: "translateY(-2px)",
            }}
          >
            Login
          </Button>

          <Text color="gray.200" fontSize="sm">
            Don't have an account?{" "}
            <Link
              to="/register"
              style={{
                color: "#fff",
                fontWeight: "bold",
                textDecoration: "underline",
              }}
            >
              Register
            </Link>
          </Text>
        </VStack>
      </Box>
    </Flex>
  );
}