import { upload } from '../service';

export const uploadAccountCsvLoader = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const config = { headers: { 'Content-Type': 'multipart/form-data' } };
  return upload(`loadData`, formData, config);
};
