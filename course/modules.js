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
      "Today, every major AI system — GPT, Claude, Gemini, Llama — is built on the transformer architecture. It's the foundation everything else stands on."
    ],
    quiz: [
      { q: "What problem did transformers solve that RNNs had?", opts: ["They were too expensive to train", "They couldn't process images", "They processed words sequentially and had limited memory", "They required labeled data"], ans: 2 },
      { q: "What did the paper 'Attention Is All You Need' introduce?", opts: ["The first neural network", "The transformer architecture", "Reinforcement learning", "Convolutional layers"], ans: 1 },
      { q: "What makes transformers faster to train than RNNs?", opts: ["They use less data", "They process all words in parallel", "They have fewer parameters", "They run on CPUs"], ans: 1 },
      { q: "What are the two main parts of a transformer?", opts: ["Encoder and decoder", "Input and output", "Training and inference", "CNN and RNN"], ans: 0 },
      { q: "Which of these models is NOT built on transformers?", opts: ["GPT-4", "Claude", "Llama", "All of these use transformers"], ans: 3 }
    ]
  },
  {
    id: 2, title: "Self-Attention", track: "Core", xp: 80,
    icon: "🔍", cardIcon: "🕸️",
    lore: "Deeper in the vault, you find a web of interconnected mirrors. Each reflection shows a different angle of the same concept.",
    content: [
      "<strong>Self-attention</strong> is the engine inside every transformer. It answers one question: which words in this sentence matter most to each other?",
      "For every word, the model creates three vectors: a <strong>Query (Q)</strong>, a <strong>Key (K)</strong>, and a <strong>Value (V)</strong>. Think of Q as 'what am I looking for?' and K as 'what do I have?' — the match between them determines attention.",
      "The attention score is computed by taking the <strong>dot product</strong> of Q and K, scaling it down, then passing through <strong>softmax</strong> to get a probability distribution. This tells the model how much to focus on each other word.",
      'Instead of one attention head, transformers use <strong>multi-head attention</strong> — 8 to 96 parallel attention layers. Each head learns a different relationship pattern (e.g., syntax, proximity, semantic similarity).',
      '<div class="highlight"><strong>🧠 Key insight:</strong> Self-attention is why transformers can handle long documents. A word at position 1 can directly attend to a word at position 1000 — no forgetting curve. This was impossible with RNNs.</div>',
      "The outputs from all heads are concatenated and projected down. This rich representation is then fed through feed-forward layers, added to the original input (residual connection), and normalized — repeated across dozens of layers."
    ],
    quiz: [
      { q: "What does the Query (Q) vector represent?", opts: ["What I have", "What I'm looking for", "The final output", "The word position"], ans: 1 },
      { q: "What does softmax do in attention?", opts: ["Normalizes scores into probabilities", "Selects the top word", "Drops low-scoring words", "Encodes position"], ans: 0 },
      { q: "Why is multi-head attention useful?", opts: ["It's faster than single-head", "Each head learns different relationship patterns", "It reduces parameter count", "It eliminates the need for feed-forward layers"], ans: 1 },
      { q: "What problem does self-attention solve that RNNs couldn't?", opts: ["Processing images", "Handling long-range dependencies in text", "Working without GPUs", "Generating text"], ans: 1 },
      { q: "What is a residual connection in transformers?", opts: ["Adding the input back to the output of a layer", "A backup network", "Skipping the attention step", "Reducing the model size"], ans: 0 }
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
      "RAG powers most enterprise AI applications today: customer support bots, research assistants, code documentation tools, and — yes — your AI Knowledge Explainers are essentially a RAG pipeline over curated educational content."
    ],
    quiz: [
      { q: "What does RAG stand for?", opts: ["Recurrent Attention Generation", "Retrieval-Augmented Generation", "Random Access Generation", "Reinforced Auto-Grading"], ans: 1 },
      { q: "What problem does RAG solve?", opts: ["Model training speed", "Knowledge cutoff and hallucination", "Model size", "Inference cost"], ans: 1 },
      { q: "What is retrieved from the database in RAG?", opts: ["Entire documents", "Embeddings (vector representations)", "Model weights", "Training data"], ans: 1 },
      { q: "Which of these is a benefit of RAG?", opts: ["No need to retrain the model to add new information", "Faster inference than normal generation", "Smaller model size", "No external dependencies"], ans: 0 },
      { q: "In a RAG pipeline, what does the LLM receive?", opts: ["Only the retrieved documents", "Only the user's question", "Both the retrieved documents and the user's question", "A summary of the database"], ans: 2 }
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
      "When should you fine-tune? (1) You need the model to follow a specific output format. (2) You're building a code assistant that needs to understand your codebase. (3) You need the model to adopt a specific persona consistently. Otherwise, try prompting first."
    ],
    quiz: [
      { q: "What does full fine-tuning do?", opts: ["Creates a new model from scratch", "Updates all weights of a pre-trained model", "Only changes the output layer", "Freezes all weights"], ans: 1 },
      { q: "What does LoRA stand for?", opts: ["Long-Range Attention", "Low-Rank Adaptation", "Local Response Architecture", "Layer Optimization for Rapid Alignment"], ans: 1 },
      { q: "What is the main advantage of PEFT methods like LoRA?", opts: ["They improve inference speed", "They train far fewer parameters than full fine-tuning", "They eliminate the need for GPUs", "They work without training data"], ans: 1 },
      { q: "What does QLoRA add on top of LoRA?", opts: ["Quantum computing", "Quantization to 4-bit precision", "Query optimization", "Quick learning rate scheduling"], ans: 1 },
      { q: "When should you consider fine-tuning?", opts: ["When you need to change the model's behavior consistently", "For every use case as a first step", "When prompt engineering fails once", "Only for image generation"], ans: 0 }
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
      "Advanced techniques include: <strong>structured outputs</strong> (asking for JSON), <strong>temperature control</strong> (lower = deterministic, higher = creative), <strong>role prompting</strong> ('you are an expert data architect'), and <strong>self-consistency</strong> (run the same prompt multiple times and take the majority answer)."
    ],
    quiz: [
      { q: "What is few-shot prompting?", opts: ["Asking the model to generate multiple responses", "Giving examples in the prompt before asking the real question", "Using a smaller model for faster responses", "Reducing the number of tokens in the output"], ans: 1 },
      { q: "What does chain-of-thought prompting improve?", opts: ["Output speed", "Reasoning accuracy on complex tasks", "Model memory", "Factual knowledge"], ans: 1 },
      { q: "What does a lower temperature setting do?", opts: ["Makes the model more creative", "Makes the output more deterministic", "Speeds up generation", "Reduces token usage"], ans: 1 },
      { q: "What is a system prompt?", opts: ["The first message in a conversation that sets model behavior", "A prompt that generates system code", "A prompt about computer systems", "The model's training objective"], ans: 0 },
      { q: "Which technique asks the model to reason step-by-step?", opts: ["Zero-shot", "Few-shot", "Chain-of-thought", "Structured output"], ans: 2 }
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
      "Popular embedding models include OpenAI's `text-embedding-3-small`, Google's `Gecko`, and open-source options like `BGE` and `GTE`. They vary in dimensionality (384 to 3072) and cost — smaller is faster, larger is more precise."
    ],
    quiz: [
      { q: "What does a text embedding represent?", opts: ["The number of words in the text", "The semantic meaning as a vector of numbers", "The grammatical structure", "The text's word count"], ans: 1 },
      { q: "How does cosine similarity work?", opts: ["Measures the angle between two vectors", "Counts matching words", "Calculates the difference in length", "Compares character by character"], ans: 0 },
      { q: "What is a vector database used for?", opts: ["Storing training data", "Retrieving similar embeddings by proximity", "Running LLM inference", "Generating text"], ans: 1 },
      { q: "Why are embeddings better than keyword search?", opts: ["They're faster", "They capture semantic meaning, not just exact words", "They use less storage", "They don't require indexing"], ans: 1 },
      { q: "Which is NOT an embedding model?", opts: ["text-embedding-3-small", "BGE", "Gecko", "GPT-4o"], ans: 3 }
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
      "For production systems, the best evaluation is <strong>human evaluation</strong>. Have domain experts rate output quality. Track metrics like <strong>hallucination rate</strong>, <strong>relevance</strong>, and <strong>task completion rate</strong>. Benchmarks are a starting point, not the finish line."
    ],
    quiz: [
      { q: "What does MMLU measure?", opts: ["Model memory usage", "Multitask language understanding across 57 subjects", "Machine learning training speed", "Maximum token length"], ans: 1 },
      { q: "What is a weakness of automatic metrics like BLEU?", opts: ["They're too slow to compute", "They match exact words, not meaning", "They require human judges", "They only work for translation"], ans: 1 },
      { q: "What is LLM-as-a-judge?", opts: ["A legal AI system", "Using one LLM to evaluate another LLM's outputs", "A benchmark for judicial reasoning", "A model that writes legal documents"], ans: 1 },
      { q: "What is data contamination in benchmarks?", opts: ["Training data with errors", "The model being trained on benchmark test data, inflating scores", "Corrupted embedding vectors", "Low-quality training data"], ans: 1 },
      { q: "What is the gold standard for evaluating production AI systems?", opts: ["MMLU score", "BLEU score", "Human evaluation by domain experts", "Model parameter count"], ans: 2 }
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
  { id: "completionist", name: "Completionist", icon: "🏆", desc: "Complete all 7 modules", hidden: true }
];
