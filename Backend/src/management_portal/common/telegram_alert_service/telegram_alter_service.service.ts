import { Injectable } from "@nestjs/common";
import { Telegraf } from "telegraf";

@Injectable()
export class TelegramAlertService {
  private bot: Telegraf;

  constructor() {
    this.bot = new Telegraf("YOUR_TELEGRAM_BOT_TOKEN");
  }

  async sendMessage(chatId: string, message: string): Promise<void> {
    try {
      await this.bot.telegram.sendMessage(chatId, message);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }
}
