//import '@tensorflow/tfjs';
import * as Model from '@tensorflow-models/toxicity';
import * as Discord from 'lilybird';

const indice = 0.9; //Sensibility
const messages: Discord.Message.Structure[] = []; 
const interval = 5_000; // Batch interval
const discord_token = ''; //Your bot token, https://discord.com/developers/applications

const classifier = await Model.load(indice, ['toxicity']);
const client = new Discord.Client({ 
    intents: 131071,
    listeners: {
        messageCreate(_, message) {
            let bypass = false;

            if(!bypass) {
                messages.push(message);
            } 
        }
    },
    async setup(client) {
        console.log('Logged in');
        setInterval(async () => {
            if(messages.length > 0) {
                const msgs = messages.splice(0, messages.length)
                const results = await classifier.classify(msgs.map(({ content }) => (content)));
                results.forEach(({ results }) => {
                    if (results.length <= 0) {
                        return;
                    }
    
                    results.forEach(async ({ match }, index) => {
                        const { channel_id, id } = msgs.at(index)!;

                        if (match && id) {
                            await client.rest.deleteMessage(channel_id, id);
                        }
                    });
                });
            }
        }, interval);
    }
});

client.login(discord_token);
