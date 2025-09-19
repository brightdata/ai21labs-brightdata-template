"""
AI21 Maestro + Bright Data Hackathon Template
============================================

This template gives you AI agents with web access through Bright Data.
Perfect for building AI applications that need real-time web data!

Quick Start:
1. Set your API keys in .env file
2. Customize the configuration below
3. Run: python demo.py

Built for hackathons - fork and build amazing things! 🚀
"""

from ai21 import AsyncAI21Client
from ai21.types import NOT_GIVEN
from dotenv import load_dotenv
import os

load_dotenv()

# HACKATHON CONFIGURATION - Customize these!
# ============================================

# Your AI Assistant Setup
USER_QUERY = "Who is meir Kadosh and what is his role at Bright Data?"
ASSISTANT_PERSONALITY = "You are a helpful AI assistant with access to web data tools. Use them to provide accurate, up-to-date information."
ASSISTANT_NAME = "web_researcher"

# Maestro Settings
BUDGET = "medium"  # Options: "low", "medium", "high"
MODELS = None  # Use default models, or specify: ["jamba-1.5-large", "jamba-1.5-mini"]
RESPONSE_LANGUAGE = NOT_GIVEN  # e.g., "spanish", "french", or None for auto-detect

# Advanced: Additional requirements (optional)
EXTRA_REQUIREMENTS = [
    # Add more requirements here if needed
    # {
    #     "name": "output_format",
    #     "description": "Always format responses as JSON",
    #     "is_mandatory": False
    # }
]


async def main():
    """
    Main function - the magic happens here!
    Maestro orchestrates AI agents with web access via Bright Data.
    """
    
    # Initialize AI21 client
    client = AsyncAI21Client(api_key=os.getenv("AI21_LABS_KEY"))
    brightdata_token = os.getenv("BRIGHTDATA_TOKEN")
    
    if not brightdata_token:
        print("❌ BRIGHTDATA_TOKEN not found in .env file!")
        return
    
    # Build requirements list
    requirements = [
        {
            "name": ASSISTANT_NAME,
            "description": ASSISTANT_PERSONALITY,
            "is_mandatory": True
        }
    ] + EXTRA_REQUIREMENTS
    
    print("Starting AI agent with web access...")
    print(f"Query: {USER_QUERY}")
    print(f"Assistant: {ASSISTANT_NAME}")
    print(f"Budget: {BUDGET}")
    print("-" * 50)
    
    # Create and run the AI agent
    run = await client.beta.maestro.runs.create_and_poll(
        input=[
            {
                "role": "user", 
                "content": USER_QUERY
            }
        ],
        tools=[
            {
                "type": "mcp",
                "server_url": f"https://mcp.brightdata.com/mcp?token={brightdata_token}&pro=1",
                "server_label": "Bright Data Web Access",
            },
        ],
        budget=BUDGET,
        models=MODELS,
        requirements=requirements,
        response_language=RESPONSE_LANGUAGE,
    )
    
    print(f"Run ID: {run.id}")
    print(f"Result:\n{run.result}")


# HACKATHON IDEAS - Build on this template!
# ===========================================
"""
💡 What can you build with Bright Data's tools?

🆓 FREE TOOLS (Rapid Mode):
1. 🔍 Universal Web Scraper
   - `search_engine`: Scrape Google, Bing, Yandex results
   - `scrape_as_markdown`: Turn any webpage into clean markdown

💎 PRO TOOLS (Add &pro=1 to unlock):
2. 🛒 E-commerce Intelligence
   - Amazon products, reviews, search results
   - Walmart, eBay, Home Depot, Zara, Etsy, Best Buy data
   - Price monitoring & competitor analysis

3. 📱 Social Media Analytics  
   - LinkedIn profiles, posts, job listings, people search
   - Instagram profiles, posts, reels, comments
   - Facebook posts, marketplace, company reviews
   - TikTok profiles, posts, shop data, comments
   - X (Twitter) posts and engagement

4. 🏢 Business Intelligence
   - LinkedIn company profiles & employee data
   - ZoomInfo company insights
   - Crunchbase startup data
   - Lead generation & market research

5. 📍 Local Business Data
   - Google Maps reviews and business info
   - Facebook events and local insights
   - Location-based market analysis

6. 📊 Financial & News Data
   - Yahoo Finance business data
   - Reuters news articles
   - Stock analysis & market sentiment

7. 📱 App Store Intelligence
   - Google Play Store app data
   - Apple App Store analytics
   - App performance tracking

8. 🎯 Content & Media Analysis
   - YouTube videos, profiles, comments
   - Reddit posts and discussions
   - GitHub repository analysis
   - Google Shopping product data

9. 🤖 Browser Automation (Advanced)
   - Full browser control with navigation, clicking, typing
   - Screenshots and HTML extraction
   - Complex workflow automation

Ready to hack? Pick your tools and start building! 🚀
"""

if __name__ == "__main__":
    import asyncio
    asyncio.run(main())