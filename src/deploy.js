
import fs from 'node:fs';
import path from "node:path";
import * as url from 'url';
import { REST, Routes } from 'discord.js'
import config from './config.json' assert { type: "json" };
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));


const commands = [];
const foldersPath = path.join(__dirname, 'slash');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
        const commandModule = await import(url.pathToFileURL(filePath));
		const command = commandModule;
		if ('data' in command && 'execute' in command) {
			commands.push(command.data.toJSON());
		} else {
			console.log(`Warn: The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

const rest = new REST().setToken(process.env.DISCORD_TOKEN);

(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

	
		const data = await rest.put(
			Routes.applicationGuildCommands(config.clientId, config.guildId),
			{ body: commands },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {

		console.error(error);
	}
})();