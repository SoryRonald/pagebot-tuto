const axios = require('axios');
const { sendMessage} = require('../handles/sendMessage');

module.exports = {
  name: 'gpt4',
  description: 'Interagit avec le modèle AI via Fuku API',
  usage: 'gpt4 [votre message]',
  author: 'Aziz Damiba',

  async execute(senderId, args, pageAccessToken) {
    const message = args.join(' ');
    if (!message) {
      return sendMessage(senderId, { text: "❗ Utilisation: gpt4 [votre message]"}, pageAccessToken);
}

try {
  const apiUrl = `https://fuku-api-v4-7mlw.vercel.app/ask?prompt=${encodeURIComponent(message)}`;
  const response = await axios.get(apiUrl);

  console.log("✅ Réponse brute:", response.data);

  const reply = response.data?.response?.trim() || response.data?.content?.trim();

  if (reply) {
    for (let i = 0; i < reply.length; i += 1800) {
      await sendMessage(senderId, { text: reply.substring(i, i + 1800)}, pageAccessToken);
}
} else {
    sendMessage(senderId, { text: "❌ L'IA n'a pas pu répondre. Réessaie."}, pageAccessToken);
}

} catch (error) {
  console.error("❌ Erreur API GPT-4:", error.response?.data || error.message);
  sendMessage(senderId, {
    text: "⚠️ Danakro a rencontré un problème technique. Si cela continue, tapez *help* pour obtenir le lien du profil du créateur.",
}, pageAccessToken);
}
