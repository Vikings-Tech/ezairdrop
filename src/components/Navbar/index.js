import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Stack,
  Collapse,
  Icon,
  Link,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useColorModeValue,
  useBreakpointValue,
  useDisclosure,
  Switch,
  FormControl,
  FormLabel,
  Select,
} from "@chakra-ui/react";
import {
  HamburgerIcon,
  CloseIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from "@chakra-ui/icons";
import { ColorModeSwitcher } from "../ColorModeSwitcher";
import { useContext } from "react";
import Web3Context from "../../contexts/Web3Context";
import { FaParachuteBox } from "react-icons/fa";
import { Link as LinkTo } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Navbar() {
  const { onClickMetamask, account, switchNetwork, selectedNetwork } =
    useContext(Web3Context);
  const { isOpen, onToggle } = useDisclosure();
  const [selectedOption, setSelectedOption] = useState("Harmony");
  const [isMainnet, setIsMainnet] = useState(true);
  useEffect(() => {
    switchNetwork(`${selectedOption} ${isMainnet ? "Mainnet" : "Testnet"}`);
  }, [selectedOption, isMainnet]);

  return (
    <Box>
      <Flex
        bg={useColorModeValue("white", "gray.800")}
        color={useColorModeValue("gray.600", "white")}
        minH={"60px"}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={"solid"}
        borderColor={useColorModeValue("gray.200", "gray.900")}
        align={"center"}
      >
        <Flex
          flex={{ base: 1, md: "auto" }}
          ml={{ base: -2 }}
          display={{ base: "flex", md: "none" }}
        >
          <IconButton
            onClick={onToggle}
            icon={
              isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
            }
            variant={"ghost"}
            aria-label={"Toggle Navigation"}
          />
        </Flex>
        <Flex
          flex={{ base: 1 }}
          align={{ base: "center" }}
          justify={{ base: "center", md: "start" }}
        >
          <FaParachuteBox size={"1.75em"} />
          <Text
            fontWeight={700}
            fontSize={"md"}
            marginLeft={2}
            textAlign={useBreakpointValue({ base: "center", md: "left" })}
            fontFamily={"heading"}
            color={useColorModeValue("gray.800", "white")}
          >
            Ez Drops
          </Text>

          <Flex display={{ base: "none", md: "flex" }} ml={10}>
            <DesktopNav />
          </Flex>
        </Flex>

        <Stack
          flex={{ base: 1, md: 0 }}
          justify={"flex-end"}
          alignItems={"center"}
          direction={"row"}
          spacing={6}
        >
          <Select
            selectedOption={selectedNetwork}
            onChange={(e) => {
              setSelectedOption(e?.target?.value);
            }}
          >
            <option value={"Harmony"}>Harmony</option>
            <option value={"Polygon"}>Polygon</option>
          </Select>
          <FormControl display="flex" alignItems="center">
            <Switch
              isChecked={false}
              // onChange={() => setIsMainnet((is) => !isMainnet)}
            />
            <FormLabel marginTop={"2"} marginLeft={"4"}>
              {isMainnet ? "Mainnet" : "Testnet"}
            </FormLabel>
          </FormControl>
          <Button
            display={{ base: "none", md: "inline-flex" }}
            fontSize={"sm"}
            width={{ base: "300px" }}
            fontWeight={600}
            textAlign={"center"}
            color={"white"}
            bg={"pink.400"}
            href={"#"}
            onClick={() => onClickMetamask()}
            _hover={{
              bg: "pink.300",
            }}
          >
            {account
              ? `${account.slice(0, 4)}...${account.slice(-4)}`
              : "Connect Wallet"}
          </Button>
          <ColorModeSwitcher />
        </Stack>
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <MobileNav />
      </Collapse>
    </Box>
  );
}

const DesktopNav = () => {
  const linkColor = useColorModeValue("gray.600", "gray.200");
  const linkHoverColor = useColorModeValue("gray.800", "white");
  const popoverContentBgColor = useColorModeValue("white", "gray.800");

  return (
    <Stack direction={"row"} spacing={4}>
      {NAV_ITEMS.map((navItem) => (
        <Box key={navItem.label}>
          <Popover trigger={"hover"} placement={"bottom-start"}>
            <PopoverTrigger>
              <LinkTo to={navItem.href}>
                <Text
                  p={2}
                  fontSize={"sm"}
                  fontWeight={500}
                  color={linkColor}
                  _hover={{
                    textDecoration: "none",
                    color: linkHoverColor,
                  }}
                >
                  {navItem.label}
                </Text>
              </LinkTo>
            </PopoverTrigger>

            {navItem.children && (
              <PopoverContent
                border={0}
                boxShadow={"xl"}
                bg={popoverContentBgColor}
                p={4}
                rounded={"xl"}
                minW={"sm"}
              >
                <Stack>
                  {navItem.children.map((child) => (
                    <DesktopSubNav key={child.label} {...child} />
                  ))}
                </Stack>
              </PopoverContent>
            )}
          </Popover>
        </Box>
      ))}
    </Stack>
  );
};

const DesktopSubNav = ({ label, href, subLabel }) => {
  return (
    <Link
      href={href}
      role={"group"}
      display={"block"}
      p={2}
      rounded={"md"}
      _hover={{ bg: useColorModeValue("pink.50", "gray.900") }}
    >
      <Stack direction={"row"} align={"center"}>
        <Box>
          <Text
            transition={"all .3s ease"}
            _groupHover={{ color: "pink.400" }}
            fontWeight={500}
          >
            {label}
          </Text>
          <Text fontSize={"sm"}>{subLabel}</Text>
        </Box>
        <Flex
          transition={"all .3s ease"}
          transform={"translateX(-10px)"}
          opacity={0}
          _groupHover={{ opacity: "100%", transform: "translateX(0)" }}
          justify={"flex-end"}
          align={"center"}
          flex={1}
        >
          <Icon color={"pink.400"} w={5} h={5} as={ChevronRightIcon} />
        </Flex>
      </Stack>
    </Link>
  );
};

const MobileNav = () => {
  const { onClickMetamask, account } = useContext(Web3Context);

  return (
    <Stack
      bg={useColorModeValue("white", "gray.800")}
      p={4}
      display={{ md: "none" }}
    >
      {NAV_ITEMS.map((navItem) => (
        <MobileNavItem key={navItem.label} {...navItem} />
      ))}
      <Button
        display={{ md: "none", base: "inline-flex" }}
        fontSize={"sm"}
        fontWeight={600}
        color={"white"}
        bg={"pink.400"}
        href={"#"}
        onClick={() => onClickMetamask()}
        _hover={{
          bg: "pink.300",
        }}
      >
        {account
          ? `${account.slice(0, 8)}...${account.slice(-8)}`
          : "Connect Wallet"}
      </Button>
    </Stack>
  );
};

const MobileNavItem = ({ label, children, href }) => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Stack spacing={4} onClick={children && onToggle}>
      <Flex
        py={2}
        as={Link}
        href={href ?? "#"}
        justify={"space-between"}
        align={"center"}
        _hover={{
          textDecoration: "none",
        }}
      >
        <Text
          fontWeight={600}
          color={useColorModeValue("gray.600", "gray.200")}
        >
          {label}
        </Text>
        {children && (
          <Icon
            as={ChevronDownIcon}
            transition={"all .25s ease-in-out"}
            transform={isOpen ? "rotate(180deg)" : ""}
            w={6}
            h={6}
          />
        )}
      </Flex>

      <Collapse in={isOpen} animateOpacity style={{ marginTop: "0!important" }}>
        <Stack
          mt={2}
          pl={4}
          borderLeft={1}
          borderStyle={"solid"}
          borderColor={useColorModeValue("gray.200", "gray.700")}
          align={"start"}
        >
          {children &&
            children.map((child) => (
              <Link key={child.label} py={2} href={child.href}>
                {child.label}
              </Link>
            ))}
        </Stack>
      </Collapse>
    </Stack>
  );
};

const NAV_ITEMS = [
  // {
  //     label: 'Inspiration',
  //     children: [
  //         {
  //             label: 'Explore Design Work',
  //             subLabel: 'Trending Design to inspire you',
  //             href: '#',
  //         },
  //         {
  //             label: 'New & Noteworthy',
  //             subLabel: 'Up-and-coming Designers',
  //             href: '#',
  //         },
  //     ],
  // },
  // {
  //     label: 'Find Work',
  //     children: [
  //         {
  //             label: 'Job Board',
  //             subLabel: 'Find your dream design job',
  //             href: '#',
  //         },
  //         {
  //             label: 'Freelance Projects',
  //             subLabel: 'An exclusive list for contract work',
  //             href: '#',
  //         },
  //     ],
  // },
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Airdrop",
    href: "/airdrop",
  },
  {
    label: "FAQ",
    href: "/faq",
  },
  {
    label: "Donate",
    href: "/donate",
  },
];
