import fs from 'fs/promises'
import { CONFIG_DIR, HOME_DIR } from './constant.utils.js'
import path from 'path'
import axios from 'axios'


export const getSettingsFile = async () => {

    try {
        
        await fs.access(CONFIG_DIR)
    } catch (error) {
        await fs.mkdir(CONFIG_DIR, { recursive: true });
    }

    const settingsFilePath = path.join(CONFIG_DIR, 'settings.json');

    try {
        await fs.access(settingsFilePath);
        const content = await fs.readFile(settingsFilePath, 'utf-8');
        return JSON.parse(content);
    } catch (error) {
        await fs.writeFile(settingsFilePath, JSON.stringify({}));
        return {}
    }
}

export const saveApiKey = async (key) => {

    const settingsFilePath = path.join(CONFIG_DIR, 'settings.json');
    const settingsContent = await getSettingsFile();

    await fs.writeFile(settingsFilePath, JSON.stringify({
        ...settingsContent,
        apiKey: key
    }))
}

export const getApiKey = async () => {

    const settings = await getSettingsFile();
    const apiKey = settings.apiKey || null

    if (!apiKey) {
        throw new Error("API key not found in settings file");
    }

    try {
        
        const res = await axios.get("https://api.groq.com/openai/v1/models", {
            headers: {
                "Authorization": `Bearer ${apiKey}`
            }
        })

        return { apiKey }
        
    } catch (error) {

        return {
            error
        }
    }
}