import { getApiKey, getSettingsFile, saveApiKey } from "./utils/file.utils.js";
import rl from "./utils/readline.utils.js";


const main = async () => {
    const settings = await getSettingsFile();

    if (!settings.apiKey) {

        const key = await rl.question("Please enter your API key: ");
        await saveApiKey(key);
    }

    const res = await getApiKey();

    if (res.error) {
        console.log(res.error);
        
        const apiKey = await rl.question("Please enter your api key: ")
        await saveApiKey(apiKey)
        return main()
    }
    const apiKey = res.apiKey;

    rl.close();
}

export default main;