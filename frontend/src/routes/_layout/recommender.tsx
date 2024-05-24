import { Box, Container, Text } from "@chakra-ui/react"
import { createFileRoute } from "@tanstack/react-router"
import { useQueryClient } from "@tanstack/react-query"

import type { UserOut } from "../../client"

export const Route = createFileRoute("/_layout/recommender")({
  component: Dashboard,
})

function Dashboard() {
  const queryClient = useQueryClient()

  const currentUser = queryClient.getQueryData<UserOut>(["currentUser"])

  return (
    <>
      <Container maxW="full">
        <Box pt={12} m={4}>
          <Text fontSize="2xl">
            Welcome to the recommendation system main page!
          </Text>
        </Box>
      </Container>
    </>
  )
}
