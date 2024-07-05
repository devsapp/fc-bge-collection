from typing import List, Union, Dict, Any
from pydantic import BaseModel, Field



class CompareSentencesRequest(BaseModel):
    source_sentence: Union[str, List[str]]=Field(alias="source")
    compare_to_sentences: Union[List[str],str]=Field(alias="compare_to")

class CompareSentencesResponse(BaseModel):
    data: Any
    object:str


