const qrcode = require('qrcode-terminal');

const { Client ,LocalAuth} = require('whatsapp-web.js');
const { Configuration, OpenAIApi } = require("openai");
let setting = require("./key.json");


const client = new Client(
    {
        authStrategy: new LocalAuth()
    }
);

if (setting.openAPIKey == "ISI_KEY") {
    throw new Error("Isi openAPIKey di key.json dengan API key dari https://beta.openai.com/account/api-keys");
}

const configuration = new Configuration({
    apiKey: setting.openAPIKey,
});

  
const openai = new OpenAIApi(configuration);


client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message', async message => {
    console.log("\x1b[32m",'[RECEIVED MESSAGE]:',message.body);

  const completion = await openai.createCompletion({
      model:"text-davinci-003",
      prompt: message.body,
      temperature: 0.3,
      max_tokens: 2000,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
  })

    console.log("\x1b[36m%s\x1b[0m", '[REPLY FROM BOT]:',completion.data.choices[0].text.trim());

    message.reply(completion.data.choices[0].text.trim());

});
 
 

client.initialize();
 

