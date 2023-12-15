import { generate } from "./ai.js"
import config from "./config.json" assert { type: "json" };
import msgs from "./messages.json" assert { type: "json" };

export const messages = async () => {

    let translatedMessages = {};
 
    for (const [key, value] of Object.entries(msgs)) {
       translatedMessages[key] = await generate(`Translate the following text into ${config.language}: ${value}`);
    }
 
    return translatedMessages;
 }
