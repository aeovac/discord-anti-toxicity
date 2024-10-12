import '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-cpu';
import '@tensorflow/tfjs-backend-webgl';
import * as Model from '@tensorflow-models/toxicity';

//labels: 'toxicity', 'sexual_explicit', 'threat', 'severe_toxicity', 'obscene', 'insult', 'identity_attack'
const indice = 0.9;
const classifier = await Model.load(indice, ['toxicity', 'insult']);

const messages = [
    "bitch",
    "bitch ass",
    "bitch boy",
    "hello",
    "Shut up"
];

const results = await classifier.classify(messages);

results.forEach(({ label, results }) => {
    printLn(label);
    results.forEach(({ match }, index) => {
        printLn(`${messages[index]}: ${match}`);
    });
    printLn();
});

function printLn(message?: string) {
    console.log(message || '' + '\n');
}
