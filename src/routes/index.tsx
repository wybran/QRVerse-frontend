import { QrCodeGenerator } from '@/components/QRCodeGenerator';
import { createFileRoute } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next';

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { t } = useTranslation();

  return (
    <QrCodeGenerator />
  )
}
