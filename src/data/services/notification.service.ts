export class NotificationService {
  async sendPlatformNotification(payload: { title: string; message: string; type?: "info" | "success" | "warning" | "error" }) {
    // Placeholder: Enviar notificação na plataforma (API / WebSocket)
    console.log("[NotificationService] platform", payload);
    return Promise.resolve({ status: "ok" });
  }

  async sendEmailNotification(payload: { to: string; subject: string; body: string }) {
    // Placeholder: Chamada a endpoint de email
    console.log("[NotificationService] email", payload);
    return Promise.resolve({ status: "ok" });
  }
}
