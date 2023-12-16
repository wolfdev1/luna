import { Events } from "discord.js";
import { messages } from "./config/messages.js";
import fs from 'node:fs';
import path from "node:path";
import * as url from 'url';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

export async function manage(commands) {
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
                commands.set(command.data.name, command);
            } else {
                console.log(`Warn: The command at ${filePath} is missing a required "data" or "execute" property.`);
            }
        }
    }
}

export async function event(client) {
    client.on(Events.InteractionCreate, async interaction => {
        if (!interaction.isChatInputCommand()) return;
    
        const command = interaction.client.commands.get(interaction.commandName);
    
        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }
    
        try {
            await command.execute(interaction);
        } catch (error) {
            const message = await messages().then(messages => messages.interaction_error);
            console.error(error);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: message, ephemeral: true });
            } else {
                await interaction.reply({ content: message, ephemeral: true });
            }
        }
    });
}