import os
from typing import Union, List
from FlagEmbedding import BGEM3FlagModel

class ModelManager:
    _instance = None

    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            cls._instance = super(ModelManager, cls).__new__(cls)
            cls._instance.model = None
        return cls._instance

    def get_model(self) -> BGEM3FlagModel:
        if self.model is None:
            try:
                model_path = os.environ['MODEL_PATH']
                self.model = BGEM3FlagModel(model_path, use_fp16=True)
            except KeyError:
                raise EnvironmentError("MODEL_PATH environment variable not set.")
            except Exception as e:
                raise RuntimeError(f"Failed to initialize the model: {e}")
        return self.model

model_manager = ModelManager()

def compare_sentences(source_sentence: str, compare_to_sentences: Union[str, List[str]]) -> List[float]:
    model = model_manager.get_model()
    
    if isinstance(compare_to_sentences, str):
        compare_to_sentences = [compare_to_sentences]
    
    embeddings_1 = model.encode([source_sentence], 
                                batch_size=min(len(compare_to_sentences), 12), 
                                max_length=8192)['dense_vecs']
    embeddings_2 = model.encode(compare_to_sentences)['dense_vecs']
    
    similarity_scores = embeddings_1 @ embeddings_2.T
    # Assuming we want the similarity of source_sentence with each in compare_to_sentences
    return similarity_scores[0].tolist()