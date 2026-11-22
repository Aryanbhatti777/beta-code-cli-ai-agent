import { StateGraph, START, END } from '@langchain/langgraph'
import * as z from 'zod'
import LLMNode from './node.js'
import rl from '../utils/readline.utils.js';
import { HumanMessage } from 'langchain'

const stateFormat = z.object({
    messages: z.array(z.any())
});

const graph = new StateGraph(stateFormat)
    .addNode("LLMNode", LLMNode)
    .addEdge(START, "LLMNode")
    .addEdge("LLMNode", END)
    .compile();

    
export default async function initGraph() {

    let messages = [];
    
    while (true) {
        const userInput = await rl.question("[User]: ");

        messages.push(new HumanMessage(userInput))

        const res = await graph.invoke({
            messages
        })

        messages = res.messages
    }
}