import {
    Button,
    Input,
    Text,
    Stack,
    Heading,
    Center,
    Tooltip,
    Flex,
    Spinner,
    Checkbox,
    Box,
    VStack,
} from "@chakra-ui/react";
import { useContext, useState } from "react";
import { FaInfoCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import Web3Context from "../../../contexts/Web3Context";
import floatExtractor from "../../../utils/floatExtractor";
import { utils } from "ethers";
import {
    NotificationContainer,
    NotificationManager,
} from "react-notifications";
import TableElement from "../../../components/Table/Table1155";
const defaultForm = {
    contractAddress: "",
    rangeRawText: "",
    rawSelectedAddresses: "",
    rawSelectedAmount: "",
    availableBalance: 0,
    totalSelectedTokens: 0,
    selectedTokens: [],
    totalSelectedAmount: 0,
    selectedAmount: [],
    selectedAddresses: [],
};

const Hrc1155 = ({}) => {
    const { account, balanceOf, sendErc1155Tokens, setApprovalForContract } =
        useContext(Web3Context);
    const [formData, setFormData] = useState(defaultForm);
    const [verifyToken, setVerifyToken] = useState();
    const [refreshTokenLoad, setRefreshTokenLoad] = useState(false);
    const [loadingVerify, setLoadingVerify] = useState(false);
    const [successful, setSuccessful] = useState(false);
    const [isOneAmount, setIsOneAmount] = useState(false);
    const [isOneAmountValue, setIsOneAmountValue] = useState(false);
    const [send, setSend] = useState("Send Tokens");
    const resetForm = () => {
        setFormData(defaultForm);
        setVerifyToken(false);
        setSend("Send Tokens");
    };
    const handleAuthorize = async () => {
        if (!utils.isAddress(formData?.contractAddress)) {
            NotificationManager.error(
                "Address",
                `Invalid Contract Address: ${(formData?.contractAddress || "")
                    .toString()
                    .slice(0, 40)}`
            );
            return;
        }
        console.log();
        setLoadingVerify(true);
        if (await setApprovalForContract(formData.contractAddress?.trim())) {
            setVerifyToken(true);
        } else {
        }
        setLoadingVerify(false);
    };
    const handleSend = async () => {
        const {
            contractAddress,
            selectedTokens,
            selectedAmount,
            selectedAddresses,
        } = formData;
        await sendErc1155Tokens(
            contractAddress,
            selectedTokens,
            selectedAmount,
            selectedAddresses
        );
        // if (isOneAmount && isOneAmountValue) {
        //     if (isNaN(formData?.rangeRawText?.trim())) {
        //         NotificationManager.error(
        //             "Address",
        //             `Invalid Amount: ${(formData?.rangeRawText || "")
        //                 .toString()
        //                 .slice(0, 40)}`
        //         );
        //         return;
        //     }
        //     setSend("Sending Tokens");
        //     if (
        //         await sendTokens(
        //             formData.contractAddress,
        //             formData.selectedAddresses?.map((e) =>
        //                 formData?.rangeRawText.toString()
        //             ),
        //             formData.selectedAddresses?.map((e) => e?.trim())
        //         )
        //     ) {
        //         setSend("Sent Successfully!");
        //         setSuccessful(true);
        //         resetForm();
        //     } else {
        //         setSend("Send Tokens");
        //     }
        //     return;
        // }
        // let flag = false;
        // let index = -1;
        // formData?.selectedAddresses?.map((e, i) => {
        //     if (!utils.isAddress(e.trim()) && !flag) {
        //         flag = true;
        //         index = i;
        //     }
        // });
        // if (flag) {
        //     NotificationManager.error(
        //         "Address",
        //         `Invalid Contract Address: ${(
        //             formData?.selectedAddresses[index] || ""
        //         )
        //             .toString()
        //             .slice(0, 40)}`
        //     );
        //     return;
        // }
        // setSend("Sending Tokens");
        // if (
        //     await sendTokens(
        //         formData.contractAddress,
        //         formData.selectedTokens?.map((e) => e.toString()),
        //         formData.selectedAmount?.map((e) => e.toString()),
        //         formData.selectedAddresses?.map((e) => e?.trim())
        //     )
        // ) {
        //     setSend("Sent Successfully!");
        //     setSuccessful(true);
        //     resetForm();
        // } else {
        //     setSend("Send Tokens");
        // }
    };
    const handleChange = (field, value) => {
        const newFormData = { ...formData };
        if (field === "rangeRawText") {
            newFormData["selectedTokens"] = floatExtractor(
                value,
                newFormData.availableBalance
            );
            let totalSum = 0;
            newFormData["selectedTokens"].map((e) => {
                totalSum += parseFloat(e);
            });
            newFormData["totalSelectedTokens"] = totalSum;
        } else if (field === "rawSelectedAmount") {
            newFormData["selectedAmount"] = floatExtractor(
                value,
                newFormData.availableBalance
            );
            let amountSum = 0;
            newFormData["selectedAmount"].map((e) => {
                amountSum += parseFloat(e);
            });
        } else if (field === "rawSelectedAddresses") {
            newFormData["selectedAddresses"] = value
                ?.split(",")
                ?.map((e) => e?.trim());
            newFormData["selectedAddresses"] = newFormData[
                "selectedAddresses"
            ].filter((e) => e !== "");
        }
        newFormData[field] = value;
        setFormData(newFormData);
    };
    const handleSubmit = async () => {
        if (!utils.isAddress(formData?.contractAddress)) {
            NotificationManager.error(
                "Address",
                `Invalid Contract Address: ${(formData?.contractAddress || "")
                    .toString()
                    .slice(0, 40)}`
            );
            return;
        }
        console.log();
        setLoadingVerify(true);
        const balance = await balanceOf(formData.contractAddress?.trim());
        if (balance) {
            handleChange("availableBalance", balance);
            setVerifyToken(true);
        }

        setLoadingVerify(false);
    };

    const ButtonDisabled =
        (!isOneAmount || !isOneAmountValue) &&
        (formData.selectedTokens.length !== formData.selectedAddresses.length ||
            formData.selectedAmount.length !==
                formData.selectedAddresses.length ||
            formData.selectedAmount.length !== formData.selectedTokens.length);

    return (
        <>
            {account ? (
                <Stack
                    textAlign={"center"}
                    align={"center"}
                    spacing={{ base: 8, md: 10 }}
                    py={{ base: 20, md: 28 }}
                    px={{ base: 20, md: 28 }}
                >
                    <Text fontSize={"4xl"}>Airdrop</Text>

                    <div>
                        Note - Current contract is only in it's beta stage and
                        we will be observing community use and modify and
                        release a new contract based on that. Make sure you only
                        use the contract with our webpage and do not have a
                        contract dependency on it. Developers hold the right to
                        pause all of it's functionality at any point.
                    </div>
                    <Text fontSize={"2xl"}>
                        Enter Contract Address(HRC1155)
                    </Text>
                    <Input
                        value={formData.contractAddress}
                        onChange={(e) =>
                            handleChange("contractAddress", e.target.value)
                        }
                        placeholder="Enter Contract Address"
                        size="lg"
                        disabled={verifyToken}
                    />
                    <Flex align={"center"}>
                        {loadingVerify && (
                            <Spinner
                                mr={4}
                                thickness="4px"
                                speed="0.65s"
                                emptyColor="gray.200"
                                color="pink.400"
                                size="xl"
                            />
                        )}
                        <Button
                            onClick={handleAuthorize}
                            mr={2}
                            disabled={verifyToken || loadingVerify}
                            display={{ base: "none", md: "inline-flex" }}
                            fontSize={"sm"}
                            fontWeight={600}
                            color={"white"}
                            bg={"pink.400"}
                            href={"#"}
                            _hover={{
                                bg: "pink.300",
                            }}
                        >
                            {verifyToken ? "Verified" : "Verify"}
                        </Button>
                        <Tooltip
                            label="To ensure the contract address is valid and sufficient balance is present"
                            fontSize="md"
                        >
                            <span>
                                <FaInfoCircle />
                            </span>
                        </Tooltip>
                    </Flex>

                    {verifyToken && (
                        <>
                            <Box>
                                <Text fontSize={20} textAlign={"left"} mb={5}>
                                    Enter Token Ids:
                                </Text>
                                <Input
                                    value={formData.rangeRawText}
                                    onChange={(e) =>
                                        handleChange(
                                            "rangeRawText",
                                            e.target.value
                                        )
                                    }
                                    w={"80vw"}
                                    placeholder="Enter a range for token IDs ex: 1-5,5-25 or individually 2,3,5"
                                />
                                <Text
                                    fontSize={20}
                                    textAlign={"left"}
                                    mt={5}
                                    color={"red.500"}
                                >
                                    {isOneAmount &&
                                        formData.selectedTokens.length > 1 &&
                                        "One Value!"}
                                </Text>
                            </Box>
                            <div>{formData.selectedTokens?.length}</div>
                            <Text fontSize={"lg"}>
                                Selected Values:{" "}
                                {formData.selectedTokens.map((e, index) => (
                                    <>
                                        {index !== 0 ? ", " : ""}
                                        {e}
                                    </>
                                ))}
                            </Text>

                            <Checkbox
                                onChange={(e) =>
                                    setIsOneAmount(e.target.checked)
                                }
                                isChecked={isOneAmount}
                            >
                                Send same value to all addresses(If selected,
                                please enter only one value above)
                            </Checkbox>

                            {/*Token Amount*/}
                            <Box>
                                <Text fontSize={20} textAlign={"left"} mb={5}>
                                    Enter Amounts:
                                </Text>
                                <Input
                                    w={"80vw"}
                                    value={formData.rawSelectedAmount}
                                    onChange={(e) =>
                                        handleChange(
                                            "rawSelectedAmount",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Enter comma seperated amounts"
                                    size="lg"
                                />

                                <Text
                                    fontSize={20}
                                    textAlign={"left"}
                                    mt={5}
                                    color={"red.500"}
                                >
                                    {isOneAmountValue &&
                                        formData.selectedAmount.length > 1 &&
                                        "One Value!"}
                                </Text>
                            </Box>
                            <div>{formData.selectedAmount?.length}</div>
                            <Text fontSize={"lg"}>
                                Selected Values:{" "}
                                {formData.selectedAmount.map((e, index) => (
                                    <>
                                        {index !== 0 ? ", " : ""}
                                        {e}
                                    </>
                                ))}
                            </Text>

                            <Checkbox
                                onChange={(e) =>
                                    setIsOneAmountValue(e.target.checked)
                                }
                                isChecked={isOneAmountValue}
                            >
                                Send same amount to all addresses(If selected,
                                please enter only one value above)
                            </Checkbox>

                            <Box>
                                <Text fontSize={20} textAlign={"left"} mb={5}>
                                    Enter Addresses:
                                </Text>
                                <Input
                                    value={formData.rawSelectedAddresses}
                                    w={"80vw"}
                                    onChange={(e) =>
                                        handleChange(
                                            "rawSelectedAddresses",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Enter Addresses comma separated"
                                    size="lg"
                                />
                            </Box>
                            <div>
                                {
                                    <span>
                                        <Text
                                            mt={10}
                                            fontSize={20}
                                            color={"green.400"}
                                        >
                                            {((formData.selectedAddresses
                                                ?.length ===
                                                formData.selectedTokens
                                                    .length &&
                                                formData.selectedAmount
                                                    .length ===
                                                    formData.selectedTokens
                                                        .length) ||
                                                (formData.selectedAddresses
                                                    ?.length ===
                                                    formData.selectedTokens
                                                        .length &&
                                                    isOneAmountValue) ||
                                                (formData.selectedAddresses
                                                    ?.length ===
                                                    formData.selectedAmount
                                                        .length &&
                                                    isOneAmount) ||
                                                (formData.selectedAddresses
                                                    ?.length >= 0 &&
                                                    formData.selectedAmount
                                                        .length !== 0 &&
                                                    formData.selectedTokens
                                                        .length !== 0 &&
                                                    isOneAmount &&
                                                    isOneAmountValue)) &&
                                                "Looks Good"}
                                        </Text>

                                        <Text
                                            mt={10}
                                            fontSize={20}
                                            color={"red.400"}
                                        >
                                            {isOneAmount &&
                                                isOneAmountValue &&
                                                (formData.selectedAmount
                                                    .length === 0 ||
                                                    formData.selectedTokens
                                                        .length === 0) &&
                                                "You need to specify at least one Token Id and one Amount"}
                                        </Text>

                                        <Text
                                            mt={10}
                                            fontSize={20}
                                            color={"red.400"}
                                        >
                                            {formData.selectedAmount.length >
                                                formData.selectedTokens
                                                    .length &&
                                                `You have exceeded by ${
                                                    formData.selectedAmount
                                                        .length -
                                                    formData.selectedTokens
                                                        .length
                                                } value${
                                                    formData.selectedAmount
                                                        .length -
                                                        formData.selectedTokens
                                                            .length ===
                                                    1
                                                        ? ""
                                                        : "s"
                                                } for amount`}
                                        </Text>
                                        <Text
                                            mt={10}
                                            fontSize={20}
                                            color={"red.400"}
                                        >
                                            {formData.selectedAmount.length <
                                                formData.selectedTokens
                                                    .length &&
                                                `You need atleast ${
                                                    formData.selectedTokens
                                                        .length -
                                                    formData.selectedAmount
                                                        .length
                                                } more value${
                                                    formData.selectedTokens
                                                        .length -
                                                        formData.selectedAmount
                                                            ?.length ===
                                                    1
                                                        ? ""
                                                        : "s"
                                                } for amount`}
                                        </Text>

                                        <Text
                                            mt={10}
                                            fontSize={20}
                                            color={"red.400"}
                                        >
                                            {(!isOneAmount ||
                                                !isOneAmountValue) &&
                                                formData.selectedAddresses
                                                    ?.length >
                                                    formData.selectedTokens
                                                        .length &&
                                                `You have exceeded by ${
                                                    formData.selectedAddresses
                                                        ?.length -
                                                    formData.selectedTokens
                                                        .length
                                                } address${
                                                    formData.selectedAddresses
                                                        ?.length -
                                                        formData.selectedTokens
                                                            .length ===
                                                    1
                                                        ? ""
                                                        : "es"
                                                }`}
                                        </Text>

                                        <Text
                                            mt={10}
                                            fontSize={20}
                                            color={"red.400"}
                                        >
                                            {formData.selectedAddresses
                                                ?.length <
                                                formData.selectedTokens
                                                    .length &&
                                                `You need atleast ${
                                                    formData.selectedTokens
                                                        .length -
                                                    formData.selectedAddresses
                                                        ?.length
                                                } more address${
                                                    formData.selectedTokens
                                                        .length -
                                                        formData
                                                            .selectedAddresses
                                                            ?.length ===
                                                    1
                                                        ? ""
                                                        : "es"
                                                }`}
                                        </Text>
                                    </span>
                                }
                            </div>
                            <VStack>
                                <Text
                                    fontSize={25}
                                    mt={30}
                                    mb={10}
                                    color={"gray.400"}
                                >
                                    Preview Table
                                </Text>
                                <TableElement
                                    addresses={formData.selectedAddresses}
                                    tokenIds={formData.selectedTokens}
                                    amounts={formData.selectedAmount}
                                    isOneAmount={isOneAmount}
                                    isOneAmountValue={isOneAmountValue}
                                />
                            </VStack>
                            {formData.rawSelectedAmount && (
                                <Button
                                    onClick={handleSend}
                                    display={{
                                        base: "none",
                                        md: "inline-flex",
                                    }}
                                    fontSize={"sm"}
                                    fontWeight={600}
                                    color={"white"}
                                    bg={"pink.400"}
                                    href={"#"}
                                    _hover={{
                                        bg: "pink.300",
                                    }}
                                    disabled={ButtonDisabled}
                                >
                                    {send}
                                </Button>
                            )}
                        </>
                    )}
                    {verifyToken && successful && (
                        <>
                            <Text fontSize={"4xl"}>Transaction Successful</Text>
                            <Link to="/donate">
                                <Button
                                    bg={"pink.400"}
                                    color={"white"}
                                    rounded={"full"}
                                    px={6}
                                >
                                    Consider Donating!
                                </Button>
                            </Link>
                        </>
                    )}
                </Stack>
            ) : (
                <Center height={"80vh"}>
                    <Heading>Please connect to a wallet to continue!</Heading>
                </Center>
            )}
        </>
    );
};

export default Hrc1155;
