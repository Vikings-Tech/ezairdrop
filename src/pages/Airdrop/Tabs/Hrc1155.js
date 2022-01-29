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
    HStack,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
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
    const {
        isOpen: is1155Open,
        onOpen: on1155Open,
        onClose: on1155Close,
    } = useDisclosure();

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
    const [totalTokenAmount, setTotalTokenAmount] = useState(0);
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

        console.log(formData);

        const resp = await sendErc1155Tokens(
            contractAddress,
            selectedTokens,
            selectedAmount,
            selectedAddresses
        );

        if (resp) {
            setSuccessful(true);
        }

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

    const modalFunction = () => {
        let totalAmount = 0;

        for (let i = 0; i < formData.selectedTokens.length; i++) {
            totalAmount += parseInt(formData.selectedAmount[i]);
        }
        setTotalTokenAmount(totalAmount);
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
                    spacing={{ base: 8 }}
                    py={{ base: 12 }}
                    px={{ base: 12 }}
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
                            {verifyToken
                                ? "Contract Approved"
                                : "Approve Contract"}
                        </Button>
                        <Tooltip
                            label="To make transfers on your behalf, our contract needs to be approved first."
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
                                    onChange={(e) => {
                                        if (!isOneAmount) {
                                            handleChange(
                                                "rangeRawText",
                                                e.target.value
                                            );
                                        }
                                    }}
                                    w={"80vw"}
                                    placeholder="Enter a range for token IDs ex: 1-5,5-25 or individually 2,3,5"
                                />
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
                                onChange={(e) => {
                                    setIsOneAmount(e.target.checked);

                                    const addressLength =
                                        formData.selectedAddresses.length;
                                    const tokenLength =
                                        formData.selectedTokens.length;

                                    if (e.target.checked) {
                                        for (
                                            let i = 1;
                                            i < addressLength;
                                            i++
                                        ) {
                                            formData.selectedTokens[i] =
                                                formData.selectedTokens[0];
                                        }
                                    }

                                    if (
                                        e.target.checked &&
                                        tokenLength > addressLength
                                    ) {
                                        formData.selectedTokens.splice(
                                            addressLength,
                                            tokenLength - addressLength
                                        );
                                    }

                                    if (!e.target.checked) {
                                        handleChange(
                                            "rangeRawText",
                                            formData.rangeRawText
                                        );
                                    }
                                }}
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
                                    onChange={(e) => {
                                        if (!isOneAmountValue) {
                                            handleChange(
                                                "rawSelectedAmount",
                                                e.target.value
                                            );
                                        }
                                    }}
                                    placeholder="Enter comma seperated amounts"
                                    size="lg"
                                />
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
                                onChange={(e) => {
                                    setIsOneAmountValue(e.target.checked);

                                    const addressLength =
                                        formData.selectedAddresses.length;
                                    const amountLength =
                                        formData.selectedAmount.length;

                                    if (e.target.checked) {
                                        for (
                                            let i = 1;
                                            i < addressLength;
                                            i++
                                        ) {
                                            formData.selectedAmount[i] =
                                                formData.selectedAmount[0];
                                        }
                                    }

                                    if (
                                        e.target.checked &&
                                        amountLength > addressLength
                                    ) {
                                        formData.selectedAmount.splice(
                                            addressLength,
                                            amountLength - addressLength
                                        );
                                    }

                                    if (!e.target.checked) {
                                        handleChange(
                                            "rawSelectedAmount",
                                            formData.rawSelectedAmount
                                        );
                                    }
                                }}
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
                                            {formData.selectedAddresses
                                                ?.length !== 0 &&
                                                formData.selectedTokens
                                                    .length !== 0 &&
                                                formData.selectedAmount
                                                    .length !== 0 &&
                                                ((formData.selectedAddresses
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
                                            {formData.selectedAddresses
                                                ?.length === 0 &&
                                                formData.selectedTokens
                                                    .length === 0 &&
                                                formData.selectedAmount
                                                    .length === 0 &&
                                                "Input Fields Empty"}
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
                                            {!isOneAmount &&
                                                formData.selectedAmount.length >
                                                    formData.selectedAddresses
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
                                            {!isOneAmountValue &&
                                                formData.selectedAmount.length <
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
                                <span>
                                    <Button
                                        onClick={async () => {
                                            await modalFunction();
                                            on1155Open();
                                        }}
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
                                        Summary
                                    </Button>
                                    <Modal
                                        closeOnOverlayClick={false}
                                        isOpen={is1155Open}
                                        onClose={on1155Close}
                                    >
                                        <ModalOverlay />
                                        <ModalContent>
                                            <ModalHeader>Summary</ModalHeader>
                                            <ModalCloseButton />
                                            <ModalBody>
                                                <VStack spacing={10} mb={10}>
                                                    <HStack
                                                        spacing={20}
                                                        justifyContent={
                                                            "space-between"
                                                        }
                                                    >
                                                        <Flex
                                                            flexDirection={
                                                                "column"
                                                            }
                                                        >
                                                            <Text fontSize={30}>
                                                                {
                                                                    formData
                                                                        .selectedAddresses
                                                                        .length
                                                                }
                                                            </Text>
                                                            <Text
                                                                color={
                                                                    "gray.400"
                                                                }
                                                                fontSize={12}
                                                                textAlign={
                                                                    "left"
                                                                }
                                                                maxW={"13vw"}
                                                            >
                                                                Total Number of
                                                                Addresses
                                                            </Text>
                                                        </Flex>
                                                        <Flex
                                                            textAlign="right"
                                                            flexDirection={
                                                                "column"
                                                            }
                                                        >
                                                            <Text fontSize={30}>
                                                                {isOneAmount
                                                                    ? "1"
                                                                    : formData
                                                                          .selectedTokens
                                                                          .length}
                                                            </Text>
                                                            <Text
                                                                color={
                                                                    "gray.400"
                                                                }
                                                                maxW={"15vw"}
                                                                fontSize={12}
                                                                textAlign={
                                                                    "left"
                                                                }
                                                            >
                                                                Total number of
                                                                Token Ids
                                                            </Text>
                                                        </Flex>
                                                    </HStack>
                                                    <HStack
                                                        spacing={5}
                                                        justifyContent={
                                                            "space-between"
                                                        }
                                                    >
                                                        <Flex
                                                            flexDirection={
                                                                "column"
                                                            }
                                                        >
                                                            <Text fontSize={26}>
                                                                {
                                                                    totalTokenAmount
                                                                }
                                                            </Text>
                                                            <Text
                                                                color={
                                                                    "gray.400"
                                                                }
                                                                w={"12vw"}
                                                                fontSize={12}
                                                                textAlign={
                                                                    "left"
                                                                }
                                                            >
                                                                Total number of
                                                                Tokens to be
                                                                Sent
                                                            </Text>
                                                        </Flex>
                                                        <Flex
                                                            textAlign="right"
                                                            flexDirection={
                                                                "column"
                                                            }
                                                        >
                                                            <Text fontSize={26}>
                                                                1 ONE + gas
                                                            </Text>
                                                            <Text
                                                                color={
                                                                    "gray.400"
                                                                }
                                                                maxW={"13vw"}
                                                                fontSize={12}
                                                                textAlign={
                                                                    "right"
                                                                }
                                                            >
                                                                Approximate Cost
                                                                of Operations
                                                            </Text>
                                                        </Flex>
                                                    </HStack>
                                                    <Text color={"yellow.400"}>
                                                        *We charge a convenience
                                                        fee of 1 ONE
                                                    </Text>
                                                </VStack>
                                            </ModalBody>

                                            <ModalFooter
                                                justifyContent={"center"}
                                            >
                                                <Button
                                                    mb={5}
                                                    onClick={handleSend}
                                                    disabled={
                                                        formData
                                                            .selectedAddresses
                                                            ?.length !==
                                                            formData
                                                                .selectedTokens
                                                                .length ||
                                                        formData
                                                            .selectedAddresses
                                                            ?.length === 0
                                                    }
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
                                                >
                                                    {send}
                                                </Button>
                                            </ModalFooter>
                                        </ModalContent>
                                    </Modal>
                                </span>
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
