import {
    Button,
    Input,
    Text,
    Container,
    Flex,
    Heading,
    Table,
    TableContainer,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
} from "@chakra-ui/react"
import { createFileRoute } from "@tanstack/react-router"
import { useState } from 'react'

import { ItemsService } from "../../client"
import ActionsMenu from "../../components/Common/ActionsMenu"
import useCustomToast from "../../hooks/useCustomToast"


export const Route = createFileRoute("/_layout/recommender")({
    component: Recommender,
})

function Recommender() {
    const showToast = useCustomToast()
    const [searchTitle, setSearchTitle] = useState("")
    const [selectedItem, setSelectedItem] = useState(null)
    const [recommendedItems, setRecommendedItems] = useState([])

    const handleSearch = async () => {
        try {
            const item = await ItemsService.readItemByTitle({ input_title: searchTitle })
            setSelectedItem(item)
            const recommended = await ItemsService.recommender({ input_title: searchTitle })
            setRecommendedItems(recommended.data)
        } catch (error) {
            const errDetail = (error as any).body?.detail
            showToast("Something went wrong.", `${errDetail}`, "error")
        }
    }

    return (
        <Container maxW="full">
            <Heading
                size="lg"
                textAlign={{ base: "center", md: "left" }}
                pt={12}
            >
                Movie Recommender
            </Heading>
            <Flex my={8}>
                <Input
                    placeholder="Enter Movie Title"
                    value={searchTitle}
                    onChange={(e) => setSearchTitle(e.target.value)}
                    mr={2}
                    width='auto'
                />
                <Button variant="primary" onClick={handleSearch}>Recommend</Button>
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
                    <Text my={6}>
                        Here are recommended movies based on the movie title you entered:
                    </Text>
                    <TableContainer>
                        <Table size={{ base: "sm", md: "md" }}>
                            <Thead>
                                <Tr>
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
                                {recommendedItems.map(item => (
                                    <Tr key={item.id}>
                                        <Td>{item.title.length > 25 ? `${item.title.substring(0, 25)}...` : item.title}</Td>
                                        <Td color={!item.franchise ? "ui.dim" : "inherit"}>
                                            {item.franchise ? (item.franchise.length > 20 ? `${item.franchise.substring(0, 20)}...` : item.franchise) : "N/A"}
                                        </Td>
                                        <Td color={!item.release_year ? "ui.dim" : "inherit"}>
                                            {item.release_year || "N/A"}
                                        </Td>
                                        <Td color={!item.genres ? "ui.dim" : "inherit"}>
                                            {item.genres ? (item.genres.length > 20 ? `${item.genres.substring(0, 20)}...` : item.genres) : "N/A"}
                                        </Td>
                                        <Td color={!item.vote_average ? "ui.dim" : "inherit"}>
                                            {item.vote_average || "N/A"}
                                        </Td>
                                        <Td color={!item.vote_count ? "ui.dim" : "inherit"}>
                                            {item.vote_count || "N/A"}
                                        </Td>
                                        <Td color={!item.director ? "ui.dim" : "inherit"}>
                                            {item.director || "N/A"}
                                        </Td>
                                        <Td color={!item.top_actors ? "ui.dim" : "inherit"}>
                                            {item.top_actors ? (item.top_actors.length > 40 ? `${item.top_actors.substring(0, 40)}...` : item.top_actors) : "N/A"}
                                        </Td>
                                        <Td>
                                            <ActionsMenu type={"Item"} value={item} />
                                        </Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    </TableContainer>
                </>
            )}
        </Container>
    )
}


//       return (
//     <>
//         {isLoading ? (
//         <Flex justify="center" align="center" height="100vh" width="full">
//             <Spinner size="xl" color="ui.main" />
//         </Flex>
//         ) : (
//         items && (
//             <Container maxW="full">
//             <Heading
//                 size="lg"
//                 textAlign={{ base: "center", md: "left" }}
//                 pt={12}
//             >
//                 Movie Recommender
//             </Heading>
//             <Flex my={8}>
//                 <Input
//                 placeholder="Search by Title"
//                 value={searchTitle}
//                 onChange={(e) => setSearchTitle(e.target.value)}
//                 mr={2}
//                 width='auto'
//                 />
//                 <Button variant="primary" onClick={handleSearch}>Search</Button>
//             </Flex>
//             {selectedItem && (
//                 <>
//                 <Text my={4}>
//                     For the typed in input title, the closest match is "{selectedItem.title}":
//                 </Text>
//                 <TableContainer>
//                     <Table size={{ base: "sm", md: "md" }}>
//                     <Thead>
//                         <Tr>
//                         {/* <Th>ID</Th> */}
//                         <Th>Title</Th>
//                         <Th>Franchise</Th>
//                         <Th>Year</Th>
//                         <Th>Genres</Th>
//                         <Th>Vote Avg</Th>
//                         <Th>Vote Count</Th>
//                         <Th>Director</Th>
//                         <Th>Top Actors</Th>
//                         <Th>Actions</Th>
//                         </Tr>
//                     </Thead>
//                     <Tbody>
//                         <Tr key={selectedItem.id}>
//                         {/* <Td>{selectedItem.id}</Td> */}
//                         <Td>{selectedItem.title.length > 25 ? `${selectedItem.title.substring(0, 25)}...` : selectedItem.title}</Td>
//                         <Td color={!selectedItem.franchise ? "ui.dim" : "inherit"}>
//                             {selectedItem.franchise ? (selectedItem.franchise.length > 20 ? `${selectedItem.franchise.substring(0, 20)}...` : selectedItem.franchise) : "N/A"}
//                         </Td>
//                         <Td color={!selectedItem.release_year ? "ui.dim" : "inherit"}>
//                             {selectedItem.release_year || "N/A"}
//                         </Td>
//                         <Td color={!selectedItem.genres ? "ui.dim" : "inherit"}>
//                             {selectedItem.genres ? (selectedItem.genres.length > 20 ? `${selectedItem.genres.substring(0, 20)}...` : selectedItem.genres) : "N/A"}
//                         </Td>
//                         <Td color={!selectedItem.vote_average ? "ui.dim" : "inherit"}>
//                             {selectedItem.vote_average || "N/A"}
//                         </Td>
//                         <Td color={!selectedItem.vote_count ? "ui.dim" : "inherit"}>
//                             {selectedItem.vote_count || "N/A"}
//                         </Td>
//                         <Td color={!selectedItem.director ? "ui.dim" : "inherit"}>
//                             {selectedItem.director || "N/A"}
//                         </Td>
//                         <Td color={!selectedItem.top_actors ? "ui.dim" : "inherit"}>
//                             {selectedItem.top_actors ? (selectedItem.top_actors.length > 40 ? `${selectedItem.top_actors.substring(0, 40)}...` : selectedItem.top_actors) : "N/A"}
//                         </Td>
//                         <Td>
//                             <ActionsMenu type={"Item"} value={selectedItem} />
//                         </Td>
//                         </Tr>
//                     </Tbody>
//                     </Table>
//                 </TableContainer>
//                 </>
//             )}
//             </Container>
//         )
//         )}
//     </>
//     )
// }
