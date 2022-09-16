import React from "react";
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Center,
} from "@chakra-ui/react";

import Hrc721 from "./Tabs/Hrc721";
import Hrc20 from "./Tabs/Hrc20";
import Hrc1155 from "./Tabs/Hrc1155";
import Tokens from "./Tabs/Tokens";

function index() {
  return (
    <Tabs>
      <Center mt={8}>
        <TabList>
          <Tab>Token</Tab>
          <Tab>ERC721</Tab>
          <Tab>ERC20</Tab>
          <Tab>ERC1155</Tab>
        </TabList>
      </Center>

      <TabPanels>
        <TabPanel>
          <Tokens />
        </TabPanel>
        <TabPanel>
          <Hrc721 />
        </TabPanel>
        <TabPanel>
          <Hrc20 />
        </TabPanel>
        <TabPanel>
          <Hrc1155 />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}

export default index;
