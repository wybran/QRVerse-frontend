import { QR_CODES } from '@/config/URLS';
import { QRCode } from '@/types';
import { Axios, catchError } from '@/utils/Axios';
import {
  queryOptions,
  useMutation,
  useQueryClient,
  useSuspenseQuery
} from '@tanstack/react-query';

export const useQRCodes = () => {
  const queryClient = useQueryClient();

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

  const updateQRCode = useMutation({
    mutationKey: ['updateQRCode'],
    mutationFn: async ({
      uuid,
      updatedData
    }: {
      uuid: string;
      updatedData: Partial<QRCode>;
    }) => {
      const [error, resOrStatus] = await catchError(
        Axios.put<QRCode>(`${QR_CODES()}/${uuid}`, updatedData)
      );

      if (error) {
        const statusCode =
          typeof resOrStatus === 'number' ? resOrStatus : undefined;
        throw { error, statusCode };
      }
      return resOrStatus.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['qrCodes']
      });
    }
  });

  const deleteQRCode = useMutation({
    mutationKey: ['deleteQRCode'],
    mutationFn: async (uuid: string) => {
      const [error, resOrStatus] = await catchError(
        Axios.delete(`${QR_CODES()}/${uuid}`)
      );
      if (error) {
        const statusCode =
          typeof resOrStatus === 'number' ? resOrStatus : undefined;
        throw { error, statusCode };
      }
      return resOrStatus;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['qrCodes']
      });
    }
  });

  return {
    qrCodes,
    refetchQRCodes,
    qrCodesError,
    qrCodesIsLoading,

    updateQRCode,
    deleteQRCode
  };
};
