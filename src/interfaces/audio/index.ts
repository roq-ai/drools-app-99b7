import { RatingInterface } from 'interfaces/rating';
import { LibraryInterface } from 'interfaces/library';
import { GetQueryInterface } from 'interfaces';

export interface AudioInterface {
  id?: string;
  title: string;
  genre: string;
  url: string;
  library_id: string;
  created_at?: any;
  updated_at?: any;
  rating?: RatingInterface[];
  library?: LibraryInterface;
  _count?: {
    rating?: number;
  };
}

export interface AudioGetQueryInterface extends GetQueryInterface {
  id?: string;
  title?: string;
  genre?: string;
  url?: string;
  library_id?: string;
}
