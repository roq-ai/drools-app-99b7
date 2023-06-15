import * as yup from 'yup';
import { ratingValidationSchema } from 'validationSchema/ratings';

export const audioValidationSchema = yup.object().shape({
  title: yup.string().required(),
  genre: yup.string().required(),
  url: yup.string().required(),
  library_id: yup.string().nullable().required(),
  rating: yup.array().of(ratingValidationSchema),
});
