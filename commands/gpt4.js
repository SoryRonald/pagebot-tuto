const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'gpt4',
  description: 'Interagit avec Gpt4',
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

      console.log('🔍 Réponse API complète:', JSON.stringify(response.data, null, 2));

      // Gestion améliorée des différents formats de réponse
      let reply = '';
      
      // Essayer différents chemins possibles dans la réponse
      if (typeof response.data === 'string') {
        reply = response.data.trim();
      } else if (response.data?.response) {
        reply = response.data.response.trim();
      } else if (response.data?.content) {
        reply = response.data.content.trim();
      } else if (response.data?.message) {
        reply = response.data.message.trim();
      } else if (response.data?.answer) {
        reply = response.data.answer.trim();
      } else if (response.data?.data) {
        reply = response.data.data.trim();
      } else if (response.data?.text) {
        reply = response.data.text.trim();
      } else if (response.data) {
        // Si c'est un objet mais qu'aucun champ connu n'existe, on stringify
        reply = JSON.stringify(response.data).trim();
      }

      // Nettoyer la réponse si elle contient des caractères indésirables
      if (reply) {
        // Supprimer les éventuels prefixes/suffixes de l'API
        reply = reply.replace(/^(Response:|Answer:|Content:)\s*/i, '');
        
        // Vérifier que la réponse n'est pas une erreur
        if (reply.includes('error') || reply.includes('timeout') || reply.length < 2) {
          console.log('⚠️ Réponse suspecte détectée:', reply);
          sendMessage(senderId, { text: "🔄 L'API a renvoyé une réponse invalide. Veuillez réessayer." }, pageAccessToken);
          return;
        }

        console.log('✅ Réponse traitée:', reply.substring(0, 100) + '...');
        
        // Envoyer la réponse par morceaux
        for (let i = 0; i < reply.length; i += 1800) {
          await sendMessage(senderId, { text: reply.substring(i, i + 1800) }, pageAccessToken);
        }
      } else {
        console.log('❌ Réponse vide de l\'API');
        sendMessage(senderId, { text: "🔄 Aucune réponse reçue. L'API peut être temporairement surchargée. Veuillez réessayer dans quelques secondes." }, pageAccessToken);
      }

    } catch (error) {
      console.error("❌ Erreur de l'API Danakro :", error.message);
      console.error("Détails de l'erreur:", error.response?.data || 'Aucun détail supplémentaire');
      
      let errorMessage = "🚨 Erreur temporaire du service. Veuillez réessayer dans quelques instants.";
      
      if (error.code === 'ECONNREFUSED') {
        errorMessage = "🔌 Service temporairement indisponible. Réessayez plus tard.";
      } else if (error.response?.status === 429) {
        errorMessage = "⏳ Trop de requêtes. Veuillez patienter avant de réessayer.";
      } else if (error.response?.status >= 500) {
        errorMessage = "🔧 Problème technique côté serveur. Réessayez dans quelques minutes.";
      }
      
      sendMessage(senderId, { text: errorMessage }, pageAccessToken);
    }
  }
};
