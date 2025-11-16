const axios = require('axios');
const { sendMessage} = require('../handles/sendMessage');

module.exports = {
  name: 'gpt4',
  description: 'Interagit avec Danakro AI via l’API personnalisée',
  usage: 'gpt4 [votre message]',
  author: 'RONALD SORY',

  async execute(senderId, args, pageAccessToken) {
    const message = args.join(' ');
    if (!message) {
      return sendMessage(senderId, { text: "❗ Utilisation: gpt4 [votre message]"}, pageAccessToken);
}

    try {
      // Nouvelle API personnalisée
      const apiUrl = `https://mybot-rest.kozow.com//ask?prompt=${encodeURIComponent(message)}`;

      const response = await axios.get(apiUrl);

      // Structure de réponse attendue: { reply: "..."}
      const reply = response.data?.reply?.trim() || response.data?.trim() || response.data;

      if (reply) {
        // Découpage en blocs de 1800 caractères
        for (let i = 0; i < reply.length; i += 1800) {
          await sendMessage(senderId, { text: reply.substring(i, i + 1800)}, pageAccessToken);
}
} else {
        sendMessage(senderId, { text: "❌ Danakro AI n'a pas pu répondre. Réessaie."}, pageAccessToken);
}

} catch (error) {
      console.error("❌ Erreur API Danakro AI:", error.message);
      sendMessage(senderId, { text: "🚨 Une erreur s'est produite. Réessaie plus tard."}, pageAccessToken);
}
}
};
