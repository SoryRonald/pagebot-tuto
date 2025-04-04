const axios = require('axios');
‎const { sendMessage } = require('../handles/sendMessage');
‎
‎module.exports = {
‎name: 'gemini',
‎description: 'Interagit avec Google Gemini',
‎usage: 'gemini [votre message]',
‎author: 'RONALD SORY',//Api by Sandipbaruwal
‎
‎async execute(senderId, args, pageAccessToken, event) {
‎try {
‎let prompt = args.join(' ');
‎
‎
‎if (event.message && event.message.attachments && event.message.attachments[0].type === 'image') {
‎const photoUrl = encodeURIComponent(event.message.attachments[0].payload.url);
‎const url = `https://sandipbaruwal.onrender.com/gemini2?prompt=${encodeURIComponent(prompt)}&url=${photoUrl}`;
‎
‎const response = await axios.get(url);
‎return sendMessage(senderId, { text: response.data.answer }, pageAccessToken);
‎}
‎
‎if (!prompt) {
‎return sendMessage(senderId, { text: "Usage: gemini " }, pageAccessToken);
‎}
‎
‎const encodedPrompt = encodeURIComponent(prompt);
‎const apiUrl = `https://sandipbaruwal.onrender.com/gemini?prompt=${encodedPrompt}`;
‎
‎// Indiquer que le bot traite la demande
‎sendMessage(senderId, { text: "⏳ Génération en cours..." }, pageAccessToken);
‎
‎const res = await axios.get(apiUrl);
‎const result = res.data.answer;
‎
‎sendMessage(senderId, { text: result }, pageAccessToken);
‎
‎} catch (error) {
‎console.error("Erreur lors de la requête à Gemini:", error.message);
‎sendMessage(senderId, { text: "❌ Une erreur s'est produite, réessayez plus tard." }, pageAccessToken);
‎}
‎}
‎};
‎
