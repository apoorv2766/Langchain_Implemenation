# LangChain Personal Assistant Agent

A conversational AI personal assistant built with LangChain, LangGraph, and Groq LLM. The agent can search the web and access calendar information in response to natural language queries.

## Features

- **Groq LLM Integration**: Uses Groq's fast inference engine (OpenAI-compatible `gpt-oss-120b` model)
- **Web Search**: Powered by Tavily Search API
- **Calendar Events**: Custom tool to query upcoming meetings
- **Interactive CLI**: Chat with the assistant in real-time
- **Graph Visualization**: Automatically generates a Mermaid diagram of the agent workflow
- **Multi-turn Conversations**: Maintains context across multiple exchanges

## Tech Stack

- **LangChain**: Core framework for building with LLMs
- **LangGraph**: Orchestration for agent workflows (ReAct pattern)
- **Groq**: High-speed LLM inference
- **Tavily**: Web search integration
- **Node.js 24.16+**: ESM-based runtime
- **Zod**: Schema validation

## Setup

### Prerequisites

- Node.js 24.16 or later
- npm or yarn

### Installation

1. Clone the repository and navigate to the project directory:
   ```bash
   cd langchain_project
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with your API keys:
   ```env
   GROQ_API_KEY=your_groq_api_key_here
   TAVILY_API_KEY=your_tavily_api_key_here
   ```

## Usage

### Start Interactive Chat

```bash
npm start
```

or

```bash
node --env-file=.env agent.js
```

In the interactive session:
- Type any query to ask the assistant
- The agent will use available tools (search, calendar) to answer
- Type `/bye` to exit and generate the workflow diagram

### Output

The agent generates:
- **Console Output**: Real-time assistant responses
- **graphStateImage.png**: A Mermaid diagram visualizing the agent's internal workflow

## Project Structure

```
langchain_project/
├── agent.js              # Main agent implementation
├── agents.js             # Alias entry point
├── package.json          # Dependencies and scripts
├── .env                  # API keys (not committed)
├── .env.example          # Example environment variables
└── README.md             # This file
```

## Available Tools

### 1. Tavily Search
Performs web searches for general information queries.

### 2. Calendar Events
Returns upcoming meetings (currently mocked; integrate with Google Calendar or similar).

```javascript
const calendatEvents = tool(
    async ({ query }) => {
        // Returns meetings matching the query
    },
    {
        name: "get-calendar-events",
        description: "Call to get calendar events",
        schema: z.object({
            query: z.string().describe("the query to use in calendar event search")
        })
    }
)
```

## Agent Architecture

The agent uses the **ReAct (Reasoning + Acting)** pattern:

1. **Reasoning**: The LLM analyzes the user query
2. **Action**: Decides which tools to invoke (search, calendar, or direct response)
3. **Observation**: Processes tool outputs
4. **Looping**: Repeats until the final answer is ready

This is implemented via LangGraph's `createReactAgent` prebuilt graph.

## Example Conversation

```
You: what is the weather in San Francisco?
Assistant: [Uses Tavily to search weather] It's currently 65°F and foggy in San Francisco...

You: do i have any meetings?
Assistant: [Uses calendar tool] You have one meeting with Joy at 2 PM in Google Meet.

You: /bye
```

After exiting, `graphStateImage.png` is generated showing the agent's state machine.

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GROQ_API_KEY` | API key for Groq LLM | Yes |
| `TAVILY_API_KEY` | API key for Tavily Search | Yes |

## Development

### Adding New Tools

To add a custom tool, use the LangChain `tool` function:

```javascript
import { tool } from "langchain";
import z from "zod";

const myTool = tool(
    async ({ param }) => {
        // Implementation
        return "result";
    },
    {
        name: "my-tool",
        description: "Description of what the tool does",
        schema: z.object({
            param: z.string().describe("Parameter description")
        })
    }
);

// Add to agent tools array
const agent = createReactAgent({
    llm: model,
    tools: [search, calendatEvents, myTool]
});
```

### Running Tests

Currently no test suite is configured. To add tests:

```bash
npm test
```

## API Keys

- **Groq**: Sign up at https://console.groq.com/
- **Tavily**: Sign up at https://tavily.com/

## Troubleshooting

### Module not found errors
Ensure all dependencies are installed:
```bash
npm install
```

### API key errors
Verify your `.env` file has the correct keys with no extra whitespace.

### Readline issues
This project uses Node.js `readline/promises` for ESM compatibility. Ensure Node.js 24.16+ is installed.

## Notes

- The calendar events tool is currently mocked; to use real calendar data, integrate with Google Calendar API or similar
- The agent's system prompt can be customized in the `main()` function
- Mermaid visualization is automatically saved to `graphStateImage.png` on exit

## License

ISC

## Author

Created with LangChain and LangGraph
