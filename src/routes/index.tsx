import { QrCodeGenerator } from '@/components/QRCodeGenerator';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {

  return (
    <QrCodeGenerator />
  )
}
