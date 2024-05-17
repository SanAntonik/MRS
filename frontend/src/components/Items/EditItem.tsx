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

import {
  type ApiError,
  type ItemOut,
  type ItemUpdate,
  ItemsService,
} from "../../client"
import useCustomToast from "../../hooks/useCustomToast"

interface EditItemProps {
  item: ItemOut
  isOpen: boolean
  onClose: () => void
}

const EditItem = ({ item, isOpen, onClose }: EditItemProps) => {
  const queryClient = useQueryClient()
  const showToast = useCustomToast()
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors, isDirty },
  } = useForm<ItemUpdate>({
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: item,
  })

  const mutation = useMutation({
    mutationFn: (data: ItemUpdate) =>
      ItemsService.updateItem({ id: item.id, requestBody: data }),
    onSuccess: () => {
      showToast("Success!", "Item updated successfully.", "success")
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

  const onSubmit: SubmitHandler<ItemUpdate> = async (data) => {
    mutation.mutate(data)
  }

  const onCancel = () => {
    reset()
    onClose()
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
          <ModalHeader>Edit Item</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={4}>
            <FormControl isInvalid={!!errors.title}>
              <FormLabel htmlFor="title">Title</FormLabel>
              <Input
                id="title"
                {...register("title", {
                  required: "Title is required",
                })}
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
                type="text"
              />
            </FormControl>
            <FormControl mt={3} isInvalid={!!errors.release_year}>
              <FormLabel htmlFor="release_year">Release Year</FormLabel>
              <Input
                id="release_year"
                {...register("release_year")}
                type="text"
              />
            </FormControl>
            <FormControl mt={3} isInvalid={!!errors.genres}>
              <FormLabel htmlFor="genres">Genres</FormLabel>
              <Input
                id="genres"
                {...register("genres")}
                type="text"
              />
            </FormControl>
            <FormControl mt={3} isInvalid={!!errors.vote_average}>
              <FormLabel htmlFor="vote_average">Vote Average</FormLabel>
              <Input
                id="vote_average"
                {...register("vote_average", {
                  valueAsNumber: true,
                })}
                type="number"
                step="0.1"
              />
            </FormControl>
            <FormControl mt={3} isInvalid={!!errors.vote_count}>
              <FormLabel htmlFor="vote_count">Vote Count</FormLabel>
              <Input
                id="vote_count"
                {...register("vote_count", {
                  valueAsNumber: true,
                })}
                type="number"
              />
            </FormControl>
            <FormControl mt={3} isInvalid={!!errors.director}>
              <FormLabel htmlFor="director">Director</FormLabel>
              <Input
                id="director"
                {...register("director")}
                type="text"
              />
            </FormControl>
            <FormControl mt={3} isInvalid={!!errors.top_actors}>
              <FormLabel htmlFor="top_actors">Top Actors</FormLabel>
              <Input
                id="top_actors"
                {...register("top_actors")}
                type="text"
              />
            </FormControl>
            <FormControl mt={3} isInvalid={!!errors.keywords}>
              <FormLabel htmlFor="keywords">Keywords</FormLabel>
              <Input
                id="keywords"
                {...register("keywords")}
                type="text"
              />
            </FormControl>
          </ModalBody>
          <ModalFooter gap={2}>
            <Button
              variant="primary"
              type="submit"
              isLoading={isSubmitting}
              isDisabled={!isDirty}
            >
              Save
            </Button>
            <Button onClick={onCancel}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default EditItem
