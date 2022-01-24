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
    Editable,
    EditableInput,
    EditablePreview,
} from "@chakra-ui/react";

function TableElement({ addresses, tokenIds, amounts }) {
    let addressNum = addresses.length;
    let tokenNum = tokenIds.length;
    let amountNum = amounts.length;

    let maxNum =
        addressNum > tokenNum && addressNum > amountNum
            ? addressNum
            : tokenNum > amountNum
            ? tokenNum
            : amountNum;

    let finalTable = [];

    for (let i = 0; i < maxNum; i++) {
        finalTable[i] = {
            address: addresses[i] || "-",
            tokenId: tokenIds[i] || 0,
            amount: amounts[i] || 0,
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
                    {finalTable.map((row) => (
                        <Tr>
                            <Td>
                                <Editable
                                    defaultValue={row.address}
                                    placeholder="Address empty"
                                >
                                    <EditablePreview />
                                    <EditableInput />
                                </Editable>
                            </Td>
                            <Td isNumeric>
                                <Editable
                                    defaultValue={row.tokenId}
                                    placeholder="Token ID empty"
                                >
                                    <EditablePreview />
                                    <EditableInput />
                                </Editable>
                            </Td>
                            <Td isNumeric>
                                <Editable
                                    defaultValue={row.amount}
                                    placeholder="Amount empty"
                                >
                                    <EditablePreview />
                                    <EditableInput />
                                </Editable>
                            </Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        </Center>
    );
}

export default TableElement;
