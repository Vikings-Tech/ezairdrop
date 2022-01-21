import React from 'react';
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';

import Erc721 from './Tabs/Erc721';
import Erc20 from './Tabs/Erc20';
import Erc1155 from './Tabs/Erc1155';

function index() {
  return (
    <Tabs>
      <TabList>
        <Tab>ERC721</Tab>
        <Tab>ERC20</Tab>
        <Tab>ERC1155</Tab>
      </TabList>

      <TabPanels>
        <TabPanel>
          <Erc721 />
        </TabPanel>
        <TabPanel>
          <Erc20 />
        </TabPanel>
        <TabPanel>
          <Erc1155 />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}

export default index;
