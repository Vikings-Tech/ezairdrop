import React from "react";
import { Tabs, TabList, TabPanels, Tab, TabPanel, Center } from "@chakra-ui/react";

import Hrc721 from "./Tabs/Hrc721";
import Hrc20 from "./Tabs/Hrc20";
import Hrc1155 from "./Tabs/Hrc1155";

function index() {
    return (
        <Tabs>
            <Center mt={8}>

                <TabList>

                    <Tab>HRC721</Tab>
                    <Tab>HRC20</Tab>
                    <Tab>HRC1155</Tab>
                </TabList>
            </Center>

            <TabPanels>
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
        </Tabs >
    );
}

export default index;
