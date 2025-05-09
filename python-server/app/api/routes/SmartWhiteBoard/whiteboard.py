from dotenv import load_dotenv
import os
import asyncio
import uuid
import json
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, HTTPException
from pydantic import BaseModel
import math
from groq import Groq

load_dotenv()

# Configure Livekit (keeping this as it was in the original)
livekit_url = os.getenv("LIVEKIT_URL")
livekit_api_key = os.getenv("LIVEKIT_API_KEY")
livekit_api_secret = os.getenv("LIVEKIT_API_SECRET")

# Configure Groq
groq_api_key = os.getenv("GROQ_API_KEY")
if not groq_api_key:
    raise ValueError("GROQ_API_KEY not found in environment variables.")
groq_client = Groq(api_key=groq_api_key)

# Create router instead of app
router = APIRouter()

class DiagramRequest(BaseModel):
    prompt: str

# In-memory stores
diagram_results: dict[str, list[dict]] = {}
connected_websockets: dict[str, WebSocket] = {}

@router.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: str):
    print(f"[Backend WS] Connection for client_id={client_id}")
    await websocket.accept()
    connected_websockets[client_id] = websocket

    if client_id in diagram_results:
        print(f"[Backend WS] Sending cached to {client_id}")
        await websocket.send_json(diagram_results[client_id])

    try:
        while True:
            msg = await websocket.receive_text()
            print(f"[Backend WS] Received {msg} from {client_id}")
            if msg == "ping":
                await websocket.send_text("pong")
            await asyncio.sleep(0.1)
    except WebSocketDisconnect:
        print(f"[Backend WS] {client_id} disconnected")
        connected_websockets.pop(client_id, None)
    except Exception as e:
        print(f"[Backend WS] Error for {client_id}: {e}")
        connected_websockets.pop(client_id, None)


async def generate_diagram_with_groq(prompt: str) -> list[dict]:
    """Generate diagram shapes using Groq's API"""
    print(f"[Backend] Generating diagram with Groq for prompt: {prompt}")

    # Updated system prompt with emphasis on proper shapes and colors
    system_prompt_content = """
    You are a diagram generation assistant. Create a visually appealing diagram based on the user's prompt.
    Your output must be a valid JSON array of shapes that can be rendered by tldraw.

    Each shape should have the following structure:
    {
      "id": "shape:unique_id",
      "typeName": "shape",
      "type": "geo",
      "x": number,
      "y": number,
      "rotation": 0,
      "isLocked": false,
      "opacity": 1,
      "index": "a1", (or a2, a3, etc.)
      "parentId": "page:page",
      "props": {
        "geo": "rectangle|oval|diamond|triangle|hexagon|cloud",
        "w": number, // Adjust width based on text content length (min 100, add 20px per character over 10)
        "h": number, // Adjust height based on text content (min 50, add 10px per line)
        "text": "Text content",
        "color": "black|grey|light-violet|violet|blue|light-blue|yellow|orange|green|light-green|light-red|red|white",
        "labelColor": "black",
        "size": "m",
        "font": "draw",
        "align": "middle",
        "verticalAlign": "middle",
        "fill": "solid",
        "dash": "draw",
        "url": "",
        "growY": 0,
        "scale": 1
      }
    }

    IMPORTANT GUIDELINES FOR BETTER DIAGRAMS:

    1. Use appropriate shape types based on function:
       - Ovals for start/end nodes
       - Rectangles for process steps
       - Diamonds for decision points
       - Clouds for external inputs/systems
       - Hexagons for preparation steps
       - Triangles for warnings or important notes

    2. Use a variety of colors to make the diagram visually appealing:
       - NEVER use all black shapes
       - Assign different colors to different shapes
       - Use colors that convey meaning: "green" for start, "red" for end, "yellow" for decisions, etc.
       - Valid colors: "black", "grey", "light-violet", "violet", "blue", "light-blue", "yellow", "orange", "green", "light-green", "light-red", "red", "white"

    3. Adjust shape sizes based on content:
       - For text with 1-10 characters: w=120, h=60
       - For text with 11-20 characters: w=180, h=80
       - For text with 21-40 characters: w=240, h=100
       - For text with 41+ characters: w=300, h=120
       - For multi-line text: Add 20px height per additional line

    4. Make shape content descriptive and detailed:
       - For flowcharts: Include specific actions, not just generic labels
       - For decision nodes: Phrase as questions with yes/no outcomes
       - For process nodes: Describe the actual operation being performed
       - For the specific problem in the prompt, include detailed steps that would actually solve the problem
    
    5. Give ample amount of space between shapes
    """

    user_prompt_content = f"""
    Create a colorful and detailed diagram for: "{prompt}"

    Determine if this should be a flowchart, mind map, or org chart based on the prompt.
    Include at least 5-7 shapes with meaningful content related to the prompt.
    Position the shapes appropriately for the diagram type.
    Include a title text shape at the top (y=50, x=400, centered). The title should be the original prompt or a very close summary.

    IMPORTANT:
    1. Use DIFFERENT COLORS for each shape - do not make all shapes the same color
    2. Use APPROPRIATE SHAPE TYPES for each element (oval for start/end, diamond for decisions, etc.)
    3. Make the content DESCRIPTIVE and DETAILED - explain exactly what happens at each step
    4. SIZE SHAPES APPROPRIATELY based on their content length
    5. For flowcharts and sequential diagrams, connect the shapes with arrows

    For each arrow, use this exact format:
    {{
      "id": "shape:arrow-unique_id",
      "typeName": "shape",
      "type": "arrow",
      "x": 200,
      "y": 200,
      "rotation": 0,
      "isLocked": false,
      "opacity": 1,
      "index": "a10",
      "parentId": "page:page",
      "props": {{
        "dash": "draw",
        "size": "m",
        "fill": "none",
        "color": "black",
        "labelColor": "black",
        "bend": 0,
        "start": {{
          "type": "binding",
          "boundShapeId": "shape:source_id",
          "normalizedAnchor": {{"x": 0.5, "y": 1.0}},
          "isExact": false
        }},
        "end": {{
          "type": "binding",
          "boundShapeId": "shape:target_id",
          "normalizedAnchor": {{"x": 0.5, "y": 0.0}},
          "isExact": false
        }},
        "arrowheadStart": "none",
        "arrowheadEnd": "arrow",
        "text": "",
        "font": "draw"
      }}
    }}

    Return ONLY the JSON array of shapes. The output must be a single, valid JSON array.
    """

    messages = [
        {"role": "system", "content": system_prompt_content},
        {"role": "user", "content": user_prompt_content}
    ]

    try:
        # Generate content with Groq
        # Using asyncio.to_thread because the groq client is synchronous
        chat_completion = await asyncio.to_thread(
            groq_client.chat.completions.create,
            messages=messages,
            model="llama3-8b-8192",  # Or "mixtral-8x7b-32768", "llama3-70b-8192", "gemma-7b-it"
            temperature=0.1, # Lower temperature for more deterministic JSON output
            # max_tokens=4096, # Adjust if needed
            response_format={"type": "json_object"} # Request JSON output
        )

        response_content = chat_completion.choices[0].message.content
        
        # Parse the JSON
        # Groq with response_format={"type": "json_object"} should directly return a parsable JSON string
        shapes_data = json.loads(response_content)

        # The JSON object returned by Groq might be a dictionary with a key holding the array,
        # or it might be the array directly. We need to ensure `shapes` is a list.
        if isinstance(shapes_data, dict):
            # Try to find a list within the dictionary, common if the LLM wraps the array
            found_list = False
            for key, value in shapes_data.items():
                if isinstance(value, list):
                    shapes = value
                    found_list = True
                    print(f"[Backend] Extracted list from key '{key}' in Groq's JSON response.")
                    break
            if not found_list:
                raise ValueError("Groq returned a JSON object, but no list of shapes found within it.")
        elif isinstance(shapes_data, list):
            shapes = shapes_data
        else:
            raise ValueError("Groq did not return a JSON list or an object containing a list.")


        # Validate the shapes
        if not isinstance(shapes, list):
            raise ValueError("Groq's response, after parsing, did not result in a list of shapes.")

        # Process and fix arrow shapes if needed (keeping this validation logic)
        processed_shapes = []
        shape_ids = set()

        # First pass: collect all shape IDs and add non-arrow shapes
        for shape in shapes:
            if not isinstance(shape, dict) or not all(key in shape for key in ["id", "typeName", "type"]):
                print(f"[Backend] Skipping invalid shape structure: {shape}")
                continue
            shape_ids.add(shape["id"])
            if shape["type"] != "arrow":
                processed_shapes.append(shape)

        # Second pass: process and add arrow shapes
        for shape in shapes:
            if not isinstance(shape, dict) or shape["type"] != "arrow":
                continue

            valid_arrow = True
            # Check start binding
            start_id = shape.get("props", {}).get("start", {}).get("boundShapeId")
            if not start_id or start_id not in shape_ids:
                print(f"[Backend] Invalid or missing start_id '{start_id}' for arrow {shape.get('id')}. Available IDs: {shape_ids}")
                valid_arrow = False
            
            # Check end binding
            end_id = shape.get("props", {}).get("end", {}).get("boundShapeId")
            if not end_id or end_id not in shape_ids:
                print(f"[Backend] Invalid or missing end_id '{end_id}' for arrow {shape.get('id')}. Available IDs: {shape_ids}")
                valid_arrow = False
            
            if valid_arrow:
                processed_shapes.append(shape)
            else:
                print(f"[Backend] Skipping invalid arrow due to unbound shape: {shape.get('id')}")


        print(f"[Backend] Generated {len(processed_shapes)} shapes with Groq (including validated arrows)")
        return processed_shapes

    except json.JSONDecodeError as e:
        print(f"[Backend] Error decoding JSON from Groq: {e}")
        print(f"[Backend] Groq raw response causing error: {response_content[:500]}...") # Log part of the problematic response
        return generate_diagram_from_prompt(prompt) # Fallback
    except Exception as e:
        print(f"[Backend] Error generating with Groq: {e}")
        # Fallback to the rule-based generation
        return generate_diagram_from_prompt(prompt)

def generate_diagram_from_prompt(prompt: str) -> list[dict]:
    """Fallback method using rule-based generation"""
    print(f"[Backend] Falling back to rule-based generation for prompt: {prompt}")
    keywords = prompt.lower().split()
    shapes: list[dict] = []
    
    # Extract potential entities from the prompt
    entities = [word for word in keywords if len(word) > 3 and word not in 
                ("flow", "diagram", "flowchart", "with", "and", "the", "that", "this", "from", "into", "create", "make", "show")]
    
    # Determine diagram type based on keywords
    is_flowchart = any(k in keywords for k in ("flow", "diagram", "flowchart", "process", "sequence"))
    is_mindmap = any(k in keywords for k in ("mind", "map", "concept", "idea", "brainstorm"))
    
    # Default to flowchart if no specific type is detected
    if not any([is_flowchart, is_mindmap]):
        is_flowchart = True
    
    unique_entities = list(set(entities))[:6] # Limit to 6
    if len(unique_entities) < 2:
        unique_entities = ["Start", "Input", "Process", "Decision", "Output", "End"] # More generic fallback
    
    # Define a list of colors to cycle through
    colors = ["light-blue", "light-green", "yellow", "orange", "light-violet", "light-red", "blue", "green", "violet"]
    
    # Add title shape first
    title_id = f"shape:title-{uuid.uuid4().hex[:6]}"
    shapes.append({
        "id": title_id,
        "typeName": "shape",
        "type": "text",
        "x": 400, 
        "y": 50,
        "rotation": 0, 
        "isLocked": False, 
        "opacity": 1,
        "index": "a0", 
        "parentId": "page:page",
        "props": {
            "text": prompt.capitalize(),
            "color": "black", 
            "size": "l", 
            "font": "draw",
            "textAlign": "middle", 
            "w": 500, 
            "autoSize": True,
            "scale": 1,
        },
    })

    def calculate_shape_size(text):
        """Calculate appropriate width and height based on text content"""
        text_length = len(text)
        lines = text.count('\n') + 1
        
        # Base dimensions
        width = max(180, 120 + (text_length * 5))  # Increase width with text length
        height = max(100, 50 + (lines * 20))       # Increase height with line count
        
        # Cap at reasonable maximums
        width = min(width, 400)
        height = min(height, 200)
        
        return width, height

    if is_flowchart:
        y_pos = 150 # Start below title
        x_start = 400 # Center horizontally
        spacing_y = 100 # Vertical spacing between shapes
        
        for i, entity in enumerate(unique_entities):
            # Choose appropriate shape type based on position and content
            if i == 0:
                geo_type = "oval"
                text = "Start: Initialize variables"
                color = "green"
            elif i == len(unique_entities) - 1:
                geo_type = "oval"
                text = f"End: Display result"
                color = "light-red"
            elif "decision" in entity.lower() or "?" in entity or i == 3:  # Make 4th item a decision by default
                geo_type = "diamond"
                text = f"Decision: Is {entity} valid?"
                color = "yellow"
            else:
                geo_type = "rectangle"
                # Make process steps more descriptive based on position
                if i == 1:
                    text = f"Input: Get {entity} from user"
                    color = "light-blue"
                elif i == 2:
                    text = f"Process: Calculate {entity}"
                    color = "blue"
                else:
                    text = f"Process: Apply {entity} operation"
                    color = colors[i % len(colors)]
            
            # Calculate appropriate size based on text content
            width, height = calculate_shape_size(text)
            if geo_type == "diamond":
                width = max(width, 180)  # Diamonds need more width
                height = max(height, 120)  # Diamonds need more height
            
            current_y = y_pos + i * (height + spacing_y)
            shape_id = f"shape:node-{uuid.uuid4().hex[:6]}"
            
            shapes.append({
                "id": shape_id,
                "typeName": "shape",
                "type": "geo",
                "x": x_start,
                "y": current_y,
                "rotation": 0,
                "isLocked": False,
                "opacity": 1,
                "index": f"a{i+1}",
                "parentId": "page:page",
                "props": {
                    "geo": geo_type,
                    "w": width,
                    "h": height,
                    "text": text,
                    "color": color,
                    "labelColor": "black",
                    "size": "m",
                    "font": "draw",
                    "align": "middle",
                    "verticalAlign": "middle",
                    "fill": "solid",
                    "dash": "draw",
                    "url": "",
                    "growY": 0,
                    "scale": 1,
                }
            })
            
            # Add arrows (basic vertical connection)
            if i > 0:
                arrow_id = f"shape:arrow-{uuid.uuid4().hex[:6]}"
                prev_shape_id = shapes[-2]["id"]  # The previously added shape
                
                # Position arrow connections based on shape types
                start_anchor = {"x": 0.5, "y": 1.0}  # Default: bottom center
                end_anchor = {"x": 0.5, "y": 0.0}    # Default: top center
                
                # Adjust for diamond shapes
                prev_geo_type = shapes[-2]["props"]["geo"]
                if prev_geo_type == "diamond":
                    start_anchor = {"x": 0.5, "y": 0.75}  # Lower point of diamond
                
                if geo_type == "diamond":
                    end_anchor = {"x": 0.5, "y": 0.25}  # Upper point of diamond
                
                shapes.append({
                    "id": arrow_id,
                    "typeName": "shape",
                    "type": "arrow",
                    "x": x_start,
                    "y": current_y - spacing_y / 2,
                    "rotation": 0,
                    "isLocked": False,
                    "opacity": 1,
                    "index": f"az{i}",
                    "parentId": "page:page",
                    "props": {
                        "dash": "draw",
                        "size": "m",
                        "fill": "none",
                        "color": "black",
                        "labelColor": "black",
                        "bend": 0,
                        "start": {
                            "type": "binding", 
                            "boundShapeId": prev_shape_id, 
                            "normalizedAnchor": start_anchor, 
                            "isExact": False
                        },
                        "end": {
                            "type": "binding", 
                            "boundShapeId": shape_id, 
                            "normalizedAnchor": end_anchor, 
                            "isExact": False
                        },
                        "arrowheadStart": "none",
                        "arrowheadEnd": "arrow",
                        "text": "",
                        "font": "draw"
                    }
                })
    elif is_mindmap:
        center_x, center_y = 400, 350 # Below title
        radius = 250
        angle_step = 2 * math.pi / max(1, len(unique_entities)) # Avoid division by zero
        
        for i, entity in enumerate(unique_entities):
            shape_id = f"shape:mind-{uuid.uuid4().hex[:6]}"
            angle = i * angle_step
            x_pos = center_x + radius * math.cos(angle) - 100 # -100 to adjust for shape width/2
            y_pos = center_y + radius * math.sin(angle) - 50  # -50 to adjust for shape height/2
            
            if i == 0 and len(unique_entities) > 1: # Central topic if multiple entities
                x_pos, y_pos = center_x - 100, center_y - 50
            elif len(unique_entities) == 1: # Single entity, center it
                x_pos, y_pos = center_x - 100, center_y - 50


            shapes.append({
                "id": shape_id, "typeName": "shape", "type": "geo",
                "x": x_pos, "y": y_pos,
                "rotation": 0, "isLocked": False, "opacity": 1, "index": f"a{i+1}", "parentId": "page:page",
                "props": {
                    "geo": "oval" if i == 0 and len(unique_entities)>1 else "rectangle", "w": 200, "h": 100,
                    "text": entity.capitalize(), "color": "light-blue", "labelColor": "black",
                    "size": "m", "font": "draw", "align": "middle", "verticalAlign": "middle",
                    "fill": "solid", "dash": "draw", "url": "", "growY": 0, "scale": 1,
                }
            })
            # Add arrows from central topic to others
            if i > 0 and len(unique_entities) > 1:
                central_shape_id = shapes[1]["id"] # Title is shapes[0]
                arrow_id = f"shape:arrow-mind-{uuid.uuid4().hex[:6]}"
                shapes.append({
                    "id": arrow_id, "typeName": "shape", "type": "arrow",
                    "x": (center_x + x_pos + 100) / 2, # Midpoint x
                    "y": (center_y + y_pos + 50) / 2,  # Midpoint y
                    "rotation": 0, "isLocked": False, "opacity": 1, "index": f"az{i}", "parentId": "page:page",
                    "props": {
                        "dash": "draw", "size": "m", "fill": "none", "color": "black", "labelColor": "black",
                        "bend": 0,
                        "start": {"type": "binding", "boundShapeId": central_shape_id, "normalizedAnchor": {"x": 0.5, "y": 0.5}, "isExact": False},
                        "end": {"type": "binding", "boundShapeId": shape_id, "normalizedAnchor": {"x": 0.5, "y": 0.5}, "isExact": False},
                        "arrowheadStart": "none", "arrowheadEnd": "arrow", "text": "", "font": "draw"
                    }
                })
    else: # Default if no other type matched (should be flowchart due to earlier logic)
        # Add a simple text message if no specific rules apply
        if not shapes: # Only if no title was added
            shapes.append({
                "id": "shape:fallback-text", "typeName": "shape", "type": "text",
                "x": 100, "y": 100, "rotation": 0, "isLocked": False, "opacity": 1,
                "index": "a1", "parentId": "page:page",
                "props": {"text": f"Rule-based: {prompt.capitalize()}", "color": "black", "size": "m", "font": "draw", "autoSize": True}
            })

    print(f"[Backend] Rule-based generated {len(shapes)} shapes")
    return shapes


@router.post("/generate-diagram")
async def generate_diagram_endpoint(req: DiagramRequest):
    print(f"[Backend] /generate-diagram prompt='{req.prompt}'")
    client_id = f"client-{uuid.uuid4().hex[:8]}"
    print(f"[Backend] Assigned client_id={client_id} for this request.")

    try:
        diagram = await generate_diagram_with_groq(req.prompt)
        diagram_results[client_id] = diagram
        
        if client_id in connected_websockets:
            print(f"[Backend] Pushing to WS {client_id} immediately after generation.")
            await connected_websockets[client_id].send_json(diagram)
        else:
            print(f"[Backend] WS for {client_id} not yet connected. Result cached.")
            
        return {"client_id": client_id, "message": "Diagram generation initiated. Connect WebSocket with this client_id."}
    except Exception as e:
        print(f"[Backend ERROR] {e}")
        err_shape = [{
            "id": "error-shape",
            "typeName": "shape",
            "type": "text",
            "x": 100, "y": 100, "rotation": 0,
            "isLocked": False, "opacity": 1,
            "index": "a1", "parentId": "page:page",
            "props": {"text": f"Error generating diagram: {str(e)[:200]}", "color": "red", "size": "m", "autoSize": True}
        }]
        diagram_results[client_id] = err_shape
        return {"client_id": client_id, "message": "error", "error_details": str(e)}

# Remove the if __name__ == "__main__" block as it's no longer needed