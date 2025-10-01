// handles/messageHandler.js
const { sendMessage } = require('./sendMessage');
const danakroCommand = require('../commands/danakro');

async function handleMessage(senderId, message, pageAccessToken) {
  const text = message.text?.trim();
  
  if (!text) {
    return await sendMessage(senderId, {
      text: "👋 Bonjour ! Envoyez-moi un message et je vous répondrai."
    }, pageAccessToken);
  }

  // Traiter TOUS les messages avec Danakro AI (sans préfixe requis)
  try {
    // Indicateur de frappe
    await sendMessage(senderId, { sender_action: 'typing_on' }, pageAccessToken);

    const response = await axios.post('https://fuku-api-v4-2.onrender.com/ask?prompt=', {
      userId: senderId,
      prompt: text
    }, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 30000
    });

    const reply = response.data?.reply?.trim();

    if (reply) {
      // Envoi en chunks de 1800 caractères
      for (let i = 0; i < reply.length; i += 1800) {
        await sendMessage(senderId, {
          text: reply.substring(i, i + 1800)
        }, pageAccessToken);
      }
    } else {
      await sendMessage(senderId, {
        text: "❌ Je n'ai pas pu générer de réponse. Pouvez-vous reformuler votre message ?"
      }, pageAccessToken);
    }

  } catch (error) {
    console.error("❌ Erreur API Danakro:", error.message);
    
    let errorMessage = "🚨 Une erreur s'est produite. Réessayez dans quelques minutes.";
    
    if (error.code === 'ECONNABORTED') {
      errorMessage = "⏰ La requête a expiré. Réessayez.";
    } else if (error.response) {
      const status = error.response.status;
      if (status === 400) {
        errorMessage = "⚠️ Requête invalide. Vérifiez le format.";
      } else if (status === 429) {
        errorMessage = "🐦 Trop de requêtes. Patientez un peu.";
      } else if (status >= 500) {
        errorMessage = "🔧 Problème serveur. Réessayez plus tard.";
      }
    } else if (error.request) {
      errorMessage = "🌐 Serveur injoignable. Vérifiez votre connexion.";
    }

    await sendMessage(senderId, { text: errorMessage }, pageAccessToken);
  }
}

module.exports = { handleMessage };
