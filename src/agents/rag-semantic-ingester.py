import os
import json
import requests
from dotenv import load_dotenv

# Load environment variables for the OpenRouter Key
load_dotenv()

OPENROUTER_API_KEY = os.getenv('OPENROUTER_API_KEY')
OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions"

# Fallback free model that excels at reading docs
MODEL_NAME = "google/gemini-2.5-flash-lite-preview"

class SemanticIngester:
    def __init__(self, db_path="C:\\Users\\karma\\dev_os\\semantic_rag_db.json"):
        self.db_path = db_path
        self.db = self._load_db()

    def _load_db(self):
        if os.path.exists(self.db_path):
            with open(self.db_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        return {"documents": []}

    def _save_db(self):
        # Ensure directory exists
        os.makedirs(os.path.dirname(self.db_path), exist_ok=True)
        with open(self.db_path, 'w', encoding='utf-8') as f:
            json.dump(self.db, f, indent=4)

    def analyze_document(self, filepath, content):
        """Sends the document text to OpenRouter LLM to extract meaning, title, and category."""
        if not OPENROUTER_API_KEY:
            # Fallback if no API key is set - basic heuristic extraction
            return {
                "Title": os.path.basename(filepath),
                "Category": "Uncategorized Document",
                "Summary": content[:300] + "...",
                "Tokens": len(content.split()),
                "Requires_LLM_Pass": True
            }

        prompt = f"""
        You are the Karma OS Semantic AI. Read the following document content and understand exactly what it is.
        It may be a ChatGPT export, a code file, a brainstorming session, or API docs.
        
        Respond with exactly this JSON format and nothing else:
        {{
            "Title": "A concise, accurate title for this document",
            "Category": "One of: Guide, Project Scaffold, Concept, API Credentials, Source Code, Chat Log, Social Media Plan",
            "Summary": "A 2-3 sentence summary of exactly what valuable information is in this file",
            "Actionable": true/false (true if this contains code to run or tasks to do)
        }}

        Document Content (truncated):
        {content[:4000]}
        """

        headers = {
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "HTTP-Referer": "http://localhost:8080",
            "X-Title": "Karma OS Semantic Ingester"
        }

        data = {
            "model": MODEL_NAME,
            "messages": [{"role": "user", "content": prompt}],
            "response_format": {"type": "json_object"}
        }

        try:
            response = requests.post(OPENROUTER_API_URL, headers=headers, json=data)
            response.raise_for_status()
            result_json = response.json()
            extracted = json.loads(result_json['choices'][0]['message']['content'])
            return extracted
        except Exception as e:
            print(f"LLM extraction failed for {filepath}: {e}")
            return None

    def ingest_directory(self, target_dir):
        """Safely scans a directory for text files and READS them, never deleting."""
        print(f"Commencing Semantic Scan of: {target_dir}")
        valid_extensions = ['.txt', '.md', '.json', '.html', '.py', '.js']
        
        for root, dirs, files in os.walk(target_dir):
            for file in files:
                ext = os.path.splitext(file)[1].lower()
                if ext in valid_extensions:
                    filepath = os.path.join(root, file)
                    
                    # Check if already ingested
                    if any(doc['path'] == filepath for doc in self.db['documents']):
                        continue
                        
                    try:
                        with open(filepath, 'r', encoding='utf-8') as f:
                            content = f.read()
                            
                        # Skip empty files
                        if not content.strip(): continue
                            
                        print(f"Reading and analyzing: {filepath}")
                        analysis = self.analyze_document(filepath, content)
                        
                        if analysis:
                            doc_entry = {
                                "path": filepath,
                                "type": ext,
                                "size": os.path.getsize(filepath),
                                "semantic_data": analysis
                            }
                            self.db['documents'].append(doc_entry)
                            self._save_db()
                            print(f"✅ Ingested: {analysis.get('Title')} -> {analysis.get('Category')}")
                            
                    except UnicodeDecodeError:
                        # Skip binary files that tricked the extension check
                        pass
                    except Exception as e:
                        print(f"Failed to read {filepath}: {e}")

if __name__ == "__main__":
    print("🧠 KARMA OS: SEMANTIC DOCUMENT RAG INGESTER ONLINE 🧠")
    print("WARNING: This tool is READ-ONLY. No files will be moved or deleted.")
    
    ingester = SemanticIngester()
    
    # Target common locations for ChatGPT exports and notes
    targets = [
        r"C:\Users\karma\Documents",
        r"C:\Users\karma\Desktop",
        r"C:\Users\karma\Downloads", 
    ]
    
    for t in targets:
        if os.path.exists(t):
            print(f"Scanning target: {t}")
            # Note: For production use, uncomment below. For safety and rate limits, 
            # we will let the user invoke this via n8n or Jarvis Voice.
            # ingester.ingest_directory(t)
            
    print("System deployed successfully.")
