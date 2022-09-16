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
import TableNormal from "../../../components/Table/Table_20_721";
import { useEffect } from "react";
const defaultForm = {
  contractAddress: "",
  rangeRawText: "",
  rawSelectedAddresses: "",
  availableBalance: 0,
  totalSelectedTokens: 0,
  selectedTokens: [],
  selectedAddresses: [],
};

const Tokens = ({}) => {
  const {
    isOpen: is20Open,
    onOpen: on20Open,
    onClose: on20Close,
  } = useDisclosure();

  const {
    account,
    balanceOf,
    sendNormalTokens,
    getBalance,
    balance,
    selectedNetwork,
  } = useContext(Web3Context);
  const [formData, setFormData] = useState(defaultForm);
  const [verifyToken, setVerifyToken] = useState(true);
  const [refreshTokenLoad, setRefreshTokenLoad] = useState(false);
  const [loadingVerify, setLoadingVerify] = useState(false);
  const [successful, setSuccessful] = useState(false);
  const [isOneAmount, setIsOneAmount] = useState(false);
  const [send, setSend] = useState("Send Tokens");
  const resetForm = () => {
    setFormData(defaultForm);
    setVerifyToken(false);
    setSend("Send Tokens");
  };
  const handleSend = async () => {
    if (isOneAmount) {
      if (isNaN(formData?.rangeRawText?.trim())) {
        NotificationManager.error(
          "Address",
          `Invalid Amount: ${(formData?.rangeRawText || "")
            .toString()
            .slice(0, 40)}`
        );
        return;
      }
      setSend("Sending Tokens");
      console.log(
        formData.selectedAddresses?.map((e) =>
          formData?.rangeRawText.toString()
        )
      );
      if (
        await sendNormalTokens(
          formData.selectedAddresses?.map((e) =>
            formData?.rangeRawText.toString()
          ),
          formData.selectedAddresses?.map((e) => e?.trim())
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
        `Invalid Contract Address: ${(formData?.selectedAddresses[index] || "")
          .toString()
          .slice(0, 40)}`
      );
      return;
    }
    setSend("Sending Tokens");
    if (
      await sendNormalTokens(
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
      newFormData["selectedTokens"] = floatExtractor(
        value,
        newFormData.availableBalance
      );
      let totalSum = 0;
      newFormData["selectedTokens"].map((e) => {
        totalSum += parseFloat(e);
      });
      newFormData["totalSelectedTokens"] = totalSum;
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
    await getBalance();
  };
  useEffect(() => {
    if (account) {
      getBalance();
    }
  }, [account]);

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
            Note - Current contract is only in it's beta stage and we will be
            observing community use and modify and release a new contract based
            on that. Make sure you only use the contract with our webpage and do
            not have a contract dependency on it. Developers hold the right to
            pause all of it's functionality at any point.
          </div>

          {verifyToken && (
            <>
              <Text fontSize={"2xl"}>Enter Amounts:</Text>
              <Text fontSize={"lg"}>
                Available Balance:{" "}
                {balance
                  ? parseFloat(
                      parseFloat(utils.formatEther(balance)).toFixed(4)
                    )
                  : "Loading..."}
              </Text>
              <Button
                onClick={async () => {
                  setRefreshTokenLoad(true);
                  await handleSubmit();
                  setRefreshTokenLoad(false);
                }}
                ml={2}
                disabled={refreshTokenLoad}
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
                Refresh{refreshTokenLoad ? "ing" : ""} Balance
              </Button>
              <Input
                value={formData.rangeRawText}
                onChange={(e) => handleChange("rangeRawText", e.target.value)}
                placeholder="Enter a range for amounts ex: 1-5,5-25 or individually 2,3,5"
                size="lg"
              />
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
                onChange={(e) => setIsOneAmount(e.target.checked)}
                isChecked={isOneAmount}
              >
                Send same value to all addresses(If selected, please enter only
                one value above)
              </Checkbox>

              <Input
                value={formData.rawSelectedAddresses}
                onChange={(e) =>
                  handleChange("rawSelectedAddresses", e.target.value)
                }
                placeholder="Enter Addresses comma separated"
                size="lg"
              />
              {!isOneAmount && (
                <div>
                  {formData.selectedAddresses?.length ===
                  formData.selectedTokens.length
                    ? "Looks Good!"
                    : formData.selectedAddresses?.length >
                      formData.selectedTokens.length
                    ? `You have exceeded by ${
                        formData.selectedAddresses?.length -
                        formData.selectedTokens.length
                      } address${
                        formData.selectedAddresses?.length -
                          formData.selectedTokens.length ===
                        1
                          ? ""
                          : "es"
                      }`
                    : `You need atleast ${
                        formData.selectedTokens.length -
                        formData.selectedAddresses?.length
                      } more address${
                        formData.selectedTokens.length -
                          formData.selectedAddresses?.length ===
                        1
                          ? ""
                          : "es"
                      }`}
                </div>
              )}

              <TableNormal
                tokenIds={formData.selectedTokens}
                addresses={formData.selectedAddresses}
                isOneAmount={isOneAmount}
                ishrc20
              />

              {!isOneAmount &&
                formData.selectedAddresses?.length ===
                  formData.selectedTokens.length &&
                formData.selectedAddresses.length > 0 && (
                  <span>
                    <Button
                      // onClick={handleSend}
                      onClick={on20Open}
                      disabled={
                        formData.selectedAddresses?.length !==
                          formData.selectedTokens.length ||
                        formData.selectedAddresses?.length === 0
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
                      Summary
                    </Button>
                    <Modal
                      closeOnOverlayClick={false}
                      isOpen={is20Open}
                      onClose={on20Close}
                    >
                      <ModalOverlay />
                      <ModalContent>
                        <ModalHeader>Summary</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                          <VStack spacing={10} mb={10}>
                            <HStack
                              spacing={10}
                              justifyContent={"space-between"}
                            >
                              <Flex flexDirection={"column"}>
                                <Text fontSize={30}>
                                  {formData.selectedAddresses.length}
                                </Text>
                                <Text
                                  color={"gray.400"}
                                  fontSize={12}
                                  textAlign={"left"}
                                  maxW={"13vw"}
                                >
                                  Total Number of Addresses
                                </Text>
                              </Flex>
                              <Flex textAlign="right" flexDirection={"column"}>
                                <Text fontSize={30}>
                                  {parseFloat(
                                    parseFloat(
                                      formData.totalSelectedTokens
                                    ).toFixed(4)
                                  )}{" "}
                                </Text>
                                <Text
                                  color={"gray.400"}
                                  maxW={"13vw"}
                                  fontSize={12}
                                  textAlign={"left"}
                                >
                                  Total number of Tokens to be Sent
                                </Text>
                              </Flex>
                            </HStack>
                            <HStack
                              spacing={10}
                              justifyContent={"space-between"}
                            >
                              <Flex flexDirection={"column"}>
                                <Text fontSize={26}>2</Text>
                                <Text
                                  color={"gray.400"}
                                  maxW={"10vw"}
                                  fontSize={12}
                                  textAlign={"left"}
                                >
                                  Total Number of Transactions Needed
                                </Text>
                              </Flex>
                              <Flex textAlign="right" flexDirection={"column"}>
                                <Text fontSize={26}>
                                  {selectedNetwork?.cost} + gas
                                </Text>
                                <Text
                                  color={"gray.400"}
                                  maxW={"13vw"}
                                  fontSize={12}
                                  textAlign={"left"}
                                >
                                  Approximate Cost of Operations
                                </Text>
                              </Flex>
                            </HStack>
                            <Text color={"yellow.400"}>
                              *We charge a convenience fee of{" "}
                              {selectedNetwork?.cost}
                            </Text>
                          </VStack>
                        </ModalBody>

                        <ModalFooter justifyContent={"center"}>
                          <Button
                            mb={5}
                            onClick={handleSend}
                            disabled={
                              formData.selectedAddresses?.length !==
                                formData.selectedTokens.length ||
                              formData.selectedAddresses?.length === 0
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

              {isOneAmount && formData.rangeRawText && (
                <span>
                  <Button
                    onClick={on20Open}
                    disabled={isNaN(formData?.rangeRawText)}
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
                    Summary
                  </Button>
                  <Modal
                    closeOnOverlayClick={false}
                    isOpen={is20Open}
                    onClose={on20Close}
                  >
                    <ModalOverlay />
                    <ModalContent>
                      <ModalHeader>Summary</ModalHeader>
                      <ModalCloseButton />
                      <ModalBody>
                        <VStack spacing={10} mb={5}>
                          <HStack spacing={10}>
                            <Flex flexDirection={"column"}>
                              <Text fontSize={30}>
                                {formData.selectedAddresses.length}
                              </Text>
                              <Text
                                color={"gray.400"}
                                fontSize={12}
                                textAlign={"left"}
                                maxW={"13vw"}
                              >
                                Total Number of Addresses
                              </Text>
                            </Flex>
                            <Flex textAlign="right" flexDirection={"column"}>
                              <Text fontSize={30}>
                                {formData.totalSelectedTokens *
                                  formData.selectedAddresses.length}
                              </Text>
                              <Text
                                color={"gray.400"}
                                maxW={"13vw"}
                                fontSize={12}
                                textAlign={"left"}
                              >
                                Total number of Tokens to be Sent
                              </Text>
                            </Flex>
                          </HStack>
                          <HStack spacing={10} justifyContent={"space-between"}>
                            <Flex flexDirection={"column"}>
                              <Text fontSize={26}>2</Text>
                              <Text
                                color={"gray.400"}
                                maxW={"10vw"}
                                fontSize={12}
                                textAlign={"left"}
                              >
                                Total Number of Transactions Needed
                              </Text>
                            </Flex>
                            <Flex textAlign="right" flexDirection={"column"}>
                              <Text fontSize={26}>
                                {selectedNetwork?.cost} + gas
                              </Text>
                              <Text
                                color={"gray.400"}
                                maxW={"13vw"}
                                fontSize={12}
                                textAlign={"right"}
                              >
                                Approximate Cost of Operations
                              </Text>
                            </Flex>
                          </HStack>
                          <Text color={"yellow.400"}>
                            *We charge a convenience fee of{" "}
                            {selectedNetwork?.cost}
                          </Text>
                        </VStack>
                      </ModalBody>

                      <ModalFooter justifyContent={"center"}>
                        <Button
                          mb={5}
                          onClick={handleSend}
                          disabled={isNaN(formData?.rangeRawText)}
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
          {successful && (
            <>
              <Text fontSize={"4xl"}>Transaction Successful</Text>
              <Link to="/donate">
                <Button bg={"pink.400"} color={"white"} rounded={"full"} px={6}>
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
export default Tokens;
