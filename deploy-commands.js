import { REST, Routes } from 'discord.js';
import { config } from 'dotenv';
import { clientId } from './config.json' assert { type: 'json' };
import fs from 'fs';
config();

const commands = [];
const commandFiles = fs.readdirSync('./commands');

for (const file of commandFiles) {
  const command = await import(`./commands/${file}`);
  commands.push(command.default.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

try {
  console.log('Registering slash commands...');
  await rest.put(Routes.applicationCommands(clientId), { body: commands });
  console.log('Commands registered!');
} catch (err) {
  console.error(err);
}
