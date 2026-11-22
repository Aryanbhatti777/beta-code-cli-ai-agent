import { tool } from "langchain";
import * as z from 'zod'
import fs from'fs/promises'

export const upsertFilesTool = tool(

    async function ({ files }) {
        await Promise.all(files.map(async file => {
            return await fs.writeFile(file.path, file.content)
        }))
        return "file created successfully"
    },
    {
        name: "upsertFiles",
        description: "Create/Update multiple files at once (create if not exist)",
        schema: z.object({
            files: z.array(z.object({
                path: z.string().describe("Absolute path of the file to be create/update"),
                content: z.string().describe("Content of the file to be created/updated")
            }))
        })
    }
)