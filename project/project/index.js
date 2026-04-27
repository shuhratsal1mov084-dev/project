const TelegramBot = require("node-telegram-bot-api");
const fs = require("fs");

const token = process.env.BOT_TOKEN;
const ADMIN_ID = Number(process.env.ADMIN_ID);

const bot = new TelegramBot(token, { polling: true });

const DB_FILE = "./db.json";

// ================= DB =================
function db() {
  return JSON.parse(fs.readFileSync(DB_FILE));
}

function save(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// ================= USER REGISTER =================
function addUser(id) {
  const data = db();
  if (!data.users.includes(id)) {
    data.users.push(id);
    save(data);
  }
}

// ================= START =================
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  addUser(chatId);

  bot.sendMessage(chatId, "🚀 SAAS BOT", {
    reply_markup: {
      inline_keyboard: [
        [{ text: "🎮 PUBG", callback_data: "pubg" }],
        [{ text: "🌐 VPN", callback_data: "vpn" }],
        [{ text: "💰 VIP", callback_data: "vip" }]
      ]
    }
  });
});

// ================= CALLBACK =================
bot.on("callback_query", (q) => {
  const chatId = q.message.chat.id;

  if (q.data === "vpn") {
    return bot.sendMessage(chatId,
      "🌐 VPN:\nhttps://t.me/+8Fb_0x5BE_xkNDUy"
    );
  }

  if (q.data === "vip") {
    bot.sendMessage(chatId, "💰 VIP olish uchun /pay yozing");
  }
});

// ================= VIP REQUEST =================
bot.onText(/\/pay/, (msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(ADMIN_ID,
    💰 VIP REQUEST\nUser: ${chatId}\n/approve ${chatId}
  );

  bot.sendMessage(chatId, "⏳ Admin tasdiqlaydi...");
});

// ================= APPROVE VIP =================
bot.onText(/\/approve (.+)/, (msg, match) => {
  if (msg.chat.id !== ADMIN_ID) return;

  const userId = match[1];

  const data = db();
  data.vip.push(userId);
  save(data);

  bot.sendMessage(userId,
    "✅ VIP ACTIVE!\n🔐 https://t.me/+8Fb_0x5BE_xkNDUy"
  );
});

// ================= VIP CHECK =================
function isVip(id) {
  return db().vip.includes(String(id));
}

bot.onText(/\/vipcontent/, (msg) => {
  if (!isVip(msg.chat.id)) {
    return bot.sendMessage(msg.chat.id, "❌ VIP kerak");
  }

  bot.sendMessage(msg.chat.id, "🔥 VIP CONTENT");
});

console.log("🚀 BOT RUNNING");