import os
import anthropic
from github import Github

# Get credentials from environment
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
GITHUB_REPO = os.getenv("GITHUB_REPO")

# Initialize clients
client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)
g = Github(GITHUB_TOKEN)
repo = g.get_repo(GITHUB_REPO)

def get_file_content(filename):
    """Fetch file from GitHub."""
    try:
        file = repo.get_contents(filename)
        return file.decoded_content.decode('utf-8'), file.sha
    except Exception as e:
        print(f"❌ Error fetching {filename}: {e}")
        return None, None

def analyze_request(user_request):
    """Step 1: Intake & Analyze - Generate proposal."""
    print("🔍 Analyzing request...\n")
    index_html, _ = get_file_content("index.html")
    readme, _ = get_file_content("README.md")
    
    prompt = f"""You are analyzing a feature request for a single-file Mapbox web app.

**Current index.html preview:**
{index_html[:2500] if index_html else "File not found"}...

**Current README:**
{readme[:1000] if readme else "No README"}

**User Request:**
{user_request}

**Project Rules:**
- Single-file architecture (index.html only)
- Mapbox GL JS styling
- GeoJSON injected inline
- Preserve all existing filters, layers, colors, overlays, KPIs
- UI palette: #2c3e50, #3498db, #e74c3c, #95a5a6

Generate a concise technical proposal (under 300 words):
1. What will change
2. How existing rules/features are preserved
3. Key code snippets showing the changes
"""

    message = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=1500,
        messages=[{"role": "user", "content": prompt}]
    )
    
    proposal = message.content[0].text
    print("📋 PROPOSAL:\n")
    print(proposal)
    print("\n" + "="*60 + "\n")
    return proposal

def develop_feature(user_request, proposal):
    """Step 2: Developer Agent - Generate updated code."""
    print("🛠️  Developing feature...\n")
    index_html, _ = get_file_content("index.html")
    
    prompt = f"""You are implementing an approved feature for a single-file Mapbox app.

**Approved Proposal:**
{proposal}

**Original User Request:**
{user_request}

**Current index.html:**
{index_html}

Generate the COMPLETE updated index.html file that implements this feature while preserving ALL existing:
- Map layers and filters
- Color schemes and styling
- GeoJSON data injection
- Sidebar filters and KPIs
- Overlay controls
- UI layout and palette

Output ONLY the complete HTML file. Start with <!DOCTYPE html> and include everything to the closing </html> tag."""

    message = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=16000,
        messages=[{"role": "user", "content": prompt}]
    )
    
    new_code = message.content[0].text
    
    # Clean up markdown code fences if present
    if "```html" in new_code:
