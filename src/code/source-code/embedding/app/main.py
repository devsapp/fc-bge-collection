from fastapi import FastAPI
from fastapi.responses import RedirectResponse
import uvicorn
from schema import CompareSentencesRequest,CompareSentencesResponse
import service
app = FastAPI()


@app.get("/")
def index():
    return RedirectResponse(url="/docs")


@app.post("/compare_sentences",response_model=CompareSentencesResponse)
async def compare_sentences(request: CompareSentencesRequest):
    return {
        "object": "list",
        "data": service.compare_sentences(request.source_sentence, request.compare_to_sentences)
    }



uvicorn.run(app, host="0.0.0.0", port=8000)
