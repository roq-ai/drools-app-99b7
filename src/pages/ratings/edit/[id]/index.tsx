import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getRatingById, updateRatingById } from 'apiSdk/ratings';
import { Error } from 'components/error';
import { ratingValidationSchema } from 'validationSchema/ratings';
import { RatingInterface } from 'interfaces/rating';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { AudioInterface } from 'interfaces/audio';
import { UserInterface } from 'interfaces/user';
import { getAudio } from 'apiSdk/audio';
import { getUsers } from 'apiSdk/users';

function RatingEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<RatingInterface>(
    () => (id ? `/ratings/${id}` : null),
    () => getRatingById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: RatingInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateRatingById(id, values);
      mutate(updated);
      resetForm();
      router.push('/ratings');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<RatingInterface>({
    initialValues: data,
    validationSchema: ratingValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Edit Rating
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <FormControl id="rating" mb="4" isInvalid={!!formik.errors?.rating}>
              <FormLabel>Rating</FormLabel>
              <NumberInput
                name="rating"
                value={formik.values?.rating}
                onChange={(valueString, valueNumber) =>
                  formik.setFieldValue('rating', Number.isNaN(valueNumber) ? 0 : valueNumber)
                }
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              {formik.errors.rating && <FormErrorMessage>{formik.errors?.rating}</FormErrorMessage>}
            </FormControl>
            <AsyncSelect<AudioInterface>
              formik={formik}
              name={'audio_id'}
              label={'Select Audio'}
              placeholder={'Select Audio'}
              fetcher={getAudio}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.title}
                </option>
              )}
            />
            <AsyncSelect<UserInterface>
              formik={formik}
              name={'user_id'}
              label={'Select User'}
              placeholder={'Select User'}
              fetcher={getUsers}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.email}
                </option>
              )}
            />
            <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
              Submit
            </Button>
          </form>
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'rating',
  operation: AccessOperationEnum.UPDATE,
})(RatingEditPage);
