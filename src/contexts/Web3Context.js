import React, { useState, createContext, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";
import nftContract from "../abi/nftContract.json";
import erc20Contract from "../abi/erc20.json"
import airdropContract from "../abi/airdropContract.json"
import { Contract } from "@ethersproject/contracts";
import { ethers, BigNumber, providers, utils } from "ethers";
import { Contract as MultiContract, Provider } from "ethers-multicall";
import { NotificationContainer, NotificationManager } from 'react-notifications';




// TEST NET BYATCH
// const OUR_ADDRESS = "0x37f0eE4b69D2958749C86e06A5b6F93436202E0E"
// const RPC_URL = "https://api.s0.b.hmny.io";
// const CHAIN_ID = 1666700000;
// const MULTI_CALL_ADDRESS = "0xd078799c53396616844e2fa97f0dd2b4c145a685"
// MAIN NET SIR
const OUR_ADDRESS = "0x7B5a9942d1a7e6F450EfD59ce4C42c6309B5591F"
const RPC_URL = "https://api.harmony.one";
const CHAIN_ID = 1666600000;

const MULTI_CALL_ADDRESS = "0x34b415f4d3b332515e66f70595ace1dcf36254c5"
const Web3Context = createContext();

export const Web3Provider = (props) => {
    const { activate, account, library } = useWeb3React();
    const [signer, setSigner] = useState()
    let nftContractObject, airdropContractObject;
    const { ethereum } = window;
    const injected = new InjectedConnector({
        supportedChainIds: [CHAIN_ID],
    });

    const onClickMetamask = async () => {

        const connector = injected;
        activate(connector, async (err) => {
            const hasSetup = await setupNetwork(
                CHAIN_ID,
                RPC_URL
            );
            if (hasSetup) activate(connector);
        });
        await ethereum.request({ method: 'eth_requestAccounts' })
        NotificationManager.success("Success", "Wallet Connected!")
    };
    const disconnect = async () => {
        // setAccount()
    }

    useEffect(async () => {
        if (!library) return;
        const data =
            library?.messenger?.chainType === "hmy"
                ? library.provider
                : await library.getSigner(account);
        setSigner(data);
    }, [library]);

    const setupNetwork = async (chainId, rpcUrl) => {
        const provider = window.ethereum;
        try {
            await window.ethereum.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: `0x${chainId.toString(16)}` }],
            });
            onClickMetamask(injected)

        } catch (switchError) {
            // This error code indicates that the chain has not been added to MetaMask.
            try {
                await window.ethereum.request({
                    method: "wallet_addEthereumChain",
                    params: [
                        {
                            chainId: `0x${chainId.toString(16)}`,
                            rpcUrls: [RPC_URL],
                            chainName: "Harmony Mainnet",
                            nativeCurrency: {
                                name: "one",
                                symbol: "ONE", // 2-6 characters long
                                decimals: 18,
                            },
                        },
                    ],
                });
            } catch (addError) {
                // handle "add" error
                // console.log(addError);
            }

            // handle other "switch" errors
        }
    };




    const functionsToExport = { onClickMetamask };
    functionsToExport.getDiscountOptions = async (address) => {
        const availableDiscounts = [{ contractAddress: address.trim() }];
        const provider = new ethers.providers.Web3Provider(
            window.ethereum,
            "any"
        );

        console.log(address);
        const ethcallProvider = new Provider(provider);
        let contracts = {};
        const balancesCalls = availableDiscounts.map((discount) => {
            contracts[discount.contractAddress] = new MultiContract(discount.contractAddress, nftContract);
            return contracts[discount.contractAddress].balanceOf(account);
        })
        await ethcallProvider.init(); // Only required when `chainId` is not provided in the `Provider` constructor
        ethcallProvider._multicallAddress =
            MULTI_CALL_ADDRESS;

        const balances = (await ethcallProvider.all(balancesCalls))?.map(e => e.toString());
        const discountTokens = []
        const discountTokenIdCalls = []
        const tokenIdCalls = availableDiscounts.map((discount, index) => {
            for (let i = 0; i < balances[index]; i++) {
                discountTokens.push({ ...discount, tokenIndex: i, });
                // console.log(i);
                // console.log(account)
                discountTokenIdCalls.push(contracts[discount.contractAddress].tokenOfOwnerByIndex(account, i));
            }
        });
        // console.log(balances);
        // console.log(discountTokenIdCalls);
        const discountTokenIds = (await ethcallProvider.all(discountTokenIdCalls));
        // console.log(discountTokenIds)
        const isDiscountRetrievedCalls = discountTokenIds.map((e, index) => {
            e = e.toString();
            discountTokens[index].tokenId = e;
        });

        // console.log(discountTokenIds);
        // console.log(isDiscountRetrieved);
        return discountTokenIds.map(e => parseInt(e.toString()));
        const filterDiscountTokens = discountTokens.filter(e => !e.isUsed);
        return filterDiscountTokens;



    }

    functionsToExport.balanceOf = async (contract) => {
        try {
            nftContractObject = new Contract(
                contract?.trim(),
                erc20Contract,
                signer
            );
            return utils.formatEther(await nftContractObject.balanceOf(account));
        }
        catch (e) {
            console.log(e)
            NotificationManager.error("Contract", "Invalid Contract")
        }


    }

    functionsToExport.sendTokens = async (contract, tokens, addresses) => {
        NotificationManager.info("Allowance", "Fetching Allowance")
        nftContractObject = new Contract(
            contract?.trim(),
            erc20Contract,
            signer
        );
        let tokenSum = 0;
        tokens.map(e => { tokenSum += parseFloat(e) });
        tokenSum = utils.parseEther(tokenSum.toString());
        try {
            while (true) {
                const allowance = await nftContractObject.allowance(account, OUR_ADDRESS)
                if (allowance >= tokenSum) {
                    break;
                }
                console.log(tokenSum);
                console.log(allowance);
                NotificationManager.info("Allowance", `Requesting to increase allowance by:${tokenSum - allowance}`)

                const increaseAllowance = await nftContractObject.increaseAllowance(OUR_ADDRESS, (tokenSum - allowance).toString());


            }

        } catch (e) {
            console.log(e);

            NotificationManager.error("Approval", "Failed! Couldn't increase allowance, please try again.")
            return false;
        }
        try {
            airdropContractObject = new Contract(
                OUR_ADDRESS,
                airdropContract,
                signer
            );
            const transaction = await airdropContractObject.airDrop20(contract, tokens, addresses, { value: utils.parseEther("1") });
            const result = await transaction.wait()
            NotificationManager.info("Transaction", "Transaction Successful!")
            return true;

        }
        catch (e) {
            NotificationManager.info("Transaction", "Transaction Failed, Try again!")
            return false;
        }


    }
    functionsToExport.setApprovalForContract = async (contract) => {
        try {
            NotificationManager.info("Approval", "Checking for Approval")

            nftContractObject = new Contract(
                contract?.trim(),
                nftContract,
                signer
            );
            const approval = await nftContractObject.isApprovedForAll(account, OUR_ADDRESS);
            console.log(approval);
            if (!approval) {
                const transaction = await nftContractObject.setApprovalForAll(OUR_ADDRESS, true);
                console.log("HER")
                const result = await transaction.wait()
                console.log("HERee")
            }
            NotificationManager.success("Approval", "Approved! Fetching Tokens")

            return true;
        }
        catch (e) {
            NotificationManager.error("Approval", "Failed! Check Contract Address and try again")
            console.log(e)
            return false;
        }
    }

    functionsToExport.sendERC721 = async (address, tokens = [], addresses = []) => {
        try {
            NotificationManager.info("Transaction", "Initiating Transaction")
            airdropContractObject = new Contract(
                OUR_ADDRESS,
                airdropContract,
                signer
            );
            const transaction = await airdropContractObject.airDrop721(address, tokens, addresses, { value: utils.parseEther("1") });
            const result = await transaction.wait()
            NotificationManager.info("Transaction", "Transaction Successful!")
            return true;
        }
        catch (e) {
            NotificationManager.info("Transaction", "Transaction Failed, Try again!")
            return false;
        }
    }
    functionsToExport.sendAmount = async (amount) => {
        try {
            NotificationManager.info("Donation", "Transaction Initiated")
            console.log(utils.parseEther(amount))
            const transfer = await signer.sendTransaction({
                value: utils.parseEther(amount),
                to: OUR_ADDRESS,
                from: account
            })
            NotificationManager.info("Donation", "Transaction in progress")

            const result = await transfer.wait();
            console.log(result);
            NotificationManager.success("Donation", "Transaction Successful! Thank you!")

            return true
        }
        catch (e) {
            console.log(e);
            NotificationManager.info("Donation", "Transaction Failed")

            return false;
        }

    }


    return (<Web3Context.Provider value={{ account, ...functionsToExport }}>
        {props.children}
    </Web3Context.Provider>)
}
export default Web3Context;