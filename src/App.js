import React from "react";
import {
    ChakraProvider,
    Box,
    Text,
    Link,
    VStack,
    Code,
    Grid,
    theme,
} from "@chakra-ui/react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { Logo } from "./Logo";
import Navbar from "./components/Navbar";
import {
    NotificationContainer,
    NotificationManager,
} from "react-notifications";
import "react-notifications/lib/notifications.css";
import { Web3Provider } from "./contexts/Web3Context";
import { Web3Provider as ww } from "@ethersproject/providers";
import { Web3ReactProvider } from "@web3-react/core";
import Airdrop from "./pages/Airdrop/index";
import Home from "./pages/Home/index";
import FAQ from "./pages/FAQ/index";
import Donate from "./pages/Donate/index";
import Footer from "./components/Footer/index";
import Hrc20 from "./pages/Airdrop/Tabs/Hrc20";

function getLibrary(provider) {
    var library;

    if (provider?.chainType === "hmy") {
        library = provider.blockchain;
    } else {
        library = new ww(provider);
        library.pollingInterval = 12000;
    }

    return library;
}

function App() {
    return (
        <ChakraProvider theme={theme}>
            <NotificationContainer />

            <Router>
                <Web3ReactProvider getLibrary={getLibrary}>
                    <Web3Provider>
                        <Navbar />
                        <div style={{ minHeight: "90vh" }}>
                            <Routes>
                                <Route
                                    path="/airdrop/erc20"
                                    element={<Hrc20 />}
                                />
                                <Route path="/airdrop" element={<Airdrop />} />
                                <Route path="/faq" element={<FAQ />} />
                                <Route path="/donate" element={<Donate />} />

                                <Route path="/" element={<Home />} />
                            </Routes>
                        </div>
                        <Footer />
                    </Web3Provider>
                </Web3ReactProvider>
            </Router>
        </ChakraProvider>
    );
}

export default App;
