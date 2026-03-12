// src/components/DashboardLayout.tsx
import { useState, type ReactNode } from 'react';
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
} from '@chakra-ui/react';
import {
  FiBell,
  FiMenu,
  FiChevronLeft,
  FiLogOut,
} from 'react-icons/fi';
import { Outlet } from 'react-router-dom';
import { SidebarMenu } from './SidebarMenu'

interface DashboardLayoutProps {
  children: ReactNode;
  onLogout?: () => void;
}

// For Breadcrumb Setup
const pageConfig = {
  home: { title: 'Dashboard', breadcrumb: ['Home'] },
  tours: { title: 'Tours', breadcrumb: ['Home', 'Tours'] },
  'bill-submitted': { title: 'Bill Submitted', breadcrumb: ['Home', 'Tours', 'Bill Submitted'] },
  approval: { title: 'Approvals', breadcrumb: ['Home', 'Tours', 'Approvals'] },
  // ...
} as const;

type PageKey = keyof typeof pageConfig;

export default function DashboardLayout({ children, onLogout }: DashboardLayoutProps) {
  const [currentPage, setCurrentPage] = useState<PageKey>('home');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const sidebarBg = useColorModeValue('white', 'gray.900');
  const topbarBg = useColorModeValue('white', 'gray.900');
  //const topbarBg = useColorModeValue('grey.500', 'gray.900');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Flex h="100vh" bg={useColorModeValue('gray.50', 'gray.800')}>
      {/* Sidebar */}
      <Box
        as="nav"
        //bg={sidebarBg}
        //bg={"blue.800"}
        //color={"white"}
        borderRightWidth="1px"
        borderColor={borderColor}
        w={isCollapsed ? '72px' : '260px'}
        transition="width 0.2s"
        overflow="hidden"
        display="flex"
        flexDirection="column"
        h="100vh"               // full viewport height
      >
        {/* Sidebar header */}
        <Flex align="center" justify="space-between" px={4} py={4}>
          {!isCollapsed && (
            <Text fontSize="lg" fontWeight="bold">
              Tour Admin
            </Text>
          )}
          <IconButton
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            icon={isCollapsed ? <FiMenu /> : <FiChevronLeft />}
            size="sm"
            variant="ghost"
            onClick={() => setIsCollapsed((c) => !c)}
          />
        </Flex>
        <Divider />

        {/* Nested menu */}
        {/* <SidebarMenu isCollapsed={isCollapsed} />  */}
        {/* Make menu area scrollable */}
        <Box flex="1" overflowY="auto">
          <SidebarMenu isCollapsed={isCollapsed} />
        </Box>

        {/* Bottom logout */}
        <Box mt="auto" px={2} pb={4} pt={2}>
          <Divider mb={2} />
          <Button
            leftIcon={<FiLogOut />}
            justifyContent={isCollapsed ? 'center' : 'flex-start'}
            variant="ghost"
            size="md"
            w="full"
            onClick={onLogout}
            colorScheme="red"
          >
            {!isCollapsed && 'Logout'}
          </Button>
        </Box>
      </Box>

      {/* Main area */}
      <Flex direction="column" flex="1" minW={0} >
        {/* Top bar */}
        <Flex
          as="header"
          //bg={topbarBg}
          bg={"blue.800"}
          color={"white"}
          borderBottomWidth="1px"
          borderColor={borderColor}
          px={4}
          h="60px"
          align="center"
          justify="space-between"
        >
          {/* Breadcrumbs / title */}
          <HStack spacing={2} textAlign={"left"}>
            <Text fontSize="lg" fontWeight="semibold">
              Dashboard
            </Text>
            <Text fontSize="sm">
              / Overview
            </Text>
          </HStack>

          {/* Notifications + user avatar */}
          <HStack spacing={4}>
            <IconButton
              aria-label="Notifications"
              icon={<FiBell />}
              variant="ghost"
            />
            <HStack spacing={2}>
              <Avatar
                size="sm"
                name="Admin User"
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
              />
              <VStack
                spacing={0}
                align="flex-start"
                display={{ base: 'none', md: 'flex' }}
              >
                <Text fontSize="sm" fontWeight="medium">
                  Admin User
                </Text>
                <Text fontSize="xs">
                  admin@pollutech.in
                </Text>
              </VStack>
            </HStack>
          </HStack>
        </Flex>

        {/* Page content */}
        {/* <Box as="main" flex="1" p={1} overflowY="auto"> */}
        <Box as="main" flex="1" p={1} overflow="none">
          {/* {children} */}
          <Outlet />
        </Box>
      </Flex>
    </Flex>
  );
}
