# Google Colab Transformer API Setup

This guide shows you how to run a heavy Transformer model for Fake News Detection entirely inside a free Google Colab notebook, and expose it as a public API that your local React app can talk to.

## Step 1: Open Google Colab
1. Go to [Google Colab](https://colab.research.google.com/) and create a **New Notebook**.
2. In the top menu, click **Runtime** -> **Change runtime type**.
3. Under Hardware Accelerator, select **T4 GPU** and click Save. (This gives you a free graphics card to run the AI fast!)

## Step 2: Get a Free Ngrok Token
Ngrok is the magic tool that will take the server running privately on Google's Colab servers and give you a public `https://...` URL.
1. Go to [ngrok.com](https://ngrok.com/) and create a free account.
2. In your dashboard, go to **Your Authtoken** on the left menu and copy your token.

## Step 3: Paste and Run the Code
Copy the block of code below, paste it into a single cell in your Colab notebook, and hit the **Play** button.

```python
# 1. Install required libraries
!pip install fastapi nest-asyncio pyngrok uvicorn transformers torch pydantic

# 2. Import libraries
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from transformers import pipeline
import nest_asyncio
import uvicorn
from pyngrok import ngrok

# 3. Load the Transformer model 
# We are using a pre-trained "Tiny BERT" model for fake news to keep it fast for this demo.
print("Loading model... (this might take a minute)")
pipe = pipeline("text-classification", model="mrm8488/bert-tiny-finetuned-fake-news-detection")

# 4. Define the FastAPI App
app = FastAPI()

# Add CORS so your local React app can talk to this Colab API without browser errors
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_methods=["*"],
    allow_headers=["*"],
)

class TextRequest(BaseModel):
    text: str

@app.post("/predict")
def predict_misinformation(request: TextRequest):
    # Pass the text to the transformer model
    result = pipe(request.text)[0]
    
    # In this specific model, LABEL_0 is Real and LABEL_1 is Fake
    is_fake = result['label'] == 'LABEL_1'
    
    return {
        "text": request.text,
        "prediction": "Fake/Misinformation" if is_fake else "Real/Reliable",
        "confidence_score": round(result['score'] * 100, 2) # e.g., 98.5%
    }

@app.get("/")
def read_root():
    return {"message": "Colab Transformer API is running!"}

# 5. Expose the API to the public internet using Ngrok
# PASTE YOUR NGROK TOKEN HERE:
NGROK_TOKEN = "YOUR_NGROK_TOKEN_HERE" 

ngrok.set_auth_token(NGROK_TOKEN)
public_url = ngrok.connect(8000)
print(f"\n==================================================")
print(f"🚀 YOUR PUBLIC API URL IS: {public_url.public_url}")
print(f"Make a POST request to: {public_url.public_url}/predict")
print(f"==================================================\n")

# 6. Run the FastAPI server inside the Colab notebook
nest_asyncio.apply()
uvicorn.run(app, port=8000)
```

## Step 4: Test it from your Computer!

Once the Colab cell is running and prints out your `🚀 YOUR PUBLIC API URL IS: https://xyz.ngrok-free.app`, you can test it directly from your computer's terminal. 

Just open your Mac terminal and run this `curl` command (make sure to replace the URL with your actual Ngrok URL):

```bash
curl -X POST "https://YOUR_URL_HERE.ngrok-free.app/predict" \
     -H "Content-Type: application/json" \
     -d '{"text": "Breaking news: Aliens have landed on the White House lawn and are demanding Bitcoin!"}'
```

You should get a JSON response back almost instantly showing that the model flagged it as fake news, with a confidence score! When you build your React app, you will just use `fetch` or `axios` to make this exact same call.
