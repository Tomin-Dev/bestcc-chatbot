import {
  createCC,
  getCreditCards,
  getBestCreditCardForToday,
  removeCC,
  sendGreetings,
  safeCallbackWrapper,
  giveFeedback,
} from "./lib/bot/bot";
import { feedback } from "./lib/convos/convos";
import { Bot, Context, session } from "grammy";
import {
  type Conversation,
  type ConversationFlavor,
  conversations,
  createConversation,
} from "@grammyjs/conversations";
import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import

dotenv.config();

console.log("Starting script...");
const botToken = process.env.BOT_TOKEN;

if (botToken === undefined) {
  throw new Error('The bot token is not set. Uset the ".env" file to set it.');
}

export type MyContext = Context & ConversationFlavor;
export type MyConversation = Conversation<MyContext>;

// Create an instance of the `Bot` class and pass your authentication token to it.
const bot = new Bot<MyContext>(botToken); // <-- put your authentication token between the ""

// Install the session plugin.
bot.use(
  session({
    initial() {
      // return empty object for now
      return {};
    },
  })
);

// Install the conversations plugin.
bot.use(conversations());

bot.use(createConversation(feedback));

bot.command(
  "start",
  async (ctx) => await safeCallbackWrapper(ctx)("startCommand")(sendGreetings)
);

bot.command(
  "help",
  async (ctx) => await safeCallbackWrapper(ctx)("helpCommand")(sendGreetings)
);

bot.command(
  "settings",
  async (ctx) =>
    await safeCallbackWrapper(ctx)("settingsCommand")(sendGreetings)
);

bot.command(
  "creartarjeta",
  async (ctx) => await safeCallbackWrapper(ctx)("createCardCommand")(createCC)
);

bot.command(
  "borrartarjeta",
  async (ctx) => await safeCallbackWrapper(ctx)("removeCardCommand")(removeCC)
);

bot.command(
  "tarjetas",
  async (ctx) =>
    await safeCallbackWrapper(ctx)("getCardsCommand")(getCreditCards)
);

bot.command(
  "feedback",
  async (ctx) => await safeCallbackWrapper(ctx)(null)(giveFeedback)
);

bot.command(
  "mejortarjeta",
  async (ctx) =>
    await safeCallbackWrapper(ctx)("getBestCardCommand")(
      getBestCreditCardForToday
    )
);

bot.api.setMyCommands(
  [
    { command: "start", description: "Empezar a usar el bot" },
    { command: "help", description: "Ayuda con los comandos más útiles" },
    { command: "settings", description: "Configuraciones (aún en progreso)" },
    {
      command: "creartarjeta",
      description: "Añade una tarjeta de crédito a tu lista",
    },
    {
      command: "borrartarjeta",
      description: "Borra una tarjeta de crédito de tu lista",
    },
    {
      command: "tarjetas",
      description:
        "Obtén la lista de tus tarjetas ordenadas para el mejor uso.",
    },
    {
      command: "mejortarjeta",
      description: "Obtén la mejor tarjeta registrada a usar el día de hoy",
    },
    {
      command: "feedback",
      description: "Danos tu opinión de este bot.",
    },
  ],
  { scope: { type: "all_private_chats" } }
);

bot.on(
  "message",
  async (ctx) => await safeCallbackWrapper(ctx)("genericMessage")(sendGreetings)
);

bot.start();
