import { useQRCodeRedirectLink } from '@/hooks/useQRCodeRedirectLink';
import { createFileRoute, useParams } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

export const Route = createFileRoute('/redirect/$uuid')({
  component: RouteComponent
});

function RouteComponent() {
  const { t } = useTranslation();

  const {
    getQRCodeRedirectLink,
    isQRCodeRedirectLinkError,
    isQRCodeRedirectLinkPending
  } = useQRCodeRedirectLink();

  const { uuid } = useParams({
    from: '/redirect/$uuid'
  });

  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [password, setPassword] = useState('');

  useEffect(() => {
    fetchQRCodeRedirectLink();
  }, [uuid]);

  const fetchQRCodeRedirectLink = async () => {
    try {
      const link = await getQRCodeRedirectLink({ uuid, password });
      window.location.href = link;
    } catch (error: any) {
      if (error.statusCode === 401) {
        if (showPasswordInput) {
          toast.error('Incorrect Password');
        }
        setShowPasswordInput(true);
      }
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-4">
      {isQRCodeRedirectLinkPending && (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-600 border-solid"></div>
          <span className="ml-4">{t('loading')}</span>
        </div>
      )}
      {isQRCodeRedirectLinkError && !showPasswordInput && (
        <div className="text-red-500 font-medium">{t('qrCodeNotFound')}</div>
      )}

      {showPasswordInput && (
        <div className="bg-white shadow-md rounded-lg p-6 max-w-md w-full">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {t('enterPassword')}
          </h2>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-600 mb-2"
          >
            {t('password')}
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent mb-4 text-gray-800"
          />
          <button
            onClick={fetchQRCodeRedirectLink}
            className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {t('submit')}
          </button>
        </div>
      )}
    </div>
  );
}
