from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from transformers import pipeline
import requests
from bs4 import BeautifulSoup

app = FastAPI()

# ✅ Enable CORS here
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can restrict to ["http://localhost:3000"] for dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

summarizer = pipeline("summarization")

class TextRequest(BaseModel):
    text: str

class URLRequest(BaseModel):
    url: str

@app.post("/text")
def summarize_text(request: TextRequest):
    summary = summarizer(request.text, max_length=130, min_length=30, do_sample=False)
    return {"summary": summary[0]["summary_text"]}

@app.post("/url")
def summarize_url(request: URLRequest):
    response = requests.get(request.url)
    soup = BeautifulSoup(response.text, "html.parser")
    paragraphs = ' '.join([p.text for p in soup.find_all('p')])
    text = paragraphs[:2000]  # limit length for the model
    summary = summarizer(text, max_length=130, min_length=30, do_sample=False)
    return {"summary": summary[0]["summary_text"]}
