const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'gpt4',
  description: 'Interagit avec Ronald API Openai',
  usage: 'gpt4 [votre message]',
  author: 'RONALD SORY',
  access: 'all', 
  category: '🧠 AI',

  async execute(senderId, args, pageAccessToken) {
    const message = args.join(' ').trim();
    if (!message) {
      return sendMessage(senderId, { text: "❗ Utilisation : gpt4 [votre message]" }, pageAccessToken);
    }

    try {
      // ✅ Requête API avec msg + userId
      const apiUrl = `https://ronald-api-v2-833u.vercel.app/api/gpt4?msg=${encodeURIComponent(message)}&userId=${senderId}`;
      const response = await axios.get(apiUrl);

      // ✅ L’API retourne probablement "ronald_reply" comme avant
      const reply = response.data?.ronald_reply?.trim();

      if (reply) {
        for (let i = 0; i < reply.length; i += 1800) {
          await sendMessage(senderId, { text: reply.substring(i, i + 1800) }, pageAccessToken);
        }
      } else {
        sendMessage(senderId, { text: "❌ je n'ai pas pu répondre. Réessaie." }, pageAccessToken);
      }

    } catch (error) {
      console.error("❌ Erreur API  :", error.message);
      sendMessage(senderId, { text: "🚨 Une erreur s'est produite avec. Réessaie plus tard." }, pageAccessToken);
    }
  }
};
