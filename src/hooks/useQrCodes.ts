import { QR_CODES } from '@/config/URLS';
import { QRCode, QrCodeRequest } from '@/types';
import { Axios, catchError } from '@/utils/Axios';
import {
  useMutation,
  useQueryClient
} from '@tanstack/react-query';

export const useQRCodes = () => {
  const queryClient = useQueryClient();

  const createQRCode = useMutation({
    mutationKey: ['createQRCode'],
    mutationFn: async (data: QrCodeRequest) => {
      const [error, resOrStatus] = await catchError(
        Axios.post<QRCode>(QR_CODES(), data)
      );
      if (error) throw error;
      return resOrStatus.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['qrCodes']
      });
    }
  });

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

      if (error) throw error;
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
      if (error) throw error;
      return resOrStatus.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['qrCodes']
      });
    }
  });

  return {
    createQRCode,
    updateQRCode,
    deleteQRCode
  };
};
