import { QR_CODES } from '@/config/URLS';
import { Axios, catchError } from '@/utils/Axios';
import { useMutation } from '@tanstack/react-query';

export const useQRCodeRedirectLink = () => {
  const {
    mutateAsync: getQRCodeRedirectLink,
    isPending: isQRCodeRedirectLinkPending,
    isError: isQRCodeRedirectLinkError
  } = useMutation({
    mutationKey: ['qrCodeRedirectLink'],
    mutationFn: async ({
      uuid,
      password
    }: {
      uuid: string;
      password?: string;
    }) => {
      const [error, resOrStatus] = await catchError(
        Axios.get<string>(`${QR_CODES()}/${uuid}`, {
          headers: password ? { Authorization: password } : undefined
        })
      );

      if (error) {
        const statusCode =
          typeof resOrStatus === 'number' ? resOrStatus : undefined;
        throw { error, statusCode };
      }
      return resOrStatus.data;
    }
  });

  return {
    getQRCodeRedirectLink,
    isQRCodeRedirectLinkPending,
    isQRCodeRedirectLinkError
  };
};
