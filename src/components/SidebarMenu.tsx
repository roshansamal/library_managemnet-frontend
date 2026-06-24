import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  HStack,
  Icon,
  Box,
  Link as ChakraLink,
  useColorModeValue,
} from "@chakra-ui/react";

import { Link, useLocation } from "react-router-dom";
import {
  FiUsers,
  FiBook,
  FiLayers,
  FiClipboard,
  FiRotateCcw,
  FiDollarSign,
  FiHome,
} from "react-icons/fi";

import api from "../services/api";

interface SidebarMenuProps {
  isCollapsed: boolean;
}

export function SidebarMenu({ isCollapsed }: SidebarMenuProps) {
  const location = useLocation();
  const activeBg = useColorModeValue("blue.50", "blue.900");
  const activeColor = useColorModeValue("blue.600", "blue.200");

  const [counts, setCounts] = useState({
    users: 0,
    books: 0,
    copies: 0,
    issues: 0,
    returns: 0,
    fines: 0,
  });

  useEffect(() => {
    loadCounts();
  }, []);

  const loadCounts = async () => {
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
        users: users.data.length,
        books: books.data.length,
        copies: copies.data.length,
        issues: issues.data.length,
        returns: returns.data.length,
        fines: fines.data.length,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const menu = [
    { label: "Dashboard", path: "/library/dashboard", icon: FiHome },
    { label: `Users (${counts.users})`, path: "/library/users", icon: FiUsers },
    { label: `Books (${counts.books})`, path: "/library/books", icon: FiBook },
    { label: `Book Copies (${counts.copies})`, path: "/library/book-copies", icon: FiLayers },
    { label: `Issues (${counts.issues})`, path: "/library/issues", icon: FiClipboard },
    { label: `Returns (${counts.returns})`, path: "/library/returns", icon: FiRotateCcw },
    { label: `Fines (${counts.fines})`, path: "/library/fines", icon: FiDollarSign },
  ];

  if (isCollapsed) {
    return (
      <Box mt={2}>
        {menu.map((item) => (
          <Box key={item.label} textAlign="center" py={3}>
            <ChakraLink as={Link} to={item.path}>
              <Icon as={item.icon} boxSize={5} />
            </ChakraLink>
          </Box>
        ))}
      </Box>
    );
  }

  return (
    <Accordion allowMultiple mt={2}>
      {menu.map((item) => {
        const isActive = location.pathname === item.path;

        return (
          <AccordionItem key={item.label} border="none">
            <AccordionButton
              as={Link}
              to={item.path}
              bg={isActive ? activeBg : "transparent"}
              _hover={{ textDecoration: "none" }}
            >
              <HStack flex="1" spacing={3}>
                <Icon as={item.icon} boxSize={5} />
                <Box
                  fontSize="sm"
                  fontWeight="medium"
                  color={isActive ? activeColor : "inherit"}
                >
                  {item.label}
                </Box>
              </HStack>
            </AccordionButton>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}