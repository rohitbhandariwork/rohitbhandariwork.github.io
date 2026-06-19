var MODULES = [
  {
    id: 1, title: "Transformers", track: "Core", xp: 100,
    icon: "⚡", cardIcon: "🔧",
    lore: "The first chamber hums with ancient energy. Patterns of connection pulse through the walls — this is where modern AI found its voice.",
    content: [
      "Before transformers, most language models used <strong>RNNs</strong> or <strong>LSTMs</strong> — they read words one at a time, in order. This was slow and could only <span class=\"egg\" data-egg-id=\"forgotten\">look back a few words</span> before forgetting.",
      "In 2017, a paper titled <strong>'Attention Is All You Need'</strong> changed everything. The transformer architecture ditched recurrence entirely and introduced a mechanism called <strong>self-attention</strong> that looks at every word in relation to every other word simultaneously.",
      "A transformer has two main parts: an <strong>encoder</strong> that reads the input and builds a representation, and a <strong>decoder</strong> that generates output word by word. Both use stacked layers of self-attention and feed-forward networks.",
      "What makes transformers revolutionary is <strong>parallelization</strong>. Since every word is processed at once (not sequentially), training is dramatically faster. This allowed models to scale from millions to hundreds of billions of parameters.",
      '<div class="highlight"><strong>🧠 Key insight:</strong> Transformers don\'t "understand" language the way we do. They find <span class="egg" data-egg-id="patterns">statistical patterns</span> between words across massive text. The magic is in the scale — enough patterns start to look like understanding.</div>',
      "Today, every major AI system — GPT, Claude, Gemini, Llama — is built on the transformer architecture. It's the foundation everything else stands on.",
      "<strong>Residual connections</strong> are critical — they add the input of each layer back to its output, allowing gradients to flow through deep stacks without vanishing. <strong>Layer normalization</strong> stabilizes training by normalizing activations across features.",
      "The decoder uses <strong>masked self-attention</strong> — it can only look at previous positions, not future ones. This ensures each predicted word depends only on what came before, making generation autoregressive and causally correct."
    ],
    quiz: [
      { q: "What problem did transformers solve that RNNs had?", opts: ["They were too expensive to train", "They couldn't process images", "They processed words sequentially and had limited memory", "They required labeled data"], ans: 2 },
      { q: "What did the paper 'Attention Is All You Need' introduce?", opts: ["The first neural network", "The transformer architecture", "Reinforcement learning", "Convolutional layers"], ans: 1 },
      { q: "What makes transformers faster to train than RNNs?", opts: ["They use less data", "They process all words in parallel", "They have fewer parameters", "They run on CPUs"], ans: 1 },
      { q: "What are the two main parts of a transformer?", opts: ["Encoder and decoder", "Input and output", "Training and inference", "CNN and RNN"], ans: 0 },
      { q: "Which of these is NOT built on transformers?", opts: ["GPT-4", "Claude", "Llama", "All of these use transformers"], ans: 3 },
      { q: "What is the purpose of residual connections in transformers?", opts: ["Reduce parameter count", "Allow gradients to flow through deep layers", "Speed up inference", "Replace self-attention"], ans: 1 },
      { q: "What does layer normalization do?", opts: ["Normalizes activations across features to stabilize training", "Reduces the number of layers", "Increases model size", "Converts text to numbers"], ans: 0 },
      { q: "What is masked self-attention in the decoder?", opts: ["It hides certain words from the output", "It only attends to previous positions, not future ones", "It reduces attention to low-probability words", "It masks out punctuation"], ans: 1 },
      { q: "What scaling factor is commonly applied in attention?", opts: ["Square root of the key dimension", "Number of layers", "Vocabulary size", "Batch size"], ans: 0 },
      { q: "Why did transformers enable scaling to billions of parameters?", opts: ["Better hardware", "Parallelization removed the sequential bottleneck of RNNs", "Smaller vocabulary", "Fewer layers needed"], ans: 1 }
    ]
  },
  {
    id: 2, title: "Self-Attention", track: "Core", xp: 80,
    icon: "🔍", cardIcon: "🕸️",
    lore: "Deeper in the vault, you find a web of interconnected mirrors. Each reflection shows a different angle of the same concept.",
    content: [
      "<strong>Self-attention</strong> is the engine inside every transformer. It answers one question: which words in this sentence matter most to each other?",
      "For every word, the model creates three vectors: a <strong>Query (Q)</strong>, a <strong>Key (K)</strong>, and a <strong>Value (V)</strong>. Think of Q as 'what am I looking for?' and K as 'what do I have?' — the match between them determines attention.",
      "The attention score is computed by taking the <strong>dot product</strong> of Q and K, scaling it down by the square root of the dimension, then passing through <strong>softmax</strong> to get a probability distribution. This tells the model how much to focus on each other word.",
      'Instead of one attention head, transformers use <strong>multi-head attention</strong> — 8 to 96 parallel attention layers. Each head learns a different relationship pattern (e.g., syntax, proximity, semantic similarity).',
      '<div class="highlight"><strong>🧠 Key insight:</strong> Self-attention is why transformers can handle long documents. A word at position 1 can directly attend to a word at position 1000 — no forgetting curve. This was impossible with RNNs.</div>',
      "The outputs from all heads are concatenated and projected down. This rich representation is then fed through feed-forward layers, added to the original input (residual connection), and normalized — repeated across dozens of layers.",
      "The <strong>value (V)</strong> vector carries the actual word information. The attention weights (from Q·K) tell the model how much of each value to include. So Q finds what to look for, K says what's available, and V delivers the content.",
      "Without scaling, dot products grow large in high dimensions, pushing softmax into regions with extremely small gradients. <strong>Scaled dot-product attention</strong> divides by √d to keep gradients healthy."
    ],
    quiz: [
      { q: "What does the Query (Q) vector represent?", opts: ["What I have", "What I'm looking for", "The final output", "The word position"], ans: 1 },
      { q: "What does softmax do in attention?", opts: ["Normalizes scores into probabilities", "Selects the top word", "Drops low-scoring words", "Encodes position"], ans: 0 },
      { q: "Why is multi-head attention useful?", opts: ["It's faster than single-head", "Each head learns different relationship patterns", "It reduces parameter count", "It eliminates the need for feed-forward layers"], ans: 1 },
      { q: "What problem does self-attention solve that RNNs couldn't?", opts: ["Processing images", "Handling long-range dependencies in text", "Working without GPUs", "Generating text"], ans: 1 },
      { q: "What is a residual connection in transformers?", opts: ["Adding the input back to the output of a layer", "A backup network", "Skipping the attention step", "Reducing the model size"], ans: 0 },
      { q: "What does the Value (V) vector carry?", opts: ["The attention score", "The actual word content", "The position encoding", "The query intent"], ans: 1 },
      { q: "Why is scaling needed in dot-product attention?", opts: ["To speed up computation", "To prevent large dot products from saturating softmax", "To reduce memory usage", "To increase model size"], ans: 1 },
      { q: "What is the typical range for the number of attention heads?", opts: ["1-4", "8-96", "100-500", "500+"], ans: 1 },
      { q: "After multi-head attention, what happens to the outputs?", opts: ["They are discarded", "They are concatenated and projected down", "They are fed directly to the output", "They are averaged"], ans: 1 },
      { q: "What do different attention heads learn?", opts: ["The same patterns redundantly", "Different relationship patterns like syntax and semantics", "Only word positions", "Only punctuation"], ans: 1 }
    ]
  },
  {
    id: 3, title: "RAG (Retrieval-Augmented Generation)", track: "Core", xp: 100,
    icon: "📚", cardIcon: "🔗",
    lore: "A library within a library. The vault can reach beyond its own walls to find exactly the knowledge it needs.",
    content: [
      "Large language models know a lot — but they're frozen in time at their training cutoff. Ask a model about something that happened yesterday, and it has no idea. <strong>RAG</strong> fixes this.",
      "RAG stands for <strong>Retrieval-Augmented Generation</strong>. Instead of relying only on the model's internal knowledge, RAG first <strong>retrieves relevant documents</strong> from an external database, then feeds them to the model as context.",
      "Here's how it works: a user asks a question → the system converts it into an <strong>embedding</strong> (a vector) → searches a vector database for similar embeddings → retrieves the top-k matching documents → sends them + the original question to the LLM → the LLM generates an answer grounded in those documents.",
      "This is powerful because: (1) the model can cite sources, (2) you can update the database without retraining, (3) the model won't hallucinate facts it doesn't know, and (4) you can add proprietary data (internal docs, recent news, your own content).",
      '<div class="highlight"><strong>🧠 Key insight:</strong> RAG doesn\'t make the model smarter — it makes it better informed. The model is still the same; it just gets to "open a textbook" before answering every question.</div>',
      "RAG powers most enterprise AI applications today: customer support bots, research assistants, code documentation tools, and — yes — your AI Knowledge Explainers are essentially a RAG pipeline over curated educational content.",
      "<strong>Evaluation of RAG</strong> measures two things: retrieval quality (did we find the right docs?) and generation quality (did the LLM use them well?). Metrics like <strong>hit rate</strong>, <strong>MRR</strong>, and <strong>faithfulness</strong> are commonly tracked.",
      "RAG works with any LLM — you don't need a special model. The retrieved context fits in the <strong>context window</strong>, which limits how many documents you can include. Longer context windows (128k+) make RAG more powerful."
    ],
    quiz: [
      { q: "What does RAG stand for?", opts: ["Recurrent Attention Generation", "Retrieval-Augmented Generation", "Random Access Generation", "Reinforced Auto-Grading"], ans: 1 },
      { q: "What problem does RAG solve?", opts: ["Model training speed", "Knowledge cutoff and hallucination", "Model size", "Inference cost"], ans: 1 },
      { q: "What is retrieved from the database in RAG?", opts: ["Entire documents", "Embeddings (vector representations)", "Model weights", "Training data"], ans: 1 },
      { q: "Which of these is a benefit of RAG?", opts: ["No need to retrain the model to add new information", "Faster inference than normal generation", "Smaller model size", "No external dependencies"], ans: 0 },
      { q: "In a RAG pipeline, what does the LLM receive?", opts: ["Only the retrieved documents", "Only the user's question", "Both the retrieved documents and the user's question", "A summary of the database"], ans: 2 },
      { q: "What does 'grounding' mean in RAG?", opts: ["Anchoring the model's response in retrieved factual documents", "Training the model on a new dataset", "Reducing the model's temperature", "Deploying the model to production"], ans: 0 },
      { q: "What is a key limitation of RAG related to the model?", opts: ["It only works with GPT models", "The context window limits how many documents can be included", "It requires a special RAG-specific LLM", "It doubles inference time"], ans: 1 },
      { q: "What metric measures whether the right documents were retrieved?", opts: ["Perplexity", "Hit rate or MRR", "BLEU score", "Accuracy"], ans: 1 },
      { q: "Can RAG be used with open-source LLMs?", opts: ["No, only proprietary models", "Yes, RAG works with any LLM", "Only models trained after 2023", "Only models with >100B parameters"], ans: 1 },
      { q: "What is the vector database used for in RAG?", opts: ["Storing model weights", "Storing and searching document embeddings by similarity", "Running the LLM inference", "Generating the final answer"], ans: 1 }
    ]
  },
  {
    id: 4, title: "Fine-tuning LLMs", track: "Advanced", xp: 120,
    icon: "🔧", cardIcon: "⚒️",
    lore: "The forge — where raw knowledge is reshaped and refined. A powerful tool, but one that must be wielded with care.",
    content: [
      "A pre-trained LLM is like a brilliant generalist who's read everything but hasn't specialized. <strong>Fine-tuning</strong> is the process of training the model further on a narrower dataset to make it expert at a specific task.",
      "There are two main approaches. <strong>Full fine-tuning</strong> updates all the model's weights — expensive (requires a GPU cluster) and produces a separate copy of the model for each task.",
      "<strong>Parameter-Efficient Fine-Tuning (PEFT)</strong> is smarter. Methods like <strong>LoRA</strong> (Low-Rank Adaptation) freeze the original weights and insert small trainable matrices. Instead of training 7B parameters, you train maybe 0.1% of that. It's fast, cheap, and you can swap adapters without reloading the base model.",
      "<strong>QLoRA</strong> goes further — it quantizes the base model to 4-bit (massively reducing memory) while still training in higher precision. This lets you fine-tune a 70B model on a single consumer GPU.",
      '<div class="highlight"><strong>🧠 Key insight:</strong> Fine-tuning is often overkill. For most use cases, prompt engineering or RAG will get you 90% of the way there. Fine-tune only when you need to change the model\'s behavior or tone, not just its knowledge.</div>',
      "When should you fine-tune? (1) You need the model to follow a specific output format. (2) You're building a code assistant that needs to understand your codebase. (3) You need the model to adopt a specific persona consistently. Otherwise, try prompting first.",
      "<strong>Catastrophic forgetting</strong> is a risk — fine-tuning on new data can cause the model to lose previously learned capabilities. This is why PEFT methods that freeze most weights are often preferred; they preserve the base model's general knowledge.",
      "<strong>Instruction fine-tuning</strong> trains the model on (instruction, response) pairs, teaching it to follow directions. <strong>RLHF</strong> (Reinforcement Learning from Human Feedback) goes further by using human preferences to align the model's behavior."
    ],
    quiz: [
      { q: "What does full fine-tuning do?", opts: ["Creates a new model from scratch", "Updates all weights of a pre-trained model", "Only changes the output layer", "Freezes all weights"], ans: 1 },
      { q: "What does LoRA stand for?", opts: ["Long-Range Attention", "Low-Rank Adaptation", "Local Response Architecture", "Layer Optimization for Rapid Alignment"], ans: 1 },
      { q: "What is the main advantage of PEFT methods like LoRA?", opts: ["They improve inference speed", "They train far fewer parameters than full fine-tuning", "They eliminate the need for GPUs", "They work without training data"], ans: 1 },
      { q: "What does QLoRA add on top of LoRA?", opts: ["Quantum computing", "Quantization to 4-bit precision", "Query optimization", "Quick learning rate scheduling"], ans: 1 },
      { q: "When should you consider fine-tuning?", opts: ["When you need to change the model's behavior consistently", "For every use case as a first step", "When prompt engineering fails once", "Only for image generation"], ans: 0 },
      { q: "What is catastrophic forgetting?", opts: ["The model loses previously learned capabilities when fine-tuned on new data", "The model's weights are accidentally deleted", "The training data is lost", "The model forgets to generate text"], ans: 0 },
      { q: "What does instruction fine-tuning teach the model?", opts: ["How to write instructions", "How to follow directions from (instruction, response) pairs", "How to generate instructions for other models", "How to code"], ans: 1 },
      { q: "What does RLHF stand for?", opts: ["Recurrent Layer Hidden Feedback", "Reinforcement Learning from Human Feedback", "Reduced Latency High Frequency", "Recursive Language Hidden Function"], ans: 1 },
      { q: "Why does PEFT help with catastrophic forgetting?", opts: ["It trains more data", "It freezes most weights, preserving the base model's knowledge", "It uses a different optimizer", "It reduces the learning rate to zero"], ans: 1 },
      { q: "What size model can QLoRA fine-tune on a single consumer GPU?", opts: ["1B parameters", "Up to 70B parameters", "Only 7B or smaller", "500M parameters"], ans: 1 }
    ]
  },
  {
    id: 5, title: "Prompt Engineering", track: "Practical", xp: 80,
    icon: "🎯", cardIcon: "📝",
    lore: "Words are keys. The right key opens hidden doors — the wrong one leaves you locked outside.",
    content: [
      "<strong>Prompt engineering</strong> is the art of crafting inputs that get the best possible outputs from an LLM. It's not magic — it's structured communication with a statistical reasoning engine.",
      "The simplest technique: <strong>be specific</strong>. Instead of 'Write an email,' say 'Write a professional email to a hiring manager following up on a data architect interview. Keep it under 100 words, polite but direct.' The model needs constraints to perform well.",
      "<strong>Few-shot prompting</strong> gives examples. Show the model 2-3 <span class=\"egg\" data-egg-id=\"examples\">examples</span> of what you want, then ask for a new one. This works especially well for formatting tasks like classification, extraction, or structured output generation.",
      "<strong>Chain-of-thought (CoT)</strong> prompting asks the model to 'think step by step.' For reasoning tasks (math, logic, planning), CoT dramatically improves accuracy — sometimes by 20-30% over direct answers.",
      '<div class="highlight"><strong>🧠 Key insight:</strong> System prompts are your most powerful tool. They set the model\'s persona, constraints, and behavior for the entire conversation. Invest time in getting your system prompt right before tweaking individual queries.</div>',
      "Advanced techniques include: <strong>structured outputs</strong> (asking for JSON), <strong>temperature control</strong> (lower = deterministic, higher = creative), <strong>role prompting</strong> ('you are an expert data architect'), and <strong>self-consistency</strong> (run the same prompt multiple times and take the majority answer).",
      "<strong>Zero-shot prompting</strong> asks the model to perform a task without any examples. Modern LLMs are surprisingly good at this for common tasks. <strong>Delimiters</strong> (```, \"\"\", ---) help separate instructions from input data, preventing prompt injection.",
      "<strong>Iterative prompting</strong> is the process of refining prompts based on the model's outputs. Start simple, analyze failures, add constraints, test again. This is the most practical skill in prompt engineering."
    ],
    quiz: [
      { q: "What is few-shot prompting?", opts: ["Asking the model to generate multiple responses", "Giving examples in the prompt before asking the real question", "Using a smaller model for faster responses", "Reducing the number of tokens in the output"], ans: 1 },
      { q: "What does chain-of-thought prompting improve?", opts: ["Output speed", "Reasoning accuracy on complex tasks", "Model memory", "Factual knowledge"], ans: 1 },
      { q: "What does a lower temperature setting do?", opts: ["Makes the model more creative", "Makes the output more deterministic", "Speeds up generation", "Reduces token usage"], ans: 1 },
      { q: "What is a system prompt?", opts: ["The first message in a conversation that sets model behavior", "A prompt that generates system code", "A prompt about computer systems", "The model's training objective"], ans: 0 },
      { q: "Which technique asks the model to reason step-by-step?", opts: ["Zero-shot", "Few-shot", "Chain-of-thought", "Structured output"], ans: 2 },
      { q: "What is zero-shot prompting?", opts: ["Performing a task without any examples in the prompt", "Using no prompt at all", "Asking the model zero questions", "A prompt that generates no output"], ans: 0 },
      { q: "What is the purpose of delimiters in prompts?", opts: ["To make prompts look prettier", "To separate instructions from input data and prevent injection", "To reduce token count", "To add formatting to output"], ans: 1 },
      { q: "What is self-consistency in prompting?", opts: ["Using the same prompt repeatedly", "Running the same prompt multiple times and taking the majority answer", "Making the model consistent with its previous answers", "A single deterministic output"], ans: 1 },
      { q: "What is iterative prompting?", opts: ["Refining prompts based on model outputs through repeated testing", "Using multiple prompts simultaneously", "Prompting in a loop until the model stops", "Generating prompts automatically"], ans: 0 },
      { q: "For what type of task is few-shot prompting especially effective?", opts: ["Creative writing", "Classification and extraction tasks", "Code generation", "Poetry"], ans: 1 }
    ]
  },
  {
    id: 6, title: "Embeddings & Vector Databases", track: "Practical", xp: 100,
    icon: "🌐", cardIcon: "🧩",
    lore: "Vault of echoes — every concept has a reflection. Find the one closest to what you seek.",
    content: [
      "An <strong>embedding</strong> is a numeric representation of text — a list of hundreds of floating-point numbers that capture the <strong>meaning</strong> of the text, not just its words. Similar texts have similar embedding vectors.",
      "Think of it as mapping every piece of text to a point in a high-dimensional space. 'Dog' and 'Puppy' are close together in this space. 'Dog' and 'Tax Return' are far apart. This spatial relationship is what makes embeddings powerful.",
      "<strong>Cosine similarity</strong> measures how close two embeddings are — a value from -1 to 1. 0.95 means 'very similar', 0.1 means 'unrelated'. This is how search engines find relevant documents without matching exact keywords.",
      "A <strong>vector database</strong> (like Pinecone, Chroma, Weaviate, or Qdrant) stores these embeddings and can retrieve the closest ones to a query in milliseconds, even across millions of entries. This is the retrieval half of RAG.",
      '<div class="highlight"><strong>🧠 Key insight:</strong> Embeddings capture semantics, not keywords. Search for "how to make a payment" and it can find docs about "billing instructions" even though they share no <span class="egg" data-egg-id="common">common words</span>. This is the difference between keyword search and semantic search.</div>',
      "Popular embedding models include OpenAI's `text-embedding-3-small`, Google's `Gecko`, and open-source options like `BGE` and `GTE`. They vary in dimensionality (384 to 3072) and cost — smaller is faster, larger is more precise.",
      "<strong>Dense embeddings</strong> (like those from transformer models) capture rich semantics but require a neural network to compute. <strong>Sparse embeddings</strong> (like TF-IDF or BM25) are simpler, faster, and work well for exact keyword matches — many systems use both in a hybrid approach.",
      "The <strong>curse of dimensionality</strong> means that in very high dimensions, all points become far apart. This is why ANN (Approximate Nearest Neighbor) indexes like HNSW or IVF are used — they trade a tiny amount of accuracy for massive speed gains."
    ],
    quiz: [
      { q: "What does a text embedding represent?", opts: ["The number of words in the text", "The semantic meaning as a vector of numbers", "The grammatical structure", "The text's word count"], ans: 1 },
      { q: "How does cosine similarity work?", opts: ["Measures the angle between two vectors", "Counts matching words", "Calculates the difference in length", "Compares character by character"], ans: 0 },
      { q: "What is a vector database used for?", opts: ["Storing training data", "Retrieving similar embeddings by proximity", "Running LLM inference", "Generating text"], ans: 1 },
      { q: "Why are embeddings better than keyword search?", opts: ["They're faster", "They capture semantic meaning, not just exact words", "They use less storage", "They don't require indexing"], ans: 1 },
      { q: "Which is NOT an embedding model?", opts: ["text-embedding-3-small", "BGE", "Gecko", "GPT-4o"], ans: 3 },
      { q: "What is the curse of dimensionality?", opts: ["High-dimensional spaces make all points appear far apart", "Large models take too long to train", "Vectors are too big to store", "Computers can't handle high dimensions"], ans: 0 },
      { q: "What is an ANN index used for?", opts: ["Exact nearest neighbor search", "Approximate nearest neighbor search for speed", "Storing the original documents", "Generating embeddings"], ans: 1 },
      { q: "What is the difference between dense and sparse embeddings?", opts: ["Dense uses more words, sparse uses fewer", "Dense captures semantics via neural networks, sparse uses term frequency", "Dense is faster, sparse is more accurate", "There is no difference"], ans: 1 },
      { q: "What does HNSW stand for?", opts: ["Hierarchical Navigable Small World", "High-Order Neural Search Window", "Hyperdimensional Network Storage Wire", "Heuristic Nearest Similarity Walk"], ans: 0 },
      { q: "What is a typical embedding dimensionality range?", opts: ["10-50", "384-3072", "10000-50000", "2-10"], ans: 1 }
    ]
  },
  {
    id: 7, title: "Evaluation & Benchmarks", track: "Advanced", xp: 80,
    icon: "📊", cardIcon: "📏",
    lore: "The final chamber — the mirror of truth. Here, knowledge is measured and claims are tested.",
    content: [
      "How do you know if an AI model is actually good? <strong>Evaluation</strong> is one of the hardest problems in AI. A model that aces a test can still fail embarrassingly in the real world.",
      "<strong>Automatic metrics</strong> measure specific qualities. <strong>BLEU</strong> compares generated text to reference text (used in translation). <strong>ROUGE</strong> measures overlap (used in summarization). Both have flaws — they care about exact word matches, not meaning.",
      "<strong>Benchmark datasets</strong> are standardized tests. <strong>MMLU</strong> (Massive Multitask Language Understanding) tests knowledge across 57 subjects. <strong>HellaSwag</strong> tests commonsense reasoning. <strong>GSM8K</strong> tests grade-school math. These give you a single number to compare models.",
      "<strong>LLM-as-a-judge</strong> is a newer approach: use a strong model (like GPT-4) to evaluate another model's outputs. It's surprisingly effective for subjective qualities like helpfulness, tone, or creativity.",
      '<div class="highlight"><strong>🧠 Key insight:</strong> Benchmarks are useful but misleading. Many models are trained on benchmark data (<span class="egg" data-egg-id="contamination">data contamination</span>). A high MMLU score doesn\'t mean the model will be good at your specific task. Always evaluate on your own data.</div>',
      "For production systems, the best evaluation is <strong>human evaluation</strong>. Have domain experts rate output quality. Track metrics like <strong>hallucination rate</strong>, <strong>relevance</strong>, and <strong>task completion rate</strong>. Benchmarks are a starting point, not the finish line.",
      "<strong>Perplexity</strong> measures how 'surprised' the model is by a piece of text — lower is better. It's useful during training but doesn't correlate perfectly with output quality. <strong>Intrinsic evaluation</strong> (perplexity, loss) vs <strong>extrinsic evaluation</strong> (task performance, user satisfaction).",
      "<strong>Leaderboard contamination</strong> is a growing concern. Models are often trained on benchmark data leaked into pretraining corpora. This inflates scores without reflecting real capability. Always check whether the model's training data overlapped with the benchmark."
    ],
    quiz: [
      { q: "What does MMLU measure?", opts: ["Model memory usage", "Multitask language understanding across 57 subjects", "Machine learning training speed", "Maximum token length"], ans: 1 },
      { q: "What is a weakness of automatic metrics like BLEU?", opts: ["They're too slow to compute", "They match exact words, not meaning", "They require human judges", "They only work for translation"], ans: 1 },
      { q: "What is LLM-as-a-judge?", opts: ["A legal AI system", "Using one LLM to evaluate another LLM's outputs", "A benchmark for judicial reasoning", "A model that writes legal documents"], ans: 1 },
      { q: "What is data contamination in benchmarks?", opts: ["Training data with errors", "The model being trained on benchmark test data, inflating scores", "Corrupted embedding vectors", "Low-quality training data"], ans: 1 },
      { q: "What is the gold standard for evaluating production AI systems?", opts: ["MMLU score", "BLEU score", "Human evaluation by domain experts", "Model parameter count"], ans: 2 },
      { q: "What does perplexity measure?", opts: ["How surprised the model is by text — lower is better", "How complex the model architecture is", "The model's inference speed", "The number of parameters"], ans: 0 },
      { q: "What is intrinsic evaluation?", opts: ["Evaluating on user satisfaction", "Measuring loss or perplexity during training", "Evaluating on benchmark datasets", "Having humans rate outputs"], ans: 1 },
      { q: "What is a sign of leaderboard contamination?", opts: ["The model scores much higher than expected on a benchmark", "The model fails on simple tasks", "The model responds slowly", "The model has too many parameters"], ans: 0 },
      { q: "What is HellaSwag designed to test?", opts: ["Mathematical reasoning", "Commonsense reasoning and sentence completion", "Code generation", "Translation quality"], ans: 1 },
      { q: "Why might a high MMLU score not reflect real-world performance?", opts: ["MMLU is too easy", "The model may have seen the test data during training", "MMLU only tests math", "The benchmark is broken"], ans: 1 }
    ]
  },
  {
    id: 8, title: "Multimodal AI", track: "Advanced", xp: 100,
    icon: "👁️", cardIcon: "🎨",
    lore: "Vision meets language. The vault now sees what it once could only read.",
    content: [
      "<strong>Multimodal AI</strong> models process and generate multiple types of data — text, images, audio, video — within a single unified architecture. They bridge the gap between how humans perceive the world and how AI understands it.",
      "Models like <strong>CLIP</strong> (Contrastive Language-Image Pre-training) learn joint embeddings of text and images. They map both modalities into a shared vector space where a caption and its matching photo are close together.",
      "<strong>GPT-4V</strong> and similar vision-language models extend LLMs with image inputs. You can show them a chart and ask 'What's the trend?' or show a photo and ask 'What's wrong with this setup?' The model processes both modalities to generate answers.",
      '<div class="highlight"><strong>🧠 Key insight:</strong> Multimodal models don\'t "see" the way humans do. They convert images into patches, embed them like text tokens, and let the transformer find cross-modal patterns. An image is just another sequence of tokens to the model.</div>',
      "<strong>Diffusion models</strong> (like Stable Diffusion, DALL-E, Midjourney) generate images from text prompts. They work by starting with random noise and iteratively denoising it, guided by the text embedding, until a coherent image emerges.",
      "The <strong>encoder-decoder architecture</strong> in multimodal models typically uses separate encoders for each modality (vision encoder, text encoder) and a shared decoder or connector that fuses them. Qwen-VL, LLaVA, and Gemini are prominent examples.",
      "Audio and video are also entering the multimodal space. Models like <strong>Whisper</strong> (speech-to-text) and <strong>AudioLM</strong> extend the transformer into the audio domain. The trend is clear: future AI will natively process text, images, audio, and video.",
      "Key challenges include: <strong>alignment</strong> (making sure the model associates the right text with the right image), <strong>resolution</strong> (high-res images need more tokens), and <strong>reasoning across modalities</strong> (connecting visual evidence to textual claims)."
    ],
    quiz: [
      { q: "What is multimodal AI?", opts: ["AI that uses multiple GPUs", "AI that processes multiple data types like text and images", "AI that runs on multiple devices", "AI with multiple layers"], ans: 1 },
      { q: "What does CLIP do?", opts: ["Generates images from text", "Learns joint embeddings of text and images", "Classifies images only", "Translates text to speech"], ans: 1 },
      { q: "How do vision-language models process images?", opts: ["They convert images to patches and embed them like text tokens", "They describe images in words first", "They use a separate SQL database", "They only process text descriptions"], ans: 0 },
      { q: "What is a diffusion model?", opts: ["A model that spreads information across layers", "A model that generates images by denoising random noise guided by text", "A model that diffuses gradients during training", "A model that splits data across GPUs"], ans: 1 },
      { q: "What is a key challenge in multimodal AI?", opts: ["Too much training data", "Aligning text representations with visual representations", "Lack of GPUs", "Models are too small"], ans: 1 },
      { q: "How does GPT-4V handle image inputs?", opts: ["It converts images to text descriptions first", "It processes image patches as tokens in the transformer", "It only looks at image metadata", "It uses a separate image-only model"], ans: 1 },
      { q: "What does the encoder in a multimodal model do?", opts: ["Generates the final output", "Encodes each modality into a representation the model can process", "Decodes the model's thoughts", "Compresses the training data"], ans: 1 },
      { q: "What is Whisper?", opts: ["An image generation model", "A speech-to-text model from OpenAI", "A text-to-speech model", "A multimodal benchmark"], ans: 1 },
      { q: "Why does high image resolution pose a challenge?", opts: ["It requires more tokens to process, increasing compute", "Images look too realistic", "It confuses the model", "It reduces generation quality"], ans: 0 },
      { q: "Which of these is a multimodal model?", opts: ["GPT-3", "GPT-4V", "BERT", "Text-davinci-003"], ans: 1 }
    ]
  },
  {
    id: 9, title: "AI Agents & Tool Use", track: "Practical", xp: 120,
    icon: "🤖", cardIcon: "🔌",
    lore: "The vault awakens. Knowledge alone is not enough — action is the final test of understanding.",
    content: [
      "An <strong>AI agent</strong> is an LLM-powered system that can perceive its environment, reason about goals, and take actions using tools. Unlike a chatbot that just responds, an agent decides what to do and executes multi-step plans.",
      "<strong>Function calling</strong> (also called tool use) is the core mechanism. The LLM is given descriptions of available tools (APIs, functions, databases) and can request to call them by outputting structured JSON. The system executes the tool and returns the result.",
      "The <strong>ReAct</strong> pattern (Reasoning + Acting) interleaves thinking and doing: the model thinks about what to do, takes an action, observes the result, thinks again, and continues until the task is complete. This is the foundation of most agent frameworks.",
      '<div class="highlight"><strong>🧠 Key insight:</strong> The model doesn\'t actually "use" tools — it generates text that describes a tool call. The surrounding infrastructure executes the call and feeds the result back. The LLM is the planner, not the executor.</div>',
      "Agent frameworks like <strong>LangChain</strong>, <strong>CrewAI</strong>, and <strong>AutoGen</strong> provide the infrastructure: tool definitions, memory, orchestration, and error handling. They let you build agents that can browse the web, run code, query databases, and chain multiple steps.",
      "Key agent patterns: (1) <strong>Single-agent</strong> — one LLM with tools. (2) <strong>Multi-agent</strong> — multiple specialized agents working together (e.g., a researcher agent and a writer agent). (3) <strong>Agent-as-a-tool</strong> — one agent can delegate to sub-agents.",
      "Challenges include: <strong>error recovery</strong> (agents can get stuck in loops), <strong>safety</strong> (agents with tool access can cause real-world harm), <strong>cost</strong> (multi-step agents burn tokens fast), and <strong>reliability</strong> (LLM mistakes compound across steps).",
      "<strong>Memory</strong> in agents comes in two forms: <strong>short-term</strong> (the conversation context window) and <strong>long-term</strong> (external storage like vector databases or summaries). Good agent design manages what to keep, what to summarize, and what to forget."
    ],
    quiz: [
      { q: "What is an AI agent?", opts: ["Any chatbot", "An LLM-powered system that reasons and takes actions using tools", "A model that runs automatically", "A type of prompt engineering"], ans: 1 },
      { q: "How does function calling work?", opts: ["The model executes code directly", "The model outputs structured JSON describing a tool call, and infrastructure executes it", "The model ignores tools", "Tools call the model"], ans: 1 },
      { q: "What is the ReAct pattern?", opts: ["A reactive programming framework", "Interleaving reasoning and acting in a loop", "A type of neural network", "A benchmark for agents"], ans: 1 },
      { q: "What does the LLM do in an agent system?", opts: ["Executes all tool calls directly", "Acts as the planner by deciding which tools to call", "Runs the operating system", "Stores memory"], ans: 1 },
      { q: "What is a challenge of AI agents?", opts: ["They are too slow to respond", "Errors compound across steps, making multi-step agents unreliable", "They cannot use tools", "They only work with one tool"], ans: 1 },
      { q: "What is the difference between short-term and long-term memory in agents?", opts: ["Short-term is in the context window, long-term is external storage", "Short-term is RAM, long-term is disk", "There is no difference", "Short-term is for text, long-term is for images"], ans: 0 },
      { q: "Which is NOT an agent framework?", opts: ["LangChain", "CrewAI", "AutoGen", "PyTorch"], ans: 3 },
      { q: "What is multi-agent orchestration?", opts: ["Multiple specialized agents working together on a task", "Running agents on multiple GPUs", "Training multiple models at once", "A single agent with many tools"], ans: 0 },
      { q: "Why is safety a concern with agents?", opts: ["Agents with tool access can cause real-world harm", "Agents are too slow", "Agents can't be controlled", "Agents don't follow instructions"], ans: 0 },
      { q: "What happens when an agent encounters an error?", opts: ["It crashes permanently", "It needs error recovery logic to retry or adjust", "It ignores the error and continues", "It asks the user to fix it"], ans: 1 }
    ]
  },
  {
    id: 10, title: "Alignment, Safety & Ethics", track: "Advanced", xp: 100,
    icon: "🛡️", cardIcon: "⚖️",
    lore: "The deepest chamber. Power without direction is dangerous — here we learn to wield knowledge responsibly.",
    content: [
      "<strong>AI alignment</strong> is the problem of ensuring AI systems do what humans actually want — not just what we literally instruct. A misaligned AI might follow instructions to the letter in ways that cause unintended harm.",
      "<strong>Reinforcement Learning from Human Feedback (RLHF)</strong> is the most widely used alignment technique. After pretraining, humans rank model outputs, and a reward model learns these preferences. The LLM is then fine-tuned to maximize this reward.",
      '<div class="highlight"><strong>🧠 Key insight:</strong> Alignment is fundamentally hard because humans disagree with each other. What one person considers "helpful" another may find "harmful." Alignment isn\'t a technical problem with a single answer — it\'s a values problem.</div>',
      "<strong>Constitutional AI</strong> (used by Anthropic's Claude) is an alternative to RLHF. Instead of human rankings, the model is given a set of principles (a 'constitution') and self-critiques its outputs against them. This scales better and is more transparent.",
      "Safety measures include: <strong>content filters</strong> (blocking harmful outputs), <strong>red teaming</strong> (deliberately probing for vulnerabilities), <strong>guardrails</strong> (NeMo Guardrails, Guardrails AI), and <strong>rate limiting</strong> (preventing abuse).",
      "Key ethical concerns: (1) <strong>Bias</strong> — models amplify stereotypes from training data. (2) <strong>Privacy</strong> — models can memorize and expose personal information. (3) <strong>Misinformation</strong> — convincing but false outputs. (4) <strong>Job displacement</strong> — automation of knowledge work.",
      "<strong>Responsible AI</strong> frameworks (Microsoft, Google, NIST) define principles: fairness, reliability, privacy, inclusivity, transparency, and accountability. These are guidelines for building and deploying AI systems ethically.",
      "The <strong>alignment tax</strong> is the observation that heavily aligned models can be less capable on certain tasks. Balancing safety with utility is an active area of research — the goal is to make models both capable and constrained."
    ],
    quiz: [
      { q: "What is AI alignment?", opts: ["Making AI faster", "Ensuring AI systems do what humans actually want", "Aligning AI with other software", "A type of model training"], ans: 1 },
      { q: "How does RLHF work?", opts: ["Humans rank outputs to train a reward model, then the LLM is fine-tuned to maximize reward", "The model reads human feedback directly", "Humans write code to fix the model", "The model aligns itself"], ans: 0 },
      { q: "What is Constitutional AI?", opts: ["AI that follows a legal constitution", "The model critiques its own outputs against a set of principles", "AI for constitutional lawyers", "A type of government AI"], ans: 1 },
      { q: "What is red teaming?", opts: ["Using red-colored interfaces", "Deliberately probing an AI system for vulnerabilities", "Training models on red data", "A type of model architecture"], ans: 1 },
      { q: "What is the alignment tax?", opts: ["The cost of training aligned models", "Aligned models can be less capable on certain tasks", "A tax on AI companies", "The price of safety tools"], ans: 1 },
      { q: "Which is NOT a principle of responsible AI?", opts: ["Fairness", "Transparency", "Maximizing parameters", "Privacy"], ans: 2 },
      { q: "Why is bias a concern in AI?", opts: ["Models amplify stereotypes present in training data", "Bias makes models faster", "Bias improves accuracy", "Bias is not a real concern"], ans: 0 },
      { q: "How can models expose private information?", opts: ["They can memorize and output personal data from training", "They cannot access private data", "They only use public data", "They anonymize automatically"], ans: 0 },
      { q: "What is a guardrail in AI safety?", opts: ["A physical barrier", "Software that constrains model outputs to safe boundaries", "A type of model", "A training technique"], ans: 1 },
      { q: "Why is alignment fundamentally hard?", opts: ["Because humans disagree on what is good or harmful", "Because models are too small", "Because alignment algorithms don't exist", "Because it's not an important problem"], ans: 0 }
    ]
  }
];

var BADGES = [
  { id: "apprentice", name: "Apprentice", icon: "🌱", desc: "Complete your first module", level: 1 },
  { id: "explorer", name: "Explorer", icon: "🗺️", desc: "Reach level 2", level: 2 },
  { id: "adept", name: "Adept", icon: "⚡", desc: "Reach level 3", level: 3 },
  { id: "scholar", name: "Scholar", icon: "📖", desc: "Reach level 4", level: 4 },
  { id: "architect", name: "Architect", icon: "🏛️", desc: "Reach level 5", level: 5 },
  { id: "sage", name: "Sage", icon: "🧠", desc: "Reach level 6", level: 6 },
  { id: "luminary", name: "Luminary", icon: "🌟", desc: "Reach level 7", level: 7 },
  { id: "grandmaster", name: "Grandmaster", icon: "👑", desc: "Reach level 8", level: 8 },
  { id: "egg_hunter", name: "Egg Hunter", icon: "🥚", desc: "Find 3 hidden relics", hidden: true },
  { id: "streak_3", name: "Streak Starter", icon: "🔥", desc: "Maintain a 3-day streak", hidden: true },
  { id: "streak_7", name: "Streak Master", icon: "🔥", desc: "Maintain a 7-day streak", hidden: true },
  { id: "completionist", name: "Completionist", icon: "🏆", desc: "Complete all 10 modules", hidden: true }
];
