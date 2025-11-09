const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'gpt4',
  description: 'Interagit avec Gpt4 ',
  usage: 'gpt4 [votre message]',
  author: 'AZIZ DAMIBA',
  

  async execute(senderId, args, pageAccessToken) {
    const message = args.join(' ');
    if (!message) {
      return sendMessage(senderId, { text: "❗ Utilisation : Danakro [votre message]" }, pageAccessToken);
    }

    try {
      const apiUrl = `https://fuku-api-v4-2-p6ik.onrender.com/ask?prompt=${senderId}&message=${encodeURIComponent(message)}`;
      const response = await axios.get(apiUrl);

      const reply = response.data?.response?.trim() || response.data?.content?.trim();

      if (reply) {
        for (let i = 0; i < reply.length; i += 1800) {
          await sendMessage(senderId, { text: reply.substring(i, i + 1800) }, pageAccessToken);
        }
      } else {
        sendMessage(senderId, { text: "❌ Attention bug détecté. Réessaie" }, pageAccessToken);
      }

    } catch (error) {
      console.error("❌ Erreur de l'API Danakro :", error.message);
      sendMessage(senderId, { text: "🚨 erreur détecté lors des analyses. si le problème persiste contactez l'administrateur." }, pageAccessToken);
    }
  }
};
