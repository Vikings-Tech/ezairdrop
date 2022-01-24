import React from "react";
import {
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    Center,
} from "@chakra-ui/react";

function TableElement({ addresses, tokenIds, amounts }) {
    const addresses1 = [
        "0x0B3145BEa727Ea940EfCFa53B77331b0Eb664648",
        "0x0B3145BEa727Ea940EfCFa53B77331b0Eb664648",
        "0x0B3145BEa727Ea940EfCFa53B77331b0Eb664648",
        "0x0B3145BEa727Ea940EfCFa53B77331b0Eb664648",
    ];
    const tokenIds1 = [69, 69, 69];
    const amounts1 = [69, 69];

    let addressNum = addresses1.length;
    let tokenNum = tokenIds1.length;
    let amountNum = amounts1.length;

    let maxNum =
        addressNum > tokenNum && addressNum > amountNum
            ? addressNum
            : tokenNum > amountNum
            ? tokenNum
            : amountNum;

    let finalTable = [];

    for (let i = 0; i < maxNum; i++) {
        finalTable[i] = {
            address: addresses1[i],
            tokenId: tokenIds1[i],
            amount: amounts1[i],
        };
    }

    return (
        <Center>
            <Table variant="striped" w={"80vw"}>
                <Thead>
                    <Tr>
                        <Th w={"40%"}>Addresses</Th>
                        <Th isNumeric pl={0}>
                            Token Ids
                        </Th>
                        <Th isNumeric>Amounts</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {finalTable &&
                        finalTable.map((row) => (
                            <Tr>
                                <Td>{row.address}</Td>
                                <Td isNumeric pl={0}>
                                    {row.tokenId}
                                </Td>
                                <Td isNumeric>{row.amount}</Td>
                            </Tr>
                        ))}
                </Tbody>
            </Table>
        </Center>
    );
}

export default TableElement;
