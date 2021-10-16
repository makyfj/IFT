import Link from "next/link";
import React from "react";
import {
  Button,
  Flex,
  Spacer,
  Box,
  Heading,
  AspectRatio,
  Image,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";

const Header = () => {
  const { toggleColorMode, colorMode } = useColorMode();

  return (
    <Flex p="3">
      <Box mr="2">
        <AspectRatio ration={1} w={14}>
          <Image src="/images/logo.png" alt="logo" />
        </AspectRatio>
      </Box>
      <Box>
        <Heading size="xl">
          <Link href="/">Home</Link>
        </Heading>
      </Box>
      <Spacer />

      <Box>
        <Button variant="primary" size="sm" onClick={toggleColorMode}>
          {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
        </Button>
      </Box>
      <Spacer />
      <Box>
        <Button mr="5" variant="primary" size="sm">
          <Link href="/register">Register</Link>
        </Button>
        <Button variant="primary" size="sm">
          <Link href="/login">Log In</Link>
        </Button>
      </Box>
    </Flex>
  );
};

export default Header;