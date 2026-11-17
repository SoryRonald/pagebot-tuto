const fs = require('fs');
const path = require('path');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'help',
  description: 'Affiche les commandes disponibles classées par catégorie',
  usage: 'help\nhelp [nom de la commande]',
  author: 'RONALD SORY',
  category: 'INFO',
  access: "all",

  execute(senderId, args, pageAccessToken) {
    const commandsDir = path.join(__dirname, '../commands');
    const commandFiles = fs.readdirSync(commandsDir).filter(file => file.endsWith('.js'));

    
    const commands = commandFiles.map(file => require(path.join(commandsDir, file)));

    
    if (args.length > 0) {
      const commandName = args[0].toLowerCase();
      const command = commands.find(cmd => cmd.name.toLowerCase() === commandName);

      if (command) {
        const commandDetails = `
╭『 𝗗𝗘𝗧𝗔𝗜𝗟𝗦 𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗘 💙』
│ 💡 Nom : ${command.name}
│ 📝 Description : ${command.description}
│ 📖 Usage : ${command.usage}
│ 📂 Catégorie : ${command.category || "Autres"}
│ 🚹 accès : ${command.access || "Aucun accès n'est mentionné."}
│ ✨ Exemple : ${command.example || "Aucun exemple disponible."}
╰───────────────────◉`;

        return sendMessage(senderId, { text: commandDetails }, pageAccessToken);
      } else {
        return sendMessage(senderId, { text: `🚨 **Commande introuvable !**\nLa commande "${commandName}" n'existe pas.\nEssaye **help** pour voir la liste complète.`, pageAccessToken });
      }
    }

    
    const categorizedCommands = {};
    commands.forEach(command => {
      const category = command.category || 'Autres';
      if (!categorizedCommands[category]) {
        categorizedCommands[category] = [];
      }
      categorizedCommands[category].push(`│ 🔹 ${command.name}`);
    });

    
    let helpMessage = `💙 𝗟𝗜𝗦𝗧𝗘 𝗗𝗘𝗦 𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗘𝗦\n\n`;

    Object.entries(categorizedCommands).forEach(([category, commandNames]) => {
      helpMessage += `╭『 ${category} 』💙\n`;
      helpMessage += commandNames.join('\n') + '\n';
      helpMessage += `╰────────────◉\n\n`;
    });

    helpMessage += `📌 Utilise : \`help [nom]\` pour voir les détails d'une commande.\n`;
    helpMessage += `Pour être VIP sur Ronals Bot contactez l'administrateur 👇🏽`;
    helpMessage += `🔗 [RONALD SORY](https://www.facebook.com/sory.alexandre.rony)\n`;
    helpMessage += `━━━━━━━━━━━━━`;

    sendMessage(senderId, { text: helpMessage }, pageAccessToken);
  }
};
