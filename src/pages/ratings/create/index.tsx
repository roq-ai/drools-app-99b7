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
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createRating } from 'apiSdk/ratings';
import { Error } from 'components/error';
import { ratingValidationSchema } from 'validationSchema/ratings';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { AudioInterface } from 'interfaces/audio';
import { UserInterface } from 'interfaces/user';
import { getAudio } from 'apiSdk/audio';
import { getUsers } from 'apiSdk/users';
import { RatingInterface } from 'interfaces/rating';

function RatingCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: RatingInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createRating(values);
      resetForm();
      router.push('/ratings');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<RatingInterface>({
    initialValues: {
      rating: 0,
      audio_id: (router.query.audio_id as string) ?? null,
      user_id: (router.query.user_id as string) ?? null,
    },
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
            Create Rating
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
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
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'rating',
  operation: AccessOperationEnum.CREATE,
})(RatingCreatePage);
