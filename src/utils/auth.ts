export default class AuthHelper {
  static qr: string | null = null

  static setQr(qr: string | null): void {
    this.qr = qr
  }

  static getQr(): string | null {
    return this.qr
  }

  static hasQr(): boolean {
    return this.qr !== null
  }
}
