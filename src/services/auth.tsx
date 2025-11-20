import { fetcher } from '../lib/fetcher';

export const getProfile = async () => {
  return fetcher('/auth/profile', {
    method: 'GET',
  });
};