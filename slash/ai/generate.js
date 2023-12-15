import { SlashCommandBuilder } from 'discord.js';
import { messages } from "../../messages.js";
import { setTimeout as wait } from 'node:timers/promises';
import { generate } from "../../ai.js";

export const data = new SlashCommandBuilder()
    .setName('generate')
    .setDescription('Generate a response using the AI.')
    .addStringOption(option => option.setName('input')
        .setRequired(true)
        .setDescription('The input to generate a response from.'));
export async function execute(interaction) {
    const input = await interaction.options.getString('input');
    if (input.length < 10) { 
        const message = await messages().then(messages => messages.input_too_short);
        await interaction.reply({ content: message, ephemeral: true });
        return;
    }

    await interaction.deferReply();

    const response = await generate(input);
    await wait (7000);

    if (response.length < 1) {
        const message = await messages().then(messages => messages.interaction_error);
        await interaction.editReply(message);
        return;
    }

    if (response.length >= 2000) {
        const short_response = response.substring(0, 1980) + '...';
        await interaction.editReply(short_response);
    }

    await interaction.editReply(response);
}