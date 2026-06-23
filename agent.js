
import { writeFileSync } from "fs"
import * as readline from "node:readline/promises"
import { ChatGroq } from "@langchain/groq"
import { createReactAgent } from "@langchain/langgraph/prebuilt"
import "dotenv/config"
import { TavilySearch } from "@langchain/tavily";
import { tool } from "langchain";
import z from "zod"


async function main() {
    const model = new ChatGroq({
        model: "openai/gpt-oss-120b",
        temperature: 0,
    })
    const search = new TavilySearch({
        maxResults: 5,
        topic: "general",
    });

    const calendatEvents = tool(
        async ({ query }) => {
            //google calendar logic goes here
            return JSON.stringify([{
                title: "meeting with joy",
                time: "2 PM",
                location: "Gmeet"
            }])
        },
        {
            name: "get-calendar-events",
            description: "call to get calendar events",
            schema: z.object({
                query: z.string().describe("the query to use in calendar event search")
            })
        }
    )

    const agent = createReactAgent({
        llm: model,
        tools: [search, calendatEvents]
    })

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    })

    while (true) {
        const userQuery = await rl.question("You: ")
        if (userQuery === "/bye") break;
        const result = await agent.invoke({
            messages: [
                {
                    role: "system",
                    content: `You are a personal assistant. Use provided tools to get the information if
                    you don't know the answer. Current date and time: ${new Date().toLocaleString()}.`
                },
                {
                    role: "human",
                    content: userQuery
                }
            ]
        })
        console.log("Assistant:", result.messages[result.messages.length - 1].content)

    }

    rl.close()

    const drawableGraph = await agent.getGraphAsync()
    const graphStateImage = await drawableGraph.drawMermaidPng()
    const graphStateArrayBuffer = await graphStateImage.arrayBuffer()

    const filePath = "./graphStateImage.png"
    writeFileSync(filePath, new Uint8Array(graphStateArrayBuffer))
}

main()