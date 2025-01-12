import { useQRCodes } from '@/hooks/useQrCodes';
import * as htmlToImage from 'html-to-image';
import { jsPDF } from 'jspdf';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import QRCode from 'react-qr-code';

export const QrCodeGenerator = () => {
  const { t } = useTranslation();
  const { createQRCode } = useQRCodes();

  const [url, setUrl] = useState('');
  const [password, setPassword] = useState('');
  const [isDynamic, setIsDynamic] = useState(false);
  const [uuid, setUuid] = useState<string | null>(null);
  const [bgColor, setBgColor] = useState('#FFFFFF');
  const [fgColor, setFgColor] = useState('#000000');
  const [level, setLevel] = useState('L');

  const qrCodeRef = useRef(null);

  const isUserLoggedIn = localStorage.getItem('user') !== null;

  useEffect(() => {
    if (isUserLoggedIn) {
      setIsDynamic(true);
    }
  }, [isUserLoggedIn]);

  const handleQrCodeGenerator = () => {
    if (!url) return;
    if (isDynamic) {
      generateDynamicQRCode();
      return;
    }
  };

  const downloadQRCode = () => {
    if (!qrCodeRef.current) return;

    htmlToImage
      .toPng(qrCodeRef.current)
      .then(dataUrl => {
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = 'qr-code.png';
        link.click();
      })
      .catch(error => {
        console.error('Error generating QR code:', error);
      });
  };

  const downloadPDF = () => {
    if (!qrCodeRef.current) return;

    htmlToImage
      .toPng(qrCodeRef.current)
      .then(dataUrl => {
        const pdf = new jsPDF();
        const pageWidth = pdf.internal.pageSize.getWidth();
        const qrCodeSize = 100;

        pdf.addImage(
          dataUrl,
          'PNG',
          (pageWidth - qrCodeSize) / 2,
          30,
          qrCodeSize,
          qrCodeSize
        );
        pdf.save('qr-code.pdf');
      })
      .catch(error => {
        console.error('Error generating QR code PDF:', error);
      });
  };

  const generateDynamicQRCode = async () => {
    try {
      const qrCode = await createQRCode.mutateAsync({
        link: url,
        password: password.length > 0 ? password : undefined
      });
      
      const frontUrl = window.location.origin;
      setUuid(qrCode.uuid);
      setUrl(`${frontUrl}/redirect/${qrCode.uuid}`);
    } catch (error) {
      console.error('Error generating dynamic QR code:', error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-gray-900">
          {t('QR Code Generator')}
        </h1>
        <div className="flex flex-col gap-4">
          {!uuid && (
            <>
              {isUserLoggedIn ? (
                <div className="flex items-center gap-2">
                  <label className="text-gray-700">{t('Dynamic')}:</label>
                  <input
                    type="checkbox"
                    checked={isDynamic}
                    onChange={e => setIsDynamic(e.target.checked)}
                    className="w-5 h-5 border border-gray-300 rounded"
                  />
                </div>
              ) : (
                <span className="text-gray-500 text-sm">
                  {t('Login to generate dynamic QR code')}
                </span>
              )}

              <div className="flex flex-col gap-2">
                <label className="text-gray-700">{t('URL')}:</label>
                <input
                  type="text"
                  placeholder={t('Enter a URL')}
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  className="flex-grow border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:outline-none focus:ring focus:ring-indigo-300 text-gray-800 placeholder-gray-500"
                />
              </div>

              {isDynamic && (
                <div className="flex flex-col gap-2">
                  <label className="text-gray-700">
                    {t('Enter password if you want to protect the link')}:
                  </label>
                  <input
                    type="text"
                    placeholder={t('Enter a password')}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="flex-grow border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:outline-none focus:ring focus:ring-indigo-300 text-gray-800 placeholder-gray-500"
                  />
                </div>
              )}

              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-gray-700">
                    {t('Background Color')}:
                  </label>
                  <input
                    type="color"
                    value={bgColor}
                    onChange={e => setBgColor(e.target.value)}
                    className="w-10 h-10 border border-gray-300 rounded"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-gray-700">
                    {t('Foreground Color')}:
                  </label>
                  <input
                    type="color"
                    value={fgColor}
                    onChange={e => setFgColor(e.target.value)}
                    className="w-10 h-10 border border-gray-300 rounded"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-gray-700">
                    {t('Error Correction Level')}:
                  </label>
                  <select
                    value={level}
                    onChange={e => setLevel(e.target.value)}
                    className="border border-gray-300 rounded-lg px-4 py-2 shadow-sm text-gray-800">
                    <option value="L">{t('Low')}</option>
                    <option value="M">{t('Medium')}</option>
                    <option value="Q">{t('Quartile')}</option>
                    <option value="H">{t('High')}</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {(url || (isDynamic && uuid)) && (
            <div className="flex flex-col items-center gap-4 mt-6">
              <div
                className="p-4 bg-white border border-gray-300 rounded-lg shadow"
                ref={qrCodeRef}>
                <QRCode
                  value={url}
                  size={400}
                  bgColor={bgColor}
                  fgColor={fgColor}
                  level={level}
                />
              </div>
            </div>
          )}

          {isDynamic && !uuid ? (
            <>
              <span className="text-gray-500 text-sm">
                {t(
                  'Note: Only for preview! Generate dynamic QR code to download it.'
                )}
              </span>
              <button
                onClick={handleQrCodeGenerator}
                className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600">
                {t('Generate QR Code')}
              </button>
            </>
          ) : (
            <div className="flex gap-4">
              <button
                onClick={downloadQRCode}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">
                {t('Download QR Code')}
              </button>
              <button
                onClick={downloadPDF}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                {t('Download PDF')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
