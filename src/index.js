import { messages } from "./config/messages.js"
import { event, manage } from "./manager.js"
import { Client, Events, GatewayIntentBits, Collection }  from 'discord.js';

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();
event(client);
manage(client.commands);


client.once(Events.ClientReady, async readyClient => {
	console.log('Bot is ready. Successfully logged in Discord as ' + readyClient.user.tag);
});

client.login(process.env.DISCORD_TOKEN);
