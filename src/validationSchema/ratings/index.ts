import * as yup from 'yup';

export const ratingValidationSchema = yup.object().shape({
  rating: yup.number().integer().required(),
  audio_id: yup.string().nullable().required(),
  user_id: yup.string().nullable().required(),
});
