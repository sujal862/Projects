from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Set
import re

app = FastAPI(title="Agent Discovery and Usage Platform")

# In-memory databases
# agents_db stores agent details by name
agents_db: Dict[str, dict] = {}
# usage_db tracks total units consumed by each target agent
usage_db: Dict[str, int] = {}  
# processed_requests keeps track of request_ids to prevent double counting
processed_requests: Set[str] = set()

# Pydantic models for request validation
class AgentCreate(BaseModel):
    name: str
    description: str
    endpoint: str

class UsageLog(BaseModel):
    caller: str
    target: str
    units: int
    request_id: str

# Helper function for the Bonus Feature
def extract_tags(description: str) -> List[str]:
    """
    Simple keyword extraction from description
    """
    clean_text = re.sub(r'[^\w\s]', '', description.lower())
    words = clean_text.split()
    
    stop_words = {"from", "a", "an", "the", "and", "or", "to", "is", "in", "it", "with", "for", "of"}
    # Use set to remove duplicates, then filter out stop words and tiny words
    tags = list(set([word for word in words if word not in stop_words and len(word) > 2]))
    return tags


@app.post("/agents")
def create_agent(agent: AgentCreate):
    if agent.name in agents_db:
        raise HTTPException(status_code=400, detail="Agent with this name already exists")
    
    # Auto-generate tags from the description
    tags = extract_tags(agent.description)
    
    agents_db[agent.name] = {
        "name": agent.name,
        "description": agent.description,
        "endpoint": agent.endpoint,
        "tags": tags
    }
    
    # Initialize the usage counter for the new agent
    usage_db[agent.name] = 0
    
    return {"message": "Agent registered successfully", "agent": agents_db[agent.name]}


@app.get("/agents")
def list_agents():
    # Return all agents as a list
    return {"agents": list(agents_db.values())}


@app.get("/search")
def search_agents(q: str):
    q_lower = q.lower()
    results = []
    
    # Search through both name and description
    for agent in agents_db.values():
        if (
            q_lower in agent["name"].lower()
            or q_lower in agent["description"].lower()
            or any(q_lower in tag for tag in agent.get("tags", []))
        ):
            results.append(agent)
            
    return {"results": results}


@app.post("/usage")
def log_usage(log: UsageLog):
    # Avoid duplicate requests
    if log.request_id in processed_requests:
        return {"message": "Usage already logged for this request_id - ignoring duplicate"}

    if log.caller not in agents_db:
        raise HTTPException(status_code=404, detail=f"Caller agent '{log.caller}' not found")
    
    # Check target exists
    if log.target not in agents_db:
        raise HTTPException(status_code=404, detail=f"Target agent '{log.target}' not found")
    
    # Update State: Process the usage
    usage_db[log.target] += log.units
    processed_requests.add(log.request_id)
    
    return {"message": "Usage logged successfully"}


@app.get("/usage-summary")
def get_usage_summary():
    return {"usage": usage_db}
