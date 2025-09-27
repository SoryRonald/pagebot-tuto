const axios = require('axios');
const { sendMessage} = require('../handles/sendMessage');

module.exports = {
  name: 'gpt4',
  description: 'Interagit avec Danakro AI via Fuku API',
  usage: 'danakro [votre message]',
  author: 'Aziz Damiba',

  async execute(senderId, args, pageAccessToken) {
    const prompt = args.join(' ');
    if (!prompt) {
      return sendMessage(senderId, { text: "❗ Utilisation: danakro [votre message]"}, pageAccessToken);
}

    try {
      const apiUrl = `https://fuku-api-v4-m63q.onrender.com/ask?prompt=${encodeURIComponent(prompt)}`;
      const response = await axios.get(apiUrl);

      const reply = response.data?.reply?.trim();
      if (reply) {
        for (let i = 0; i < reply.length; i += 1800) {
          await sendMessage(senderId, { text: reply.substring(i, i + 1800)}, pageAccessToken);
}
} else {
        await sendMessage(senderId, {
          text: "❌ Danakro AI ❌ n'a pas pu répondre. Réessaie. Si le problème persiste contactez l'administrateur en écrivant 👉 help 👈 pour avoir le lien de son profil"
}, pageAccessToken);
}

} catch (error) {
      console.error("❌ Erreur API Danakro AI:", error.message);
      await sendMessage(senderId, {
        text: "🕳️ DANAKRO AI 🕳️ a eu un petit problème. Réessaie plus tard. Si le problème persiste, contactez l'administrateur en écrivant 👉 help 👈 pour voir le lien de son profil"
}, pageAccessToken);
}
}
};
