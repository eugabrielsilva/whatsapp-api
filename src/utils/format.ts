function toClient(phone: string): string {
  return phone.replace(/\D/g, '') + '@c.us'
}

function toUser(phone: string): string {
  return '+' + phone.replace('@c.us', '')
}

function toDate(timestamp: number): string {
  return new Date(timestamp).toLocaleString()
}

export { toClient, toUser, toDate }
