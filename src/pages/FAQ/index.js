import {
    Box,
    Container,
    Heading,
    SimpleGrid,
    Icon,
    Text,
    Stack,
    HStack,
    VStack,
    Center,
} from '@chakra-ui/react';
import { CheckIcon } from '@chakra-ui/icons';

// Replace test data with your own
const features = [
    { id: 1, title: "Is this project only for airdrop and giveaways ?", text: " No, while it is primarily advertised for those use cases, it can be used for all form of bulk transfers." },
    { id: 2, title: "Do I need to own all the tokens I transfer ?", text: " Yes, currently we only support transfer of tokens owned by the user." },
    { id: 3, title: "Can I airdrop HRC1155 and HRC20 as well ?", text: "Yes, though we do not have complete support for it yet on our website we are actively working on it." },
    { id: 3, title: "I need a feature but it's not currently available, anywhere I can suggest new features?", text: "For sure, email us : teamvikingstech@gmail.com" },
]

export default function FAQ() {
    return (
        <Box my={16} p={4}>
            <Stack spacing={4} as={Container} maxW={'3xl'} textAlign={'center'}>
                <Heading fontSize={'3xl'}>FAQ</Heading>
                <Text color={'gray.600'} fontSize={'xl'}>
                    Frequently Asked Questions
                </Text>
            </Stack>

            <Center textAlign={'center'} mt={10}>
                <SimpleGrid columns={{ base: 1, md: 1, lg: 1 }} spacing={10}>
                    {features.map((feature) => (
                        <HStack key={feature.id} align={'top'}>
                            <Box color={'green.400'} px={2}>
                                <Icon as={CheckIcon} />
                            </Box>
                            <VStack align={'start'}>
                                <Text fontWeight={600}>{feature.title}</Text>
                                <Text color={'gray.600'}>{feature.text}</Text>
                            </VStack>
                        </HStack>
                    ))}
                </SimpleGrid>
            </Center>
        </Box>
    );
}