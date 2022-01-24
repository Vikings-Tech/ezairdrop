import React from "react";
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
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
            address: addresses[i],
            tokenId: tokenIds[i],
            amount: amounts[i],
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
                            {/*<Td>
                                <Editable defaultValue={row.address}>
                                    <EditablePreview />
                                    <EditableInput />
                                </Editable>
                            </Td>
                            <Td isNumeric>
                                <Editable defaultValue={row.tokenId}>
                                    <EditablePreview />
                                    <EditableInput />
                                </Editable>
                            </Td>
                            <Td isNumeric>
                                <Editable defaultValue={row.amount}>
                                    <EditablePreview />
                                    <EditableInput />
                                </Editable>
                            </Td>*/}
                            <Td>{row.address}</Td>
                            <Td isNumeric>{row.tokenId}</Td>
                            <Td isNumeric>{row.amount}</Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        </Center>
    );
}

export default TableElement;
