const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

// Stockage simple en mémoire (à remplacer par une base de données pour la persistance)
const userMemories = new Map();

module.exports = {
  name: 'gpt4',
  description: 'Interagit avec GPT-4 avec mémoire de conversation',
  usage: 'gpt4 [votre message]',
  author: 'AZIZ DAMIBA',
  
  async execute(senderId, args, pageAccessToken) {
    const message = args.join(' ');
    if (!message) {
      return sendMessage(senderId, { text: "❗ Utilisation : gpt4 [votre message]" }, pageAccessToken);
    }

    try {
      // Récupérer l'historique de conversation ou initialiser
      if (!userMemories.has(senderId)) {
        userMemories.set(senderId, []);
      }
      const userMemory = userMemories.get(senderId);
      
      // Ajouter le nouveau message à l'historique
      userMemory.push(`Utilisateur: ${message}`);
      
      // Limiter l'historique aux 10 derniers messages pour éviter les dépassements
      if (userMemory.length > 10) {
        userMemory.splice(0, userMemory.length - 10);
      }
      
      // Préparer le prompt avec l'historique
      const fullPrompt = userMemory.join('\n') + '\nAssistant:';
      
      const apiUrl = `https://fuku-api-v4-2.onrender.com/ask?prompt=${encodeURIComponent(fullPrompt)}`;
      const response = await axios.get(apiUrl);

      const reply = response.data?.response?.trim() || response.data?.content?.trim() || response.data?.trim();

      if (reply) {
        // Ajouter la réponse à l'historique
        userMemory.push(`Assistant: ${reply}`);
        
        // Envoyer la réponse par morceaux
        for (let i = 0; i < reply.length; i += 1800) {
          await sendMessage(senderId, { text: reply.substring(i, i + 1800) }, pageAccessToken);
        }
      } else {
        sendMessage(senderId, { text: "Une surcharge de l'API vient de se produire. réessayer une minute plus tard " }, pageAccessToken);
      }

    } catch (error) {
      console.error("❌ Erreur API GPT-4 :", error.message);
      sendMessage(senderId, { text: "🚨 Une surcharge de requêtes s'est produite. Réessaie une minute plus tard" }, pageAccessToken);
    }
  }
};
