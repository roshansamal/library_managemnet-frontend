import { useEffect, useState } from "react";
import { Box, Container, Heading, SimpleGrid, Text } from "@chakra-ui/react";
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
      const [users, books, copies, issues, returns, fines] = await Promise.all([
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
      console.error("Dashboard load error:", err);
    }
  };

  return (
    <Box bg="gray.50" minH="100vh" p={4}>
      <Box bg="white" p={4} mb={4} borderRadius="md">
        <Heading size="md">📚 Library Dashboard</Heading>
        <Text fontSize="sm" color="gray.500">
          Overview of all library modules
        </Text>
      </Box>

      <Container maxW="container.xl">
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
          <StatCard label="Users" value={counts.users} icon={FiUsers} colorScheme="blue" />
          <StatCard label="Books" value={counts.books} icon={FiBook} colorScheme="green" />
          <StatCard label="Book Copies" value={counts.copies} icon={FiLayers} colorScheme="purple" />

          <StatCard label="Issues" value={counts.issues} icon={FiClipboard} colorScheme="orange" />
          <StatCard label="Returns" value={counts.returns} icon={FiRotateCcw} colorScheme="teal" />
          <StatCard label="Fines" value={counts.fines} icon={FiDollarSign} colorScheme="red" />
        </SimpleGrid>
      </Container>
    </Box>
  );
};