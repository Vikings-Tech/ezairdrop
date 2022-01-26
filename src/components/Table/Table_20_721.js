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

function TableNormal({ addresses, tokenIds, isOneAddress }) {
    let addressNum = addresses.length;
    let tokenNum = tokenIds.length;

    let maxNum = addressNum > tokenNum ? addressNum : tokenNum;

    let finalTable = [];

    for (let i = 0; i < maxNum; i++) {
        finalTable[i] = {
            address: addresses[i],
            tokenId: tokenIds[i],
        };
    }

    if (isOneAddress) {
        finalTable.map((tableRow) => {
            tableRow.address = addresses[0];
        });
    }

    // if (isOneAmountValue) {
    //     finalTable.map((tableRow) => {
    //         tableRow.amount = amounts[0];
    //     });
    // }

    return (
        <Center>
            <Table variant="striped" w={"60vw"} mb={10}>
                <Thead>
                    <Tr>
                        <Th w={"40%"}>Addresses</Th>
                        <Th isNumeric pl={0}>
                            Token Ids
                        </Th>
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
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        </Center>
    );
}

export default TableNormal;
