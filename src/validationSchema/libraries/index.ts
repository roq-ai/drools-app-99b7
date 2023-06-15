import * as yup from 'yup';
import { audioValidationSchema } from 'validationSchema/audio';

export const libraryValidationSchema = yup.object().shape({
  description: yup.string(),
  image: yup.string(),
  name: yup.string().required(),
  user_id: yup.string().nullable().required(),
  audio: yup.array().of(audioValidationSchema),
});
