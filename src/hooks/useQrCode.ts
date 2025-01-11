import { QR_CODES } from '@/config/URLS';
import { QRCode } from '@/types';
import { Axios, catchError } from '@/utils/Axios';
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';

export const useQRCodes = () => {
  const {
    data: qrCodes,
    refetch: refetchQRCodes,
    error: qrCodesError,
    isLoading: qrCodesIsLoading
  } = useSuspenseQuery(
    queryOptions({
      queryKey: ['qrCodes'],
      queryFn: async () => {
        const [error, res] = await catchError(Axios.get<QRCode[]>(QR_CODES()));
        if (error) throw error;
        return res.data;
      }
    })
  );

  return {
    qrCodes,
    refetchQRCodes,
    qrCodesError,
    qrCodesIsLoading
  };
};
