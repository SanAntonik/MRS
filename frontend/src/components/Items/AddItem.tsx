import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react"
import { type SubmitHandler, useForm } from "react-hook-form"
import { useMutation, useQueryClient } from "@tanstack/react-query"

import { type ApiError, type ItemCreate, ItemsService } from "../../client"
import useCustomToast from "../../hooks/useCustomToast"

interface AddItemProps {
  isOpen: boolean
  onClose: () => void
}

const AddItem = ({ isOpen, onClose }: AddItemProps) => {
  const queryClient = useQueryClient()
  const showToast = useCustomToast()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ItemCreate>({
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: {
      title: "",
      franchise: "",
      release_year: "",
      genres: "",
      vote_average: 0,
      vote_count: 0,
      director: "",
      top_actors: "",
      keywords: "",
    },
  })

  const mutation = useMutation({
    mutationFn: (data: ItemCreate) =>
      ItemsService.createItem({ requestBody: data }),
    onSuccess: () => {
      showToast("Success!", "Item created successfully.", "success")
      reset()
      onClose()
    },
    onError: (err: ApiError) => {
      const errDetail = (err.body as any)?.detail
      showToast("Something went wrong.", `${errDetail}`, "error")
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] })
    },
  })

  const onSubmit: SubmitHandler<ItemCreate> = (data) => {
    mutation.mutate(data)
  }

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size={{ base: "sm", md: "md" }}
        isCentered
      >
        <ModalOverlay />
        <ModalContent as="form" onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>Add Item</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={4}>
            <FormControl isRequired isInvalid={!!errors.title}>
              <FormLabel htmlFor="title">Title</FormLabel>
              <Input
                id="title"
                {...register("title", {
                  required: "Title is required.",
                })}
                placeholder="Title"
                type="text"
              />
              {errors.title && (
                <FormErrorMessage>{errors.title.message}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl mt={3} isInvalid={!!errors.franchise}>
              <FormLabel htmlFor="franchise">Franchise</FormLabel>
              <Input
                id="franchise"
                {...register("franchise")}
                placeholder="Franchise"
                type="text"
              />
            </FormControl>
            <FormControl mt={3} isRequired isInvalid={!!errors.release_year}>
              <FormLabel htmlFor="release_year">Release Year</FormLabel>
              <Input
                id="release_year"
                {...register("release_year")}
                placeholder="Release Year"
                type="text"
              />
            </FormControl>
            <FormControl mt={3} isInvalid={!!errors.genres}>
              <FormLabel htmlFor="genres">Genres</FormLabel>
              <Input
                id="genres"
                {...register("genres")}
                placeholder="Genres"
                type="text"
              />
            </FormControl>
            <FormControl mt={3} isRequired isInvalid={!!errors.vote_average}>
              <FormLabel htmlFor="vote_average">Vote Average</FormLabel>
              <Input
                id="vote_average"
                {...register("vote_average", {
                  valueAsNumber: true,
                })}
                placeholder="Vote Average"
                type="number"
                step="0.1"
              />
            </FormControl>
            <FormControl mt={3} isRequired isInvalid={!!errors.vote_count}>
              <FormLabel htmlFor="vote_count">Vote Count</FormLabel>
              <Input
                id="vote_count"
                {...register("vote_count", {
                  valueAsNumber: true,
                })}
                placeholder="Vote Count"
                type="number"
              />
            </FormControl>
            <FormControl mt={3} isInvalid={!!errors.director}>
              <FormLabel htmlFor="director">Director</FormLabel>
              <Input
                id="director"
                {...register("director")}
                placeholder="Director"
                type="text"
              />
            </FormControl>
            <FormControl mt={3} isInvalid={!!errors.top_actors}>
              <FormLabel htmlFor="top_actors">Top Actors</FormLabel>
              <Input
                id="top_actors"
                {...register("top_actors")}
                placeholder="Top 3 Actors"
                type="text"
              />
            </FormControl>
            <FormControl mt={3} isInvalid={!!errors.keywords}>
              <FormLabel htmlFor="keywords">Keywords</FormLabel>
              <Input
                id="keywords"
                {...register("keywords")}
                placeholder="Top 5 Keywords you associate with the movie"
                type="text"
              />
            </FormControl>
          </ModalBody>

          <ModalFooter gap={2}>
            <Button variant="primary" type="submit" isLoading={isSubmitting}>
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default AddItem
