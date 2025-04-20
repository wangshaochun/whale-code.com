---
title: transformer模型进行语义搜索和语言生成
date: '2024-02-20'
---

演示使用 transformer 模型进行语义搜索和语言生成，其中使用 huggingface 的 transformers python 包需要自动下载语言模型，文件有几个G

### 第一部分
主要目标是在信息检索上下文中试验不同的嵌入技术
> https://huggingface.co/sentence-transformers 如果安装了 python3.9+，则可以使用 pip3 install -U sentence-transformers 如果没有 python，则可以从 https://anaconda.org/ 安装 conda，然后使用 conda install -c conda-forge sentence-transformers 安装

代码如下：
```
from sentence_transformers import SentenceTransformer
from numpy import dot
from math import sqrt
import json

#使用 json python 包从 tweets-utf-8.json 读取推文，并生成包含每条推文文本的字符串列表。
def get_tweets():
    tweets = []
    with open('tweets-utf-8.json', 'r', encoding='utf-8') as file:
        for line in file:
            tweet = json.loads(line.strip())
            tweets.append(tweet['text'])
    return tweets

#该函数采用查询文档的嵌入、文档嵌入列表和相应文档的列表，并返回表单对 （similarity，document） 的列表，
# 根据每个文档与查询之间的余弦相似度按降序排序。您可以使用任何您喜欢的包;请注意，NumPy 有一个 DOT 函数
def sort_by_sim(query_embedding,document_embeddings,documents):
    # Calculate the cosine similarity between the query and each document
    similarities = []
    for i in range(len(document_embeddings)):
        similarity = dot(query_embedding, document_embeddings[i]) / (sqrt(dot(query_embedding, query_embedding)) * sqrt(dot(document_embeddings[i], document_embeddings[i])))
        similarities.append((similarity, documents[i]))
    # Sort the similarities in descending order
    similarities.sort(key=lambda x: x[0], reverse=True)
    # Return the sorted list of tuples
    return similarities


#，返回与查询 “I am looking for a job.” 最相似的 25 条推文（as （similarity，document） 对）。
# 使用此处定义的基于手套的句子嵌入：https://huggingface.co/sentence-transformers/average_word_embeddings_glove.840B.300d
def glove_top25(query,documents):
    # Load the GloVe model
    model = SentenceTransformer('sentence-transformers/average_word_embeddings_glove.840B.300d')
    # Encode the query
    query_embedding = model.encode(query)
    # Encode the documents
    document_embeddings = model.encode(documents)
    # Sort the documents by similarity to the query
    sorted_similarities = sort_by_sim(query_embedding, document_embeddings, documents)
    # Return the top 25 most similar documents
    top_25 = sorted_similarities[:25]
    # Return the list of tuples (similarity, document)
    return top_25

#返回与查询 “I am looking for a job.” 最相似的前 25 条推文（as （similarity，document） 对）。
# 使用此处定义的基于 MiniLM（派生自 BERT）的句子嵌入：https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2
def minilm_top25(query,documents):
    # Load the MiniLM model
    model = SentenceTransformer('all-MiniLM-L6-v2')
    # Encode the query
    query_embedding = model.encode(query)
    # Encode the documents
    document_embeddings = model.encode(documents)
    # Sort the documents by similarity to the query
    sorted_similarities = sort_by_sim(query_embedding, document_embeddings, documents)
    # Return the top 25 most similar documents
    top_25 = sorted_similarities[:25]
    # Return the list of tuples (similarity, document)
    return top_25
        
## Test Code

tweets = get_tweets()

print("**************GLOVE*****************")
for p in glove_top25("I am looking for a job.",tweets): print(p)

print("**************MINILM*****************")
for p in minilm_top25("I am looking for a job.",tweets): print(p)
```

### 第二部分
使用生成语言模型，使用语义搜索更加精准

```
import torch
from transformers import GPT2LMHeadModel, GPT2Tokenizer


def generate_story():
    # Set random seed for reproducibility (确保每次生成相同结果)
    torch.manual_seed(42)

    # Load pre-trained GPT-2 model and tokenizer (加载本地模型)
    model_name = "gpt2"  # 也可用 "gpt2"（小模型）或 "gpt2-large"
    tokenizer = GPT2Tokenizer.from_pretrained(model_name)
    model = GPT2LMHeadModel.from_pretrained(model_name)

    # Define prompt and generation parameters (设置输入和生成参数)
    prompt = "Once upon a time, in a land far away,"
    input_ids = tokenizer.encode(prompt, return_tensors="pt")

    # Generate story with controlled randomness (控制生成参数)
    output = model.generate(
        input_ids,
        max_length=100,
        num_return_sequences=1,
        no_repeat_ngram_size=3,  # 避免3-gram重复
        do_sample=True,
        top_k=50,
        top_p=0.95,
        temperature=0.7,
        pad_token_id=tokenizer.eos_token_id
    )

    # Decode and post-process the generated text (解码并后处理)
    story = tokenizer.decode(output[0], skip_special_tokens=True)

    # Ensure word count > 100 (检查字数)
    words = story.split()
    if len(words) < 100:
        print("Warning: Story is shorter than 100 words. Adjust max_length.")

    return story


if __name__ == "__main__":
    story = generate_story()
    print("Generated Story:\n", story)
```