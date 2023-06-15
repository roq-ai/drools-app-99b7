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
import { createAudio } from 'apiSdk/audio';
import { Error } from 'components/error';
import { audioValidationSchema } from 'validationSchema/audio';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { LibraryInterface } from 'interfaces/library';
import { getLibraries } from 'apiSdk/libraries';
import { AudioInterface } from 'interfaces/audio';

function AudioCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: AudioInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createAudio(values);
      resetForm();
      router.push('/audio');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<AudioInterface>({
    initialValues: {
      title: '',
      genre: '',
      url: '',
      library_id: (router.query.library_id as string) ?? null,
    },
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
            Create Audio
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
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
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'audio',
  operation: AccessOperationEnum.CREATE,
})(AudioCreatePage);
