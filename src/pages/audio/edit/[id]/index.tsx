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
import { getAudioById, updateAudioById } from 'apiSdk/audio';
import { Error } from 'components/error';
import { audioValidationSchema } from 'validationSchema/audio';
import { AudioInterface } from 'interfaces/audio';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { LibraryInterface } from 'interfaces/library';
import { getLibraries } from 'apiSdk/libraries';

function AudioEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<AudioInterface>(
    () => (id ? `/audio/${id}` : null),
    () => getAudioById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: AudioInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateAudioById(id, values);
      mutate(updated);
      resetForm();
      router.push('/audio');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<AudioInterface>({
    initialValues: data,
    validationSchema: audioValidationSchema,
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
            Edit Audio
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
            <FormControl id="title" mb="4" isInvalid={!!formik.errors?.title}>
              <FormLabel>Title</FormLabel>
              <Input type="text" name="title" value={formik.values?.title} onChange={formik.handleChange} />
              {formik.errors.title && <FormErrorMessage>{formik.errors?.title}</FormErrorMessage>}
            </FormControl>
            <FormControl id="genre" mb="4" isInvalid={!!formik.errors?.genre}>
              <FormLabel>Genre</FormLabel>
              <Input type="text" name="genre" value={formik.values?.genre} onChange={formik.handleChange} />
              {formik.errors.genre && <FormErrorMessage>{formik.errors?.genre}</FormErrorMessage>}
            </FormControl>
            <FormControl id="url" mb="4" isInvalid={!!formik.errors?.url}>
              <FormLabel>Url</FormLabel>
              <Input type="text" name="url" value={formik.values?.url} onChange={formik.handleChange} />
              {formik.errors.url && <FormErrorMessage>{formik.errors?.url}</FormErrorMessage>}
            </FormControl>
            <AsyncSelect<LibraryInterface>
              formik={formik}
              name={'library_id'}
              label={'Select Library'}
              placeholder={'Select Library'}
              fetcher={getLibraries}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.name}
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
  entity: 'audio',
  operation: AccessOperationEnum.UPDATE,
})(AudioEditPage);
