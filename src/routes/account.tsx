import { useQRCodes } from '@/hooks/useQrCode'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/account')({
  component: RouteComponent,
})

function RouteComponent() {
  const { qrCodes } = useQRCodes()

  return (
    <div>
      <h2>QR Codes</h2>
      <ul>
        {qrCodes.map((qrCode) => (
          <li key={qrCode.uuid}>{qrCode.link}</li>
        ))}
      </ul>
    </div>
  )
}
