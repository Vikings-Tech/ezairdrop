import React from "react";
import { ChakraProvider, theme, Heading, Center } from "@chakra-ui/react";

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Center height={"100vh"}>
        <Heading>We'll be back soon!</Heading>
      </Center>
    </ChakraProvider>
  );
}

export default App;
