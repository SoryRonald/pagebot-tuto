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
      const apiUrl = `https://fuku-api-v4-2-p6ik.onrender.com/ask?prompt=${encodeURIComponent(message)}`;
      const response = await axios.get(apiUrl);

      // Vérifier la structure de la réponse
      let reply;
      if (typeof response.data === 'string') {
        reply = response.data;
      } else if (response.data.response) {
        reply = response.data.response;
      } else if (response.data.answer) {
        reply = response.data.answer;
      } else {
        reply = JSON.stringify(response.data);
      }

      reply = reply.trim();

      if (reply) {
        // Découper le message en parties de 1800 caractères maximum
        for (let i = 0; i < reply.length; i += 1800) {
          await sendMessage(senderId, { text: reply.substring(i, i + 1800) }, pageAccessToken);
        }
      } else {
        await sendMessage(senderId, { text: "❌ GPT-4 n'a pas pu répondre. Réessaie." }, pageAccessToken);
      }

    } catch (error) {
      console.error("❌ Erreur API GPT-4 :", error.message);
      console.error("Détails de l'erreur :", error.response?.data || error);
      await sendMessage(senderId, { text: "🚨 Une erreur s'est produite. Réessaie plus tard." }, pageAccessToken);
    }
  }
};
