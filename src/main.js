import initGraph from "./ai/graph/graph.js";
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
        console.log(res.error.message);

        const apiKey = await rl.question("Please enter your api key: ")
        await saveApiKey(apiKey)
        return main()
    }
    const apiKey = res.apiKey;

    await initGraph();

    rl.close();
}

export default main;