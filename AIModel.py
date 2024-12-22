!pip install torch transformers textwrap3 nltk spacy flashtext sense2vec pyngrok flask
!python -m spacy download en_core_web_sm
!wget -q https://github.com/explosion/sense2vec/releases/download/v1.0.0/s2v_reddit_2015_md.tar.gz
!tar -xf s2v_reddit_2015_md.tar.gz
!pip install --quiet git+https://github.com/boudinfl/pke.git


from textwrap3 import wrap
from transformers import T5ForConditionalGeneration, T5Tokenizer
import torch
import nltk
import spacy
import random
import numpy as np
from nltk.corpus import stopwords, wordnet as wn
from sense2vec import Sense2Vec
from flashtext import KeywordProcessor
import pke
import string
from nltk.tokenize import sent_tokenize
from collections import OrderedDict


# Download necessary NLTK resources
nltk.download('punkt')
nltk.download('stopwords')
nltk.download('wordnet')
nltk.download('punkt_tab')

# Load SpaCy model
nlp = spacy.load("en_core_web_sm")

# Load Sense2Vec model
s2v = Sense2Vec().from_disk('s2v_old')

# Device configuration
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Load T5 model and tokenizer for summarization
summary_model = T5ForConditionalGeneration.from_pretrained("t5-base")
summary_tokenizer = T5Tokenizer.from_pretrained("t5-base")
summary_model = summary_model.to(device)

question_model = T5ForConditionalGeneration.from_pretrained('ramsrigouthamg/t5_squad_v1')
question_tokenizer = T5Tokenizer.from_pretrained('ramsrigouthamg/t5_squad_v1')


# Fix randomness for reproducibility
def set_seed(seed: int):
    random.seed(seed)
    np.random.seed(seed)
    torch.manual_seed(seed)
    if device.type == 'cuda':
        torch.cuda.manual_seed_all(seed)


set_seed(42)


# Helper function for post-processing text
def postprocess_text(content):
    doc = nlp(content)
    sentences = [sent.text.capitalize() for sent in doc.sents]
    return " ".join(sentences).strip()


# Summarizer function
def summarize_text(text, model, tokenizer):
    text = text.strip().replace("\n", " ")
    text = "summarize: " + text

    max_len = 512
    encoding = tokenizer.encode_plus(
        text,
        max_length=max_len,
        pad_to_max_length=False,
        truncation=True,
        return_tensors="pt",
    ).to(device)

    input_ids, attention_mask = encoding["input_ids"], encoding["attention_mask"]

    outs = model.generate(
        input_ids=input_ids,
        attention_mask=attention_mask,
        early_stopping=True,
        num_beams=3,
        num_return_sequences=1,
        no_repeat_ngram_size=2,
        min_length=75,
        max_length=512,
    )

    decoded_output = [tokenizer.decode(ids, skip_special_tokens=True) for ids in outs]
    summary = postprocess_text(decoded_output[0])
    return summary.strip()


# Extract keywords using pke
def get_all_keywords(content):
    extractor = pke.unsupervised.MultipartiteRank()
    extractor.load_document(input=content, language='en')
    pos = {'NOUN', 'PROPN', 'ADJ', 'VERB'}
    stoplist = list(string.punctuation)
    stoplist += ['-lrb-', '-rrb-', '-lcb-', '-rcb-', '-lsb-', '-rsb-']
    stoplist += stopwords.words('english')

    extractor.candidate_selection(pos=pos)
    extractor.candidate_weighting(alpha=1.1, threshold=0.75, method='average')

    word_count = len(content.split())
    n_keywords = min(max(word_count // 20, 5), 50)

    keyphrases = extractor.get_n_best(n=n_keywords)
    single_word_keywords = [kw[0] for kw in keyphrases if len(kw[0].split()) == 1]
    multi_word_keywords = [kw[0] for kw in keyphrases if len(kw[0].split()) > 1]

    if word_count < 50:
        keywords = single_word_keywords[:n_keywords]
    elif word_count < 200:
        keywords = single_word_keywords[:n_keywords // 2] + multi_word_keywords[:n_keywords // 2]
    else:
        keywords = single_word_keywords[:n_keywords // 3] + multi_word_keywords[:n_keywords * 2 // 3]

    return keywords


# Keyword matching between original and summarized texts
def get_keywords(originaltext, summarytext):
    keywords = get_all_keywords(originaltext)
    keyword_processor = KeywordProcessor()
    for keyword in keywords:
        keyword_processor.add_keyword(keyword)

    keywords_found = keyword_processor.extract_keywords(summarytext)
    keywords_found = list(set(keywords_found))

    important_keywords = [kw for kw in keywords if kw in keywords_found]
    return important_keywords, keywords


# Distractor generation using WordNet
def get_distractors_wordnet(syn, word):
    distractors = []
    hypernym = syn.hypernyms()
    if not hypernym:
        return distractors
    for item in hypernym[0].hyponyms():
        name = item.lemmas()[0].name().replace("_", " ").capitalize()
        if name.lower() != word.lower() and name not in distractors:
            distractors.append(name)
        if len(distractors) == 4:  # Limit to the first four distractors
            break
    return distractors


# Distractor generation using Sense2Vec
def sense2vec_get_distractors(word, s2v):
    output = []
    try:
        sense = s2v.get_best_sense(word.lower().replace(" ", "_"))
        if not sense:  # Handle case where Sense2Vec doesn't find a sense
            return output
        most_similar = s2v.most_similar(sense, n=20)
        for each_word in most_similar:
            distractor = each_word[0].split("|")[0].replace("_", " ").capitalize()
            if distractor.lower() != word.lower() and distractor not in output:
                output.append(distractor)
            if len(output) == 4:  # Limit to the first four distractors
                break
    except Exception as e:
        print(f"Sense2Vec error for '{word}': {e}")
    return output


# Generate questions and distractors
def get_question(context, answer, model, tokenizer):
    text = f"context: {context} answer: {answer}"
    encoding = tokenizer.encode_plus(text, max_length=384, pad_to_max_length=False, truncation=True,
                                     return_tensors="pt").to(device)
    input_ids, attention_mask = encoding["input_ids"], encoding["attention_mask"]

    # Ensure the model is on the correct device
    model = model.to(device)  # Move model to the device

    outs = model.generate(
        input_ids=input_ids,
        attention_mask=attention_mask,
        early_stopping=True,
        num_beams=5,
        num_return_sequences=1,
        no_repeat_ngram_size=2,
        max_length=72,
    )

    # Move the generated output to the CPU before decoding
    outs = outs.to('cpu')  # Move output to CPU

    dec = [tokenizer.decode(ids, skip_special_tokens=True) for ids in outs]
    return dec[0].replace("question:", "").strip()


def chunk_text_by_sentences(text, max_tokens, tokenizer):
    """Split text into chunks based on token limits, ensuring meaningful sentence boundaries."""
    sentences = sent_tokenize(text)  # Split text into sentences
    chunks = []
    current_chunk = []
    current_length = 0

    for sentence in sentences:
        token_length = len(tokenizer.encode(sentence, add_special_tokens=False))
        if current_length + token_length <= max_tokens:
            current_chunk.append(sentence)
            current_length += token_length
        else:
            chunks.append(" ".join(current_chunk))  # Add current chunk to list
            current_chunk = [sentence]  # Start a new chunk
            current_length = token_length

    if current_chunk:
        chunks.append(" ".join(current_chunk))  # Add the last chunk

    return chunks


def generate_distractors(keyword, s2v):
    wordnet_distractors = []
    s2v_distractors = []

    if len(keyword.split()) == 1:
        synsets = wn.synsets(keyword, pos='n')
        if synsets:
            wordnet_distractors = get_distractors_wordnet(synsets[0], keyword)

    s2v_distractors = sense2vec_get_distractors(keyword, s2v)

    return wordnet_distractors, s2v_distractors




import os
from flask import Flask, request, jsonify
from pyngrok import ngrok
ngrok.set_auth_token("2UqFGEJnnkxOMjWDHrcNNJOFxch_5gHs6Ve5MNGyZfagu3wfV")
# Create the public URL

public_url = ngrok.connect(5000)  # Port 5000 matches Flask app
print(f"Public URL: {public_url}")

app = Flask(__name__)


@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    input_text = data.get('input', '')
    if not input_text:
        return jsonify({'error': 'No input provided'}), 400

    text = f"""${input_text}"""

    max_tokens = 512

    chunks = chunk_text_by_sentences(text, max_tokens, summary_tokenizer)

    results = []

    for chunk in chunks:
        # Summarize the chunk
        summarized_text = summarize_text(chunk, summary_model, summary_tokenizer)

        # Extract keywords
        imp_keywords, _ = get_keywords(chunk, summarized_text)

        # Generate distractors and questions for each keyword
        distractors = {}
        questions = {}
        for keyword in imp_keywords:
            # Generate distractors
            wordnet_distractors, s2v_distractors = generate_distractors(keyword, s2v)
            distractors[keyword] = {
                "WordNet": wordnet_distractors[:4],  # Limit to top 4
                "Sense2Vec": s2v_distractors[:4]  # Limit to top 4
            }

            # Generate question for the keyword
            context = summarized_text  # Use summarized text as the context
            question = get_question(context, keyword, question_model, question_tokenizer)
            questions[keyword] = question

        # Append results
        results.append({
            # "chunk": chunk,
            # "summarized_text": summarized_text,
            "keywords": imp_keywords,
            "questions": questions,
            "distractors": distractors
        })
    return jsonify(results)

app.run()
