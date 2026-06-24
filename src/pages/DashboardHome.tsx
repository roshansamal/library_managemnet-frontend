import { useEffect, useState } from "react";
import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Text,
  Flex,
  Icon,
} from "@chakra-ui/react";

import api from "../services/api";

import {
  FiUsers,
  FiBook,
  FiLayers,
  FiClipboard,
  FiRotateCcw,
  FiDollarSign,
} from "react-icons/fi";

import { StatCard } from "../pages/dashboard/StatCard";

export const DashboardHome = () => {
  const [counts, setCounts] = useState({
    users: 0,
    books: 0,
    copies: 0,
    issues: 0,
    returns: 0,
    fines: 0,
  });

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const [users, books, copies, issues, returns, fines] =
        await Promise.all([
          api.get("/library-users"),
          api.get("/library-books"),
          api.get("/library-book-copies"),
          api.get("/library-issues"),
          api.get("/library-returns"),
          api.get("/library-fines"),
        ]);

      setCounts({
        users: users.data?.length || 0,
        books: books.data?.length || 0,
        copies: copies.data?.length || 0,
        issues: issues.data?.length || 0,
        returns: returns.data?.length || 0,
        fines: fines.data?.length || 0,
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box bg="gray.100" minH="100vh" p={6}>
      {/* HEADER */}
      <Box
        bgGradient="linear(to-r, blue.700, blue.500)"
        color="white"
        p={8}
        borderRadius="xl"
        mb={8}
        shadow="lg"
      >
        <Heading size="lg">📚 Library Management System</Heading>

        <Text mt={2} fontSize="md">
          Manage Books, Users, Issues, Returns and Fines
        </Text>
      </Box>

      {/* WELCOME CARD */}
      <Box
        bg="white"
        p={6}
        borderRadius="xl"
        shadow="md"
        mb={8}
      >
        <Heading size="md" mb={2}>
          Dashboard Overview
        </Heading>

        <Text color="gray.600">
          Real-time statistics of your library management system.
        </Text>
      </Box>

      {/* STATS */}
      <Container maxW="container.xl" p={0}>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          <Box
            bg="white"
            p={6}
            borderRadius="xl"
            shadow="md"
            transition="0.3s"
            _hover={{
              transform: "translateY(-5px)",
              shadow: "xl",
            }}
          >
            <Flex justify="space-between" align="center">
              <Box>
                <Text color="gray.500">Users</Text>
                <Heading size="lg">{counts.users}</Heading>
              </Box>
              <Icon as={FiUsers} boxSize={10} color="blue.500" />
            </Flex>
          </Box>

          <Box
            bg="white"
            p={6}
            borderRadius="xl"
            shadow="md"
            transition="0.3s"
            _hover={{
              transform: "translateY(-5px)",
              shadow: "xl",
            }}
          >
            <Flex justify="space-between" align="center">
              <Box>
                <Text color="gray.500">Books</Text>
                <Heading size="lg">{counts.books}</Heading>
              </Box>
              <Icon as={FiBook} boxSize={10} color="green.500" />
            </Flex>
          </Box>

          <Box
            bg="white"
            p={6}
            borderRadius="xl"
            shadow="md"
            transition="0.3s"
            _hover={{
              transform: "translateY(-5px)",
              shadow: "xl",
            }}
          >
            <Flex justify="space-between" align="center">
              <Box>
                <Text color="gray.500">Book Copies</Text>
                <Heading size="lg">{counts.copies}</Heading>
              </Box>
              <Icon as={FiLayers} boxSize={10} color="purple.500" />
            </Flex>
          </Box>

          <Box
            bg="white"
            p={6}
            borderRadius="xl"
            shadow="md"
            transition="0.3s"
            _hover={{
              transform: "translateY(-5px)",
              shadow: "xl",
            }}
          >
            <Flex justify="space-between" align="center">
              <Box>
                <Text color="gray.500">Issues</Text>
                <Heading size="lg">{counts.issues}</Heading>
              </Box>
              <Icon as={FiClipboard} boxSize={10} color="orange.500" />
            </Flex>
          </Box>

          <Box
            bg="white"
            p={6}
            borderRadius="xl"
            shadow="md"
            transition="0.3s"
            _hover={{
              transform: "translateY(-5px)",
              shadow: "xl",
            }}
          >
            <Flex justify="space-between" align="center">
              <Box>
                <Text color="gray.500">Returns</Text>
                <Heading size="lg">{counts.returns}</Heading>
              </Box>
              <Icon as={FiRotateCcw} boxSize={10} color="teal.500" />
            </Flex>
          </Box>

          <Box
            bg="white"
            p={6}
            borderRadius="xl"
            shadow="md"
            transition="0.3s"
            _hover={{
              transform: "translateY(-5px)",
              shadow: "xl",
            }}
          >
            <Flex justify="space-between" align="center">
              <Box>
                <Text color="gray.500">Fines</Text>
                <Heading size="lg">{counts.fines}</Heading>
              </Box>
              <Icon as={FiDollarSign} boxSize={10} color="red.500" />
            </Flex>
          </Box>
        </SimpleGrid>
      </Container>
    </Box>
  );
};