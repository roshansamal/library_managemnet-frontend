// src/components/SidebarMenu.tsx
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  HStack,
  Icon,
  Button,
  Box,
  Link as ChakraLink,
  useColorModeValue,
} from '@chakra-ui/react';
import { Link, useLocation } from 'react-router-dom';
import { nestedMenu } from './sidebarConfig';

interface SidebarMenuProps {
  isCollapsed: boolean;
}

export function SidebarMenu({ isCollapsed }: SidebarMenuProps) {
  const location = useLocation();
  const activeBg = useColorModeValue('blue.50', 'blue.900');
  const activeColor = useColorModeValue('blue.600', 'blue.200');

  if (isCollapsed) {
    // Simple icon-only vertical menu when collapsed
    return (
      <Box mt={2}>
        {nestedMenu.map((item) => (
          <Button
            key={item.label}
            variant="ghost"
            w="full"
            justifyContent="center"
            py={3}
          >
            <Icon as={item.icon} boxSize={5} />
          </Button>
        ))}
      </Box>
    );
  }

  return (
    // <Accordion allowMultiple defaultIndex={[0]} mt={2}  color={"black"}>
    <Accordion allowMultiple mt={2}  color={"black"}>
      {nestedMenu.map((item) => {
        // Leaf item (no children)
        if (!item.children) {
          const isActive = location.pathname === item.path;
          return (
            <Box key={item.label} px={0} py={1}>
              <ChakraLink
                as={Link}
                to={item.path || '#'}
                _hover={{ textDecoration: 'none' }}
              >
                <HStack
                  px={3}
                  py={2}
                  borderRadius="md"
                  spacing={3}
                  bg={isActive ? activeBg : 'transparent'}
                  color={isActive ? activeColor : 'inherit'}
                  _hover={{ bg: activeBg, color: activeColor }}
                >
                  <Icon as={item.icon} boxSize={5} />
                  <Box as="span" fontSize="sm" fontWeight="medium">
                    {item.label}
                  </Box>
                </HStack>
              </ChakraLink>
            </Box>
          );
        }

        // Parent with children
        const isAnyChildActive = item.children.some(
          (child) => child.path && location.pathname.startsWith(child.path),
        );

        return (
          <AccordionItem key={item.label} border="none">
            <AccordionButton
              px={3}
              py={2}
              _hover={{ bg: useColorModeValue('gray.100', 'gray.700') }}
              bg={isAnyChildActive ? activeBg : 'transparent'}
            >
              <HStack flex="1" spacing={3} textAlign="left">
                <Icon as={item.icon} boxSize={5} />
                <Box as="span" fontSize="sm" fontWeight="medium">
                  {item.label}
                </Box>
              </HStack>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel px={0} pt={1} pb={2}>
              {item.children.map((child) => {
                const isActive = location.pathname === child.path;
                return (
                  <Box key={child.label} pl={8} pr={2} py={0.5}>
                    <ChakraLink
                      as={Link}
                      to={child.path || '#'}
                      _hover={{ textDecoration: 'none' }}
                    >
                      <HStack
                        px={3}
                        py={1.5}
                        borderRadius="md"
                        spacing={2}
                        bg={isActive ? activeBg : 'transparent'}
                        color={isActive ? activeColor : 'inherit'}
                        _hover={{ bg: activeBg, color: activeColor }}
                      >
                        {child.icon && (
                          <Icon as={child.icon} boxSize={4} opacity={0.8} />
                        )}
                        <Box as="span" fontSize="sm">
                          {child.label}
                        </Box>
                      </HStack>
                    </ChakraLink>
                  </Box>
                );
              })}
            </AccordionPanel>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
