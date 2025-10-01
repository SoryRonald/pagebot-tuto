const axios = require('axios');
const { sendMessage} = require('../handles/sendMessage');

module.exports = async function defaultHandler(senderId, messageText, pageAccessToken) {
  const message = messageText.trim();

  if (!message) {
    return await sendMessage(senderId, {
      text: "👋 Bonjour! Je suis Danakro AI. Parlez-moi directement et je vous répondrai!\n\nExemple: \"Quelle est la capitale du Burkina Faso ?\""
}, pageAccessToken);
}

  try {
    await sendMessage(senderId, { sender_action: 'typing_on'}, pageAccessToken);

    const response = await axios.post('https://fuku-api-v4-2.onrender.com/ask?prompt=', {
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
        text: "❌ Danakro AI n'a pas pu générer de réponse. Pouvez-vous reformuler votre message?"
}, pageAccessToken);
}

} catch (error) {
    console.error("❌ Erreur API Danakro:", error.message);

    let errorMessage = "🚨 Une erreur s'est produite. Réessaie dans quelques minutes.";

    if (error.code === 'ECONNABORTED') {
      errorMessage = "⏰ La requête a expiré. Réessaie.";
} else if (error.response) {
      const status = error.response.status;
      if (status === 400) {
        errorMessage = "⚠️ Requête invalide. Vérifie le format.";
} else if (status === 429) {
        errorMessage = "🐦 Trop de requêtes. Patiente un peu.";
} else if (status>= 500) {
        errorMessage = "🔧 Surcharge de question par beaucoup d'utilisateurs. Réessaie dans une minute.";
}
} else if (error.request) {
      errorMessage = "🌐 Serveur injoignable. Vérifie ta connexion.";
}

    await sendMessage(senderId, { text: errorMessage}, pageAccessToken);
}
};
