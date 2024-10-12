import '@tensorflow/tfjs';
import * as Model from '@tensorflow-models/toxicity';
import * as Discord from 'discord.js';

const indice = 0.9; //Sensibility
const messages: Discord.Message[] = []; 
const interval = 5_000; // Batch interval
const discord_token = ''; //Your bot token, https://discord.com/developers/applications

const client = new Discord.Client({ intents: 12 });
const classifier = await Model.load(indice, ['toxicity']);

client.once('ready', () => {
    console.log('Logged in');

    setInterval(async () => {
        if(messages.length > 0) {
            const msgs = messages
                .splice(0, messages.length)
                .map(({ content }) => (content));

            const results = await classifier.classify(msgs);
            results.forEach(({ results }) => {
                if (results.length <= 0) {
                    return;
                }

                results.forEach(({ match }, index) => {
                    const message = messages.at(index);

                    if (match && message) {
                        message?.delete();
                    }
                });
            });
        }
    }, interval);
});

client.on('messageCreate', (message) => {
    const { author, member, guild } = message;
    const bypass = author.bot || member?.permissions.has('Administrator') || guild?.ownerId == author.id;

    if(bypass) {
        return;
    }

    messages.push(message);
});

client.login(discord_token);
