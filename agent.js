
import { writeFileSync } from "fs"
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

    const result = await agent.invoke({
        messages: [
            {
                role: "human",
                content: "hi do i have any meeting?"
            }
        ]
    })

    const drawableGraph = await agent.getGraphAsync()
    const graphStateImage = await drawableGraph.drawMermaidPng()
    const graphStateArrayBuffer = await graphStateImage.arrayBuffer()

    const filePath = "./graphStateImage.png"
    writeFileSync(filePath, new Uint8Array(graphStateArrayBuffer))
    console.log("Assistant:", result)
}

main()