import {
    Box,
    Button,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Input,
    Text,
    Container,
    Flex,
    Heading,
    Spinner,
    Table,
    TableContainer,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
    useColorModeValue,
} from "@chakra-ui/react"
import { createFileRoute } from "@tanstack/react-router"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import type { UserOut } from "../../client"
import React, { useState } from 'react'

import { ItemsService } from "../../client"
import ActionsMenu from "../../components/Common/ActionsMenu"
import Navbar from "../../components/Common/Navbar"
import useCustomToast from "../../hooks/useCustomToast"


export const Route = createFileRoute("/_layout/recommender")({
    component: Recommender,
})

function Recommender() {
    const showToast = useCustomToast()
    const [searchTitle, setSearchTitle] = useState("")
    const [selectedItem, setSelectedItem] = useState(null)

    const {
        data: items,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["items"],
        queryFn: () => ItemsService.readItems({}),
    })

    if (isError) {
        const errDetail = (error as any).body?.detail
        showToast("Something went wrong.", `${errDetail}`, "error")
    }

    const handleSearch = async () => {
        try {
          const item = await ItemsService.readItemByTitle({ input_title: searchTitle })
          setSelectedItem(item)
        } catch (error) {
          const errDetail = (error as any).body?.detail
          showToast("Something went wrong.", `${errDetail}`, "error")
        }
      }

      return (
    <>
        {isLoading ? (
        <Flex justify="center" align="center" height="100vh" width="full">
            <Spinner size="xl" color="ui.main" />
        </Flex>
        ) : (
        items && (
            <Container maxW="full">
            <Heading
                size="lg"
                textAlign={{ base: "center", md: "left" }}
                pt={12}
            >
                Movie Recommender
            </Heading>
            {/* <Navbar type={"Item"} /> */}
            <Flex my={8}>
                <Input
                placeholder="Search by Title"
                value={searchTitle}
                onChange={(e) => setSearchTitle(e.target.value)}
                mr={2}
                width='auto'
                />
                <Button variant="primary" onClick={handleSearch}>Search</Button>
            </Flex>
            {selectedItem && (
                <>
                <Text my={4}>
                    For the typed in input title, the closest match is "{selectedItem.title}":
                </Text>
                <TableContainer>
                    <Table size={{ base: "sm", md: "md" }}>
                    <Thead>
                        <Tr>
                        {/* <Th>ID</Th> */}
                        <Th>Title</Th>
                        <Th>Franchise</Th>
                        <Th>Year</Th>
                        <Th>Genres</Th>
                        <Th>Vote Avg</Th>
                        <Th>Vote Count</Th>
                        <Th>Director</Th>
                        <Th>Top Actors</Th>
                        <Th>Actions</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        <Tr key={selectedItem.id}>
                        {/* <Td>{selectedItem.id}</Td> */}
                        <Td>{selectedItem.title.length > 25 ? `${selectedItem.title.substring(0, 25)}...` : selectedItem.title}</Td>
                        <Td color={!selectedItem.franchise ? "ui.dim" : "inherit"}>
                            {selectedItem.franchise ? (selectedItem.franchise.length > 20 ? `${selectedItem.franchise.substring(0, 20)}...` : selectedItem.franchise) : "N/A"}
                        </Td>
                        <Td color={!selectedItem.release_year ? "ui.dim" : "inherit"}>
                            {selectedItem.release_year || "N/A"}
                        </Td>
                        <Td color={!selectedItem.genres ? "ui.dim" : "inherit"}>
                            {selectedItem.genres ? (selectedItem.genres.length > 20 ? `${selectedItem.genres.substring(0, 20)}...` : selectedItem.genres) : "N/A"}
                        </Td>
                        <Td color={!selectedItem.vote_average ? "ui.dim" : "inherit"}>
                            {selectedItem.vote_average || "N/A"}
                        </Td>
                        <Td color={!selectedItem.vote_count ? "ui.dim" : "inherit"}>
                            {selectedItem.vote_count || "N/A"}
                        </Td>
                        <Td color={!selectedItem.director ? "ui.dim" : "inherit"}>
                            {selectedItem.director || "N/A"}
                        </Td>
                        <Td color={!selectedItem.top_actors ? "ui.dim" : "inherit"}>
                            {selectedItem.top_actors ? (selectedItem.top_actors.length > 40 ? `${selectedItem.top_actors.substring(0, 40)}...` : selectedItem.top_actors) : "N/A"}
                        </Td>
                        <Td>
                            <ActionsMenu type={"Item"} value={selectedItem} />
                        </Td>
                        </Tr>
                    </Tbody>
                    </Table>
                </TableContainer>
                </>
            )}
            </Container>
        )
        )}
    </>
    )
}
