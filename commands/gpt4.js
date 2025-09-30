const axios = require('axios');
const { sendMessage} = require('../handles/sendMessage');

module.exports = {
  name: 'danakro',
  description: 'Interagit avec Danakro AI (mémoire activée)',
  usage: 'danakro [votre message]',
  author: 'AZIZ DAMIBA',

  async execute(senderId, args, pageAccessToken) {
    const message = args.join(' ').trim();

    if (!message) {
      return sendMessage(senderId, {
        text: "❗ Utilisation: danakro [votre message]"
}, pageAccessToken);
}

    try {
      const response = await axios.post('https://fuku-api-v4-2.onrender.com/ask', {
        userId: senderId,
        prompt: message
}, {
        headers: { 'Content-Type': 'application/json'},
        timeout: 30000
});

      const reply = response.data?.reply?.trim();

      if (reply) {
        for (let i = 0; i < reply.length; i += 1800) {
          await sendMessage(senderId, {
            text: reply.substring(i, i + 1800)
}, pageAccessToken);
}
} else {
        await sendMessage(senderId, {
          text: "❌ Danakro AI n'a pas pu répondre. Réessaie."
}, pageAccessToken);
}

} catch (error) {
      console.error("❌ Erreur API Danakro (POST):", error.message);

      let errorMessage = "🚨 Une erreur s'est produite. Réessaie plus tard.";

      if (error.code === 'ECONNABORTED') {
        errorMessage = "⏰ La requête a expiré. Réessaie.";
} else if (error.response) {
        const status = error.response.status;
        if (status === 400) {
          errorMessage = "⚠️ Requête invalide. Vérifie le format.";
} else if (status === 429) {
          errorMessage = "🐦 Trop de requêtes. Patiente un peu.";
} else if (status>= 500) {
          errorMessage = "🔧 Problème serveur. Réessaie plus tard.";
}
} else if (error.request) {
        errorMessage = "🌐 Serveur injoignable. Vérifie ta connexion.";
}

      await sendMessage(senderId, { text: errorMessage}, pageAccessToken);
}
}
};
