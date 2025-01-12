import { useQRCode } from '@/hooks/useQrCode';
import { useQRCodes } from '@/hooks/useQrCodes';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export const Route = createFileRoute('/account')({
  component: RouteComponent
});

function RouteComponent() {
  const { t } = useTranslation();
  const { qrCodes } = useQRCode();
  const { updateQRCode, deleteQRCode } = useQRCodes();

  const [editQrCode, setEditQrCode] = useState<string | null>(null);
  const [updatedLink, setUpdatedLink] = useState('');

  const handleUpdate = async (uuid: string) => {
    try {
      await updateQRCode.mutateAsync({
        uuid,
        updatedData: { link: updatedLink }
      });
      setEditQrCode(null);
    } catch (error) {
      console.error('Error updating QR code:', error);
    }
  };

  const handleDelete = async (uuid: string) => {
    try {
      await deleteQRCode.mutateAsync(uuid);
    } catch (error) {
      console.error('Error deleting QR code:', error);
    }
  };

  const copyLink = (uuid: string) => {
    const frontUrl = window.location.origin;
    const fullLink = `${frontUrl}/redirect/${uuid}`;
    navigator.clipboard.writeText(fullLink);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">{t('QR Codes')}</h2>
      <table className="table-auto w-full shadow-md rounded-lg">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left">{t('Link')}</th>
            <th className="px-4 py-2 text-left">{t('Password protected')}</th>
            <th className="px-4 py-2 text-left">{t('Click count')}</th>
            <th className="px-4 py-2 text-left">{t('Actions')}</th>
          </tr>
        </thead>
        <tbody>
          {qrCodes.map(qrCode => (
            <tr key={qrCode.uuid} className="border-b">
              <td className="px-4 py-2">
                {editQrCode === qrCode.uuid ? (
                  <input
                    type="text"
                    value={updatedLink}
                    onChange={e => setUpdatedLink(e.target.value)}
                    className="border border-gray-300 rounded px-2 py-1 w-full text-gray-800"
                  />
                ) : (
                  qrCode.link
                )}
              </td>
              <td className="px-4 py-2">{qrCode.isProtected ? '✅' : '❌'}</td>
              <td className="px-4 py-2">{qrCode.clickCount}</td>
              <td className="px-4 py-2">
                {editQrCode === qrCode.uuid ? (
                  <>
                    <button
                      onClick={() => handleUpdate(qrCode.uuid)}
                      className="bg-blue-500 text-white px-3 py-1 rounded mr-2 hover:bg-blue-600">
                      {updateQRCode.isPending ? t('Saving') : t('Save')}
                    </button>
                    <button
                      onClick={() => setEditQrCode(null)}
                      className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600">
                      {t('Cancel')}
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setEditQrCode(qrCode.uuid);
                        setUpdatedLink(qrCode.link);
                      }}
                      className="bg-yellow-500 text-white px-3 py-1 rounded mr-2 hover:bg-yellow-600">
                      {t('Edit')}
                    </button>
                    <button
                      onClick={() => copyLink(qrCode.uuid)}
                      className="bg-green-500 text-white px-3 py-1 rounded mr-2 hover:bg-green-600">
                      {t('Copy Link')}
                    </button>
                    <button
                      onClick={() => handleDelete(qrCode.uuid)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                      {deleteQRCode.isPending ? t('Deleting') : t('Delete')}
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
