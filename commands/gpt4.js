const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'gpt4',
  description: 'Interagit avec GPT-4',
  usage: 'gpt4 [votre message]',
  author: 'RONALD SORY',

  async execute(senderId, args, pageAccessToken) {
    const message = args.join(' ');
    if (!message) {
      return sendMessage(senderId, { text: "❗ Utilisation : gpt4 [votre message]" }, pageAccessToken);
    }

    try {
      // NOUVELLE API
      const apiUrl = `https://fuku-api-v4-2-p6ik.onrender.com/ask?prompt=${encodeURIComponent(message)}`;
      
      const response = await axios.get(apiUrl);

      // Adaptation à la structure de réponse de la nouvelle API
      // La réponse semble être directement dans response.data
      const reply = response.data?.response?.trim() || 
                   response.data?.answer?.trim() ||
                   response.data?.content?.trim() || 
                   response.data?.trim() || 
                   response.data;

      if (reply) {
        // Découpage en messages de 1800 caractères
        for (let i = 0; i < reply.length; i += 1800) {
          await sendMessage(senderId, { text: reply.substring(i, i + 1800) }, pageAccessToken);
        }
      } else {
        sendMessage(senderId, { text: "❌ GPT-4 n'a pas pu répondre. Réessaie." }, pageAccessToken);
      }

    } catch (error) {
      console.error("❌ Erreur API GPT-4 :", error.message);
      sendMessage(senderId, { text: "🚨 Une erreur s'est produite. Réessaie plus tard." }, pageAccessToken);
    }
  }
};
