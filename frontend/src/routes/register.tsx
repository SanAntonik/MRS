import {
  Button,
  Container,
  Center,
  FormControl,
  FormErrorMessage,
  Heading,
  Input,
  Text,
  Link
} from "@chakra-ui/react"
import { createFileRoute, redirect, Link as RouterLink } from "@tanstack/react-router"
import { type SubmitHandler, useForm } from "react-hook-form"

import { UsersService } from "../client"
import { isLoggedIn } from "../hooks/useAuth"
import useCustomToast from "../hooks/useCustomToast"
import { emailPattern } from "../utils"

interface FormData {
  email: string
  password: string
}

export const Route = createFileRoute("/register")({
  component: Register,
  beforeLoad: async () => {
    if (isLoggedIn()) {
      throw redirect({
        to: "/",
      })
    }
  },
})

function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>()
  const showToast = useCustomToast()

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      await UsersService.registerUser({
        requestBody: {
          email: data.email,
          password: data.password,
        },
      })
      showToast(
        "Account created.",
        "Your account has been successfully created. Please log in.",
        "success",
      )
      window.location.href = "/login" // Redirect to login page after registration
    } catch (error) {
      showToast("Error", "Failed to create account. Please try again.", "error")
    }
  }

  return (
    <Container
      as="form"
      onSubmit={handleSubmit(onSubmit)}
      h="100vh"
      maxW="sm"
      alignItems="stretch"
      justifyContent="center"
      gap={4}
      centerContent
    >
      <Heading size="xl" color="ui.main" textAlign="center" mb={2}>
        Create New Account
      </Heading>
      <Text align="center">
        Please fill in the form below to create a new account.
      </Text>
      <FormControl isInvalid={!!errors.email}>
        <Input
          id="email"
          {...register("email", {
            required: "Email is required",
            pattern: emailPattern,
          })}
          placeholder="Email"
          type="email"
        />
        {errors.email && (
          <FormErrorMessage>{errors.email.message}</FormErrorMessage>
        )}
      </FormControl>
      <FormControl isInvalid={!!errors.password}>
        <Input
          id="password"
          {...register("password", {
            required: "Password is required",
            minLength: { value: 4, message: "Password must be at least 4 characters" },
          })}
          placeholder="Password"
          type="password"
        />
        {errors.password && (
          <FormErrorMessage>{errors.password.message}</FormErrorMessage>
        )}
      </FormControl>
      <Center>
        <Link as={RouterLink} to="/login" color="blue.500">
          Back to log in page
        </Link>
      </Center>
      <Button variant="primary" type="submit" isLoading={isSubmitting}>
        Create
      </Button>
    </Container>
  )
}
