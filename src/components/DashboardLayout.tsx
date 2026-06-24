import { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Flex,
  IconButton,
  Text,
  HStack,
  VStack,
  Button,
  Divider,
  useColorModeValue,
} from "@chakra-ui/react";

import { FiBell, FiMenu, FiChevronLeft, FiLogOut } from "react-icons/fi";
import { Outlet } from "react-router-dom";
import { SidebarMenu } from "./SidebarMenu";

interface DashboardLayoutProps {
  onLogout?: () => void;
}

export default function DashboardLayout({ onLogout }: DashboardLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const borderColor = useColorModeValue("gray.200", "gray.700");

  const [user, setUser] = useState<{ name: string; email: string; avatar?: string } | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem("user");
    if (raw) {
      try {
        setUser(JSON.parse(raw));
      } catch {
        setUser(null);
      }
    }
  }, []);

  return (
    <Flex h="100vh" bg={useColorModeValue("gray.50", "gray.800")}>

      {/* ================= SIDEBAR ================= */}
      <Box
        as="nav"
        borderRightWidth="1px"
        borderColor={borderColor}
        w={isCollapsed ? "72px" : "260px"}
        transition="width 0.2s"
        overflow="hidden"
        display="flex"
        flexDirection="column"
        h="100vh"
      >
        {/* Sidebar Header */}
        <Flex align="center" justify="space-between" px={4} py={4}>
          {!isCollapsed && (
            <Text fontSize="lg" fontWeight="bold">
              📚 Library System
            </Text>
          )}

          <IconButton
            aria-label="Toggle Sidebar"
            icon={isCollapsed ? <FiMenu /> : <FiChevronLeft />}
            size="sm"
            variant="ghost"
            onClick={() => setIsCollapsed((c) => !c)}
          />
        </Flex>

        <Divider />

        {/* Sidebar Menu */}
        <Box flex="1" overflowY="auto">
          <SidebarMenu isCollapsed={isCollapsed} />
        </Box>

        {/* Logout */}
        <Box mt="auto" px={2} pb={4} pt={2}>
          <Divider mb={2} />

          <Button
            leftIcon={<FiLogOut />}
            justifyContent={isCollapsed ? "center" : "flex-start"}
            variant="ghost"
            size="md"
            w="full"
            onClick={onLogout}
            colorScheme="red"
          >
            {!isCollapsed && "Logout"}
          </Button>
        </Box>
      </Box>

      {/* ================= MAIN AREA ================= */}
      <Flex direction="column" flex="1" minW={0}>

        {/* TOP BAR */}
        <Flex
          as="header"
          bg="blue.800"
          color="white"
          borderBottomWidth="1px"
          borderColor={borderColor}
          px={4}
          h="60px"
          align="center"
          justify="space-between"
        >
          <HStack spacing={2}>
            <Text fontSize="lg" fontWeight="semibold">
              Library Dashboard
            </Text>
            <Text fontSize="sm">/ Overview</Text>
          </HStack>

          <HStack spacing={4}>
            <IconButton
              aria-label="Notifications"
              icon={<FiBell />}
              variant="ghost"
              color="white"
            />

            <HStack spacing={2}>
              <Avatar
                size="sm"
                name={user?.name ?? "Admin"}
                src={user?.avatar || undefined}
              />

              <VStack spacing={0} align="flex-start" display={{ base: "none", md: "flex" }}>
                <Text fontSize="sm" fontWeight="medium">
                  {user?.name ?? "Admin"}
                </Text>
                <Text fontSize="xs">{user?.email ?? ""}</Text>
              </VStack>
            </HStack>
          </HStack>
        </Flex>

        {/* PAGE CONTENT */}
        <Box as="main" flex="1" p={3} overflowY="auto">
          <Outlet />
        </Box>
      </Flex>
    </Flex>
  );
}