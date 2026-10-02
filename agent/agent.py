import asyncio
import os
import sys
from urllib.parse import urlparse, urlunparse
import httpx
from dotenv import load_dotenv
from agents import Agent, Runner, OpenAIChatCompletionsModel
from agents.mcp import MCPServerStreamableHttp, create_static_tool_filter
from openai import AsyncOpenAI

load_dotenv()

MCP_URL = os.environ["SANITY_CONTEXT_MCP_URL"]
API_TOKEN = os.environ["SANITY_ORGANIZATION_TOKEN"]

groq_client = AsyncOpenAI(
    base_url="https://api.groq.com/openai/v1",
    api_key=os.environ["OPENAI_API_KEY"],
)


def divider(char="─", length=70):
    print(char * length)


def print_header(text):
    divider("═")
    print(f"  {text}")
    divider("═")


def print_response(text):
    print()
    divider()
    print("  AGENT RESPONSE")
    divider()
    print()
    print(text)
    print()
    divider()


async def main():
    async with httpx.AsyncClient() as http:
        # 1. Fetch initial context
        parsed = urlparse(MCP_URL)
        initial_context_url = urlunparse(
            parsed._replace(path=parsed.path.rstrip("/") + "/initial-context")
        )

        resp = await http.get(
            initial_context_url,
            headers={"Authorization": f"Bearer {API_TOKEN}"},
        )
        resp.raise_for_status()
        initial_context = resp.text

        # 2. Connect to MCP
        async with MCPServerStreamableHttp(
            name="sanity",
            params={
                "url": MCP_URL,
                "headers": {"Authorization": f"Bearer {API_TOKEN}"},
            },
            tool_filter=create_static_tool_filter(
                blocked_tool_names=["initial_context"]
            ),
        ) as server:
            agent = Agent(
                name="TrueSpecs Assistant",
                instructions=(
                    "You are TrueSpecs, a game compatibility assistant. "
                        "Use the provided tools to answer questions about whether games "
                        "will run on specific hardware configurations, based on structured "
                        "user reports and official specs.\n\n"
                        "Rules:\n"
                        "- Output PLAIN TEXT only. No Markdown. No asterisks. No tables.\n"
                        "- Use simple line breaks and indentation for structure.\n"
                        "- Always cite the source of your information.\n"
                        "- If the data conflicts, show both sides.\n"
                        "- Never guess. If there is no data, say so.\n"
                        "- Be concise. Lead with the answer, then the evidence.\n\n"
                        f"# Data Reference\n{initial_context}"
                ),
                mcp_servers=[server],
                model=OpenAIChatCompletionsModel(
                    model="openai/gpt-oss-120b",
                    openai_client=groq_client,
                ),
            )

            # 3. Question loop
            print_header("TrueSpecs Agent")
            print("Type a question about a game. Type 'quit' to exit.")
            print()
            print("Example: Will GTA Vice City run on a 4GB RAM laptop with Intel HD 620?")
            print()

            while True:
                try:
                    question = input("> ").strip()
                except (EOFError, KeyboardInterrupt):
                    print("\nExiting.")
                    break

                if not question:
                    continue

                if question.lower() in ("quit", "exit", "q"):
                    print("Exiting.")
                    break

                print("\nThinking...\n")

                try:
                    result = await Runner.run(agent, question)
                    print_response(result.final_output)
                except Exception as e:
                    print(f"Error: {e}")
                    print()


if __name__ == "__main__":
    asyncio.run(main())
