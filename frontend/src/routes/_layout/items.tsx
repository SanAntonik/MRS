import {
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
} from "@chakra-ui/react"
import { createFileRoute } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"

import { ItemsService } from "../../client"
import ActionsMenu from "../../components/Common/ActionsMenu"
import Navbar from "../../components/Common/Navbar"
import useCustomToast from "../../hooks/useCustomToast"

export const Route = createFileRoute("/_layout/items")({
  component: Items,
})

function Items() {
  const showToast = useCustomToast()
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
              Movies Management
            </Heading>
            <Navbar type={"Item"} />
            <TableContainer>
              <Table size={{ base: "sm", md: "md" }}>
                <Thead>
                  <Tr>
                    <Th>ID</Th>
                    <Th>Title</Th>
                    {/* <Th>Franchise</Th> */}
                    <Th>Year</Th>
                    {/* <Th>Runtime</Th> */}
                    <Th>Genres</Th>
                    {/* <Th>Budget</Th>
                    <Th>Revenue</Th> */}
                    {/* <Th>Popularity</Th> */}
                    <Th>Vote Avg</Th>
                    <Th>Vote Count</Th>
                    <Th>Director</Th>
                    <Th>Top Actors</Th>
                    {/* <Th>Keywords</Th> */}
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {items.data.map((item) => (
                    <Tr key={item.id}>
                      <Td>{item.id}</Td>
                      <Td>{item.title.length > 20 ? `${item.title.substring(0, 20)}...` : item.title}</Td>
                      {/* <Td color={!item.franchise ? "ui.dim" : "inherit"}>
                        {item.franchise ? (item.franchise.length > 20 ? `${item.franchise.substring(0, 20)}...` : item.franchise) : "N/A"}
                      </Td> */}
                      <Td color={!item.release_year ? "ui.dim" : "inherit"}>
                        {item.release_year || "N/A"}
                      </Td>
                      {/* <Td color={!item.runtime ? "ui.dim" : "inherit"}>
                        {item.runtime || "N/A"}
                      </Td> */}
                      <Td color={!item.genres ? "ui.dim" : "inherit"}>
                        {item.genres ? (item.genres.length > 20 ? `${item.genres.substring(0, 20)}...` : item.genres) : "N/A"}
                      </Td>
                      {/* <Td color={!item.budget ? "ui.dim" : "inherit"}>
                        {item.budget || "N/A"}
                      </Td>
                      <Td color={!item.revenue ? "ui.dim" : "inherit"}>
                        {item.revenue || "N/A"}
                      </Td> */}
                      {/* <Td color={!item.popularity ? "ui.dim" : "inherit"}>
                        {item.popularity || "N/A"}
                      </Td> */}
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
                      {/* <Td color={!item.keywords ? "ui.dim" : "inherit"}>
                        {item.keywords ? (item.keywords.length > 20 ? `${item.keywords.substring(0, 20)}...` : item.keywords) : "N/A"}
                      </Td> */}
                      <Td>
                        <ActionsMenu type={"Item"} value={item} />
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </Container>
        )
      )}
    </>
  )
}
