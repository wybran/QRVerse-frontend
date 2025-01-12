
export interface QRCode {
  uuid:       string;
  link:       string;
  createdAt:  Date;
  updatedAt:  Date;
  clickCount: number;
  isProtected: boolean;
}
