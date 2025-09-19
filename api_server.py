"""
AI21 Maestro + Bright Data API Server
====================================

FastAPI server that exposes Maestro functionality with Bright Data web access.
Perfect for building web UIs and integrations on top of AI agents!

Features:
- Configurable AI assistant personalities
- Multiple Maestro parameters (budget, models, etc.)
- Bright Data web scraping tools (free + pro)
- Real-time execution with polling
- CORS enabled for web UI integration

Usage:
1. Set API keys in .env file
2. Run: uvicorn api_server:app --reload
3. Visit: http://localhost:8000/docs for API documentation
4. Build your web UI on top of these endpoints!
"""

from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from ai21 import AsyncAI21Client
from ai21.types import NOT_GIVEN
from dotenv import load_dotenv
import os
import uuid
from datetime import datetime

load_dotenv()

# FastAPI app setup
app = FastAPI(
    title="AI21 Maestro + Bright Data API",
    description="Build AI agents with web access through Bright Data tools",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Enable CORS for web UI integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure this for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global storage for runs (use Redis/DB in production)
active_runs: Dict[str, Dict] = {}

# Pydantic Models
class MaestroMessage(BaseModel):
    role: str = Field(..., description="Message role (user, assistant, system)")
    content: str = Field(..., description="Message content")

class Requirement(BaseModel):
    name: str = Field(..., description="Requirement name/identifier")
    description: str = Field(..., description="Requirement description")
    is_mandatory: bool = Field(default=True, description="Whether requirement is mandatory")

class MaestroRequest(BaseModel):
    # Core parameters
    input: str | List[MaestroMessage] = Field(..., description="User query or conversation messages")
    
    # AI Assistant Configuration
    assistant_name: str = Field(default="web_researcher", description="Assistant identifier")
    assistant_personality: str = Field(
        default="You are a helpful AI assistant with access to web data tools. Use them to provide accurate, up-to-date information.",
        description="Assistant personality and behavior instructions"
    )
    
    # Maestro Settings
    budget: str = Field(default="medium", description="Computation budget: low, medium, high")
    models: Optional[List[str]] = Field(default=None, description="Specific models to use (optional)")
    response_language: Optional[str] = Field(default=None, description="Response language (optional)")
    
    # Bright Data Configuration
    use_pro_tools: bool = Field(default=True, description="Enable Pro tools (&pro=1)")
    
    # Additional Requirements
    extra_requirements: List[Requirement] = Field(default=[], description="Additional requirements")
    
    # Execution Options
    poll_for_completion: bool = Field(default=True, description="Wait for completion vs return immediately")

class MaestroResponse(BaseModel):
    run_id: str = Field(..., description="Unique run identifier")
    status: str = Field(..., description="Run status")
    result: Optional[str] = Field(default=None, description="Final result (if completed)")
    created_at: datetime = Field(..., description="Creation timestamp")
    completed_at: Optional[datetime] = Field(default=None, description="Completion timestamp")
    config: Dict[str, Any] = Field(..., description="Run configuration used")

class RunStatus(BaseModel):
    run_id: str
    status: str
    result: Optional[str] = None
    created_at: datetime
    completed_at: Optional[datetime] = None

# Helper Functions
def get_ai21_client():
    """Get AI21 client with API key validation"""
    api_key = os.getenv("AI21_LABS_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="AI21_LABS_KEY not found in environment")
    return AsyncAI21Client(api_key=api_key)

def get_brightdata_token():
    """Get Bright Data token with validation"""
    token = os.getenv("BRIGHTDATA_TOKEN")
    if not token:
        raise HTTPException(status_code=500, detail="BRIGHTDATA_TOKEN not found in environment")
    return token

async def execute_maestro_run(run_id: str, request: MaestroRequest):
    """Execute Maestro run asynchronously"""
    try:
        client = get_ai21_client()
        brightdata_token = get_brightdata_token()
        
        # Build requirements
        requirements = [
            {
                "name": request.assistant_name,
                "description": request.assistant_personality,
                "is_mandatory": True
            }
        ]
        
        # Add extra requirements
        for req in request.extra_requirements:
            requirements.append({
                "name": req.name,
                "description": req.description,
                "is_mandatory": req.is_mandatory
            })
        
        # Build Bright Data server URL
        server_url = f"https://mcp.brightdata.com/mcp?token={brightdata_token}"
        if request.use_pro_tools:
            server_url += "&pro=1"
        
        # Prepare input
        if isinstance(request.input, str):
            input_messages = [{"role": "user", "content": request.input}]
        else:
            input_messages = [msg.model_dump() for msg in request.input]
        
        # Update run status
        active_runs[run_id]["status"] = "running"
        
        # Execute Maestro run
        if request.poll_for_completion:
            run = await client.beta.maestro.runs.create_and_poll(
                input=input_messages,
                tools=[{
                    "type": "mcp",
                    "server_url": server_url,
                    "server_label": "Bright Data Web Access",
                }],
                budget=request.budget,
                models=request.models if request.models else NOT_GIVEN,
                requirements=requirements,
                response_language=request.response_language if request.response_language else NOT_GIVEN,
                poll_timeout_sec=240
            )
            
            # Update with results
            active_runs[run_id].update({
                "status": "completed",
                "result": run.result,
                "completed_at": datetime.now(),
                "maestro_run_id": run.id
            })
        else:
            run = await client.beta.maestro.runs.create(
                input=input_messages,
                tools=[{
                    "type": "mcp",
                    "server_url": server_url,
                    "server_label": "Bright Data Web Access",
                }],
                budget=request.budget,
                models=request.models if request.models else NOT_GIVEN,
                requirements=requirements,
                response_language=request.response_language if request.response_language else NOT_GIVEN,
            )
            
            active_runs[run_id].update({
                "status": "submitted",
                "maestro_run_id": run.id
            })
            
    except Exception as e:
        active_runs[run_id].update({
            "status": "failed",
            "result": f"Error: {str(e)}",
            "completed_at": datetime.now()
        })

# API Endpoints

@app.get("/")
async def root():
    """API health check and information"""
    return {
        "message": "AI21 Maestro + Bright Data API Server",
        "version": "1.0.0",
        "docs": "/docs",
        "endpoints": {
            "run_agent": "POST /run",
            "get_status": "GET /status/{run_id}",
            "list_runs": "GET /runs",
            "tools_info": "GET /tools"
        }
    }

@app.post("/run", response_model=MaestroResponse)
async def run_agent(request: MaestroRequest, background_tasks: BackgroundTasks):
    """
    Run an AI agent with Bright Data web access
    
    This endpoint creates and executes an AI agent with the specified configuration.
    The agent will have access to Bright Data's web scraping tools for real-time data.
    """
    
    # Generate unique run ID
    run_id = str(uuid.uuid4())
    
    # Store run info
    run_info = {
        "run_id": run_id,
        "status": "starting",
        "result": None,
        "created_at": datetime.now(),
        "completed_at": None,
        "config": request.model_dump()
    }
    active_runs[run_id] = run_info
    
    # Handle poll_for_completion
    if request.poll_for_completion:
        # Execute synchronously and wait for completion
        await execute_maestro_run(run_id, request)
        # Return completed response
        return MaestroResponse(**active_runs[run_id])
    else:
        # Execute asynchronously
        background_tasks.add_task(execute_maestro_run, run_id, request)
        # Return immediate response
        return MaestroResponse(**run_info)

@app.get("/status/{run_id}", response_model=RunStatus)
async def get_run_status(run_id: str):
    """Get the status and results of a specific run"""
    
    if run_id not in active_runs:
        raise HTTPException(status_code=404, detail="Run not found")
    
    run_info = active_runs[run_id]
    return RunStatus(**run_info)

@app.get("/runs")
async def list_runs():
    """List all runs with their current status"""
    
    return {
        "total_runs": len(active_runs),
        "runs": [
            {
                "run_id": run_id,
                "status": info["status"],
                "created_at": info["created_at"],
                "completed_at": info.get("completed_at")
            }
            for run_id, info in active_runs.items()
        ]
    }

@app.delete("/runs/{run_id}")
async def delete_run(run_id: str):
    """Delete a run from memory"""
    
    if run_id not in active_runs:
        raise HTTPException(status_code=404, detail="Run not found")
    
    del active_runs[run_id]
    return {"message": f"Run {run_id} deleted successfully"}

@app.get("/tools")
async def get_tools_info():
    """Get information about available Bright Data tools"""
    
    return {
        "rapid_tools": {
            "description": "Free tools available in Rapid mode",
            "tools": [
                {
                    "name": "search_engine",
                    "description": "Scrape search results from Google, Bing or Yandex"
                },
                {
                    "name": "scrape_as_markdown", 
                    "description": "Scrape any webpage as clean markdown"
                }
            ]
        },
        "pro_tools": {
            "description": "Advanced tools available in Pro mode (&pro=1)",
            "categories": {
                "e_commerce": [
                    "web_data_amazon_product", "web_data_amazon_product_reviews", 
                    "web_data_walmart_product", "web_data_ebay_product",
                    "web_data_homedepot_products", "web_data_zara_products",
                    "web_data_etsy_products", "web_data_bestbuy_products"
                ],
                "social_media": [
                    "web_data_linkedin_person_profile", "web_data_linkedin_company_profile",
                    "web_data_instagram_profiles", "web_data_instagram_posts",
                    "web_data_facebook_posts", "web_data_x_posts",
                    "web_data_tiktok_profiles", "web_data_tiktok_posts"
                ],
                "business_intelligence": [
                    "web_data_zoominfo_company_profile", "web_data_crunchbase_company",
                    "web_data_linkedin_job_listings", "web_data_linkedin_people_search"
                ],
                "content_media": [
                    "web_data_youtube_videos", "web_data_youtube_profiles",
                    "web_data_reddit_posts", "web_data_github_repository_file"
                ],
                "browser_automation": [
                    "scraping_browser_navigate", "scraping_browser_click",
                    "scraping_browser_type", "scraping_browser_screenshot"
                ]
            }
        }
    }

class QuickRunRequest(BaseModel):
    query: str = Field(..., description="Your question or task")
    personality: str = Field(default="helpful", description="Assistant personality: helpful, sarcastic, technical, creative")
    budget: str = Field(default="medium", description="Budget: low, medium, high")
    use_pro: bool = Field(default=True, description="Use Pro tools")

@app.post("/quick-run")
async def quick_run(request: QuickRunRequest, background_tasks: BackgroundTasks):
    """
    Quick run endpoint for simple queries
    
    Simplified endpoint for basic use cases - just provide a query and go!
    """
    
    personalities = {
        "helpful": "You are a helpful AI assistant with access to web data tools. Use them to provide accurate, up-to-date information.",
        "sarcastic": "You are a sarcastic AI assistant with web access. Answer questions accurately but with witty commentary.",
        "technical": "You are a technical AI assistant with web access. Provide detailed, technical answers with data and sources.",
        "creative": "You are a creative AI assistant with web access. Provide imaginative and engaging responses while staying factual."
    }
    
    maestro_request = MaestroRequest(
        input=request.query,
        assistant_personality=personalities.get(request.personality, personalities["helpful"]),
        budget=request.budget,
        use_pro_tools=request.use_pro,
        poll_for_completion=True
    )
    
    return await run_agent(maestro_request, background_tasks)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("api_server:app", host="0.0.0.0", port=8000, reload=True)