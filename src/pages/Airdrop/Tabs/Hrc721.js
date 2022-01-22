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
} from "@chakra-ui/react";
import { useContext, useState } from "react";
import { FaInfoCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import Web3Context from "../../../contexts/Web3Context";
import rangeExtractor from "../../../utils/rangeExtractor";
import { utils } from "ethers";
import {
    NotificationContainer,
    NotificationManager,
} from "react-notifications";
const defaultForm = {
    contractAddress: "",
    rangeRawText: "",
    rawSelectedAddresses: "",
    availableTokens: [],
    selectedTokens: [],
    selectedAddresses: [],
};

const Hrc721 = ({}) => {
    const { account, setApprovalForContract, getDiscountOptions, sendERC721 } =
        useContext(Web3Context);
    const [formData, setFormData] = useState(defaultForm);
    const [authorize, setAuthorize] = useState();
    const [refreshTokenLoad, setRefreshTokenLoad] = useState(false);
    const [loadingAuthorize, setLoadingAuthorize] = useState(false);
    const [successful, setSuccessful] = useState(false);
    const [isOneAddress, setIsOneAddress] = useState(false);
    const [send, setSend] = useState("Send Tokens");
    const resetForm = () => {
        setFormData(defaultForm);
        setAuthorize(false);
        setSend("Send Tokens");
    };
    const handleSend = async () => {
        if (isOneAddress) {
            if (!utils.isAddress(formData?.rawSelectedAddresses?.trim())) {
                NotificationManager.error(
                    "Address",
                    `Invalid Contract Address: ${(
                        formData?.rawSelectedAddresses || ""
                    )
                        .toString()
                        .slice(0, 40)}`
                );
                return;
            }
            setSend("Sending Tokens");
            if (
                await sendERC721(
                    formData.contractAddress,
                    formData.selectedTokens?.map((e) => e.toString()),
                    formData.selectedTokens?.map((e) =>
                        formData?.rawSelectedAddresses?.trim()
                    )
                )
            ) {
                setSend("Sent Successfully!");
                setSuccessful(true);
                resetForm();
            } else {
                setSend("Send Tokens");
            }
            return;
        }
        let flag = false;
        let index = -1;
        formData?.selectedAddresses?.map((e, i) => {
            if (!utils.isAddress(e.trim()) && !flag) {
                flag = true;
                index = i;
            }
        });
        if (flag) {
            NotificationManager.error(
                "Address",
                `Invalid Contract Address: ${(
                    formData?.selectedAddresses[index] || ""
                )
                    .toString()
                    .slice(0, 40)}`
            );
            return;
        }
        setSend("Sending Tokens");
        if (
            await sendERC721(
                formData.contractAddress,
                formData.selectedTokens?.map((e) => e.toString()),
                formData.selectedAddresses?.map((e) => e?.trim())
            )
        ) {
            setSend("Sent Successfully!");
            setSuccessful(true);
            resetForm();
        } else {
            setSend("Send Tokens");
        }
    };
    const handleChange = (field, value) => {
        const newFormData = { ...formData };
        if (field === "rangeRawText") {
            newFormData["selectedTokens"] = rangeExtractor(
                value,
                newFormData.availableTokens
            );
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
        setLoadingAuthorize(true);
        if (await setApprovalForContract(formData.contractAddress?.trim())) {
            console.log("PASS");
            const data = await getDiscountOptions(
                formData.contractAddress?.trim()
            );
            console.log(data);
            handleChange("availableTokens", data || []);
            setAuthorize(true);
        } else {
        }
        console.log("FAIL");
        setLoadingAuthorize(false);
    };

    return (
        <>
            {account ? (
                <>
                    <Stack
                        textAlign={"center"}
                        align={"center"}
                        spacing={{ base: 8, md: 10 }}
                        py={{ base: 20, md: 28 }}
                        px={{ base: 20, md: 28 }}
                    >
                        <Text fontSize={"4xl"}>Airdrop</Text>

                        <div>
                            Note - Current contract is only in it's beta stage
                            and we will be observing community use and modify
                            and release a new contract based on that. Make sure
                            you only use the contract with our webpage and do
                            not have a contract dependency on it. Developers
                            hold the right to pause all of it's functionality at
                            any point.
                        </div>
                        <Text fontSize={"2xl"}>
                            Enter Contract Address of NFT(HRC721)
                        </Text>
                        <Input
                            value={formData.contractAddress}
                            onChange={(e) =>
                                handleChange("contractAddress", e.target.value)
                            }
                            placeholder="Enter Contract Address"
                            size="lg"
                            disabled={authorize}
                        />
                        <Flex align={"center"}>
                            {loadingAuthorize && (
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
                                disabled={authorize || loadingAuthorize}
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
                                {authorize ? "Approved" : "Approve Contract"}
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
                        {authorize && (
                            <>
                                <Text fontSize={"2xl"}>
                                    Enter Token ID Range:
                                </Text>
                                <Text fontSize={"lg"}>
                                    Available Tokens:{" "}
                                    {formData.availableTokens.map(
                                        (e, index) => (
                                            <>
                                                {index !== 0 ? " ," : ""}
                                                {e}
                                            </>
                                        )
                                    )}
                                </Text>
                                <Button
                                    onClick={async () => {
                                        setRefreshTokenLoad(true);
                                        await handleAuthorize();
                                        setRefreshTokenLoad(false);
                                    }}
                                    ml={2}
                                    disabled={refreshTokenLoad}
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
                                    Refresh{refreshTokenLoad ? "ing" : ""} Token
                                    List
                                </Button>
                                <Input
                                    value={formData.rangeRawText}
                                    onChange={(e) =>
                                        handleChange(
                                            "rangeRawText",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Enter a range for token IDs ex: 1-5,5-25 or individually 2,3,5"
                                    size="lg"
                                />
                                <div>{formData.selectedTokens?.length}</div>
                                <Text fontSize={"lg"}>
                                    Selected Tokens:{" "}
                                    {formData.selectedTokens.map((e, index) => (
                                        <>
                                            {index !== 0 ? ", " : ""}
                                            {e}
                                        </>
                                    ))}
                                </Text>

                                <Input
                                    value={formData.rawSelectedAddresses}
                                    onChange={(e) =>
                                        handleChange(
                                            "rawSelectedAddresses",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Enter Addresses comma separated"
                                    size="lg"
                                />
                                <Checkbox
                                    onChange={(e) =>
                                        setIsOneAddress(e.target.checked)
                                    }
                                    isChecked={isOneAddress}
                                >
                                    Send all tokens to one address only(If
                                    selected, please enter only one address
                                    above)
                                </Checkbox>
                                {!isOneAddress && (
                                    <div>
                                        {formData.selectedAddresses?.length ===
                                        formData.selectedTokens.length
                                            ? "Looks Good!"
                                            : formData.selectedAddresses
                                                  ?.length >
                                              formData.selectedTokens.length
                                            ? `You have exceeded by ${
                                                  formData.selectedAddresses
                                                      ?.length -
                                                  formData.selectedTokens.length
                                              } address${
                                                  formData.selectedAddresses
                                                      ?.length -
                                                      formData.selectedTokens
                                                          .length ===
                                                  1
                                                      ? ""
                                                      : "es"
                                              }`
                                            : `You need atleast ${
                                                  formData.selectedTokens
                                                      .length -
                                                  formData.selectedAddresses
                                                      ?.length
                                              } more address${
                                                  formData.selectedTokens
                                                      .length -
                                                      formData.selectedAddresses
                                                          ?.length ===
                                                  1
                                                      ? ""
                                                      : "es"
                                              }`}
                                    </div>
                                )}
                                {!isOneAddress &&
                                    formData.selectedAddresses?.length ===
                                        formData.selectedTokens.length &&
                                    formData.selectedAddresses.length > 0 && (
                                        <Button
                                            onClick={handleSend}
                                            disabled={
                                                formData.selectedAddresses
                                                    ?.length !==
                                                    formData.selectedTokens
                                                        .length ||
                                                formData.selectedAddresses
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
                                    )}
                                {isOneAddress && formData.rawSelectedAddresses && (
                                    <Button
                                        onClick={handleSend}
                                        disabled={
                                            !utils.isAddress(
                                                formData?.rawSelectedAddresses
                                            )
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
                                )}
                            </>
                        )}
                        {successful && (
                            <>
                                <Text fontSize={"4xl"}>
                                    Transaction Successful
                                </Text>
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
                </>
            ) : (
                <Center height={"80vh"}>
                    <Heading>Please connect to a wallet to continue!</Heading>
                </Center>
            )}
        </>
    );
};
export default Hrc721;
