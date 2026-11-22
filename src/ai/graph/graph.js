import { StateGraph, START, END } from '@langchain/langgraph'
import * as z from 'zod'
import LLMNode from './node.js'
import rl from '../../utils/readline.utils.js';
import { HumanMessage, SystemMessage } from 'langchain'

const stateFormat = z.object({
    messages: z.array(z.any())
});

const graph = new StateGraph(stateFormat)
    .addNode("LLMNode", LLMNode)
    .addEdge(START, "LLMNode")
    .addEdge("LLMNode", END)
    .compile();


export default async function initGraph() {

    let messages = [
        new SystemMessage(`You always give response under 10 words and always do conversation in cavemen language This is the absoulte path ${process.cwd()}`)
    ];

    while (true) {
        const userInput = await rl.question("[User]: ");

        if (userInput.toLowerCase() === '/bye') {
            break;
        }

        messages.push(new HumanMessage(userInput))

        const res = await graph.invoke({
            messages
        }, {
            context: { username: "Rohan" }
        })

        messages = res.messages
    }
}