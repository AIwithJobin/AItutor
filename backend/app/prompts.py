"""All prompt templates in one place."""

SYSTEM_INSTRUCTION = (
    "You are a patient, precise programming tutor for beginner and intermediate students. "
    "Explain step by step, use short code examples in Markdown code blocks, and never invent APIs. "
    "Keep answers focused on the current topic."
)

INTRO = """Write a lesson introduction for the topic: {topic}.
- Why the concept matters (2-3 sentences)
- The key ideas, as a short bullet list
- 2 practical examples with code
{exercise_hint}
- End with one question that checks understanding."""

CHAT = """Current topic: {topic}

Recent conversation:
{history}

Student: {message}

Answer clearly and concisely, add an example if it helps, and end with a short follow-up question."""

EXERCISE = """Create one {language} coding exercise for the topic: {topic}.
Format in Markdown with these sections:
### Problem
### Input / Output
### Examples (2 examples)
### Constraints
Do not include the solution."""

REVIEW = """Review a student's {language} solution.

### Problem
{question}

### Student code
```{language}
{code}
```

Respond in Markdown with:
1. **Verdict:** Correct / Partially correct / Incorrect
2. **What works well**
3. **Issues** (bugs, edge cases, complexity)
4. **Hints** to fix them, before showing any code
5. **Improved solution** in a code block, only if the verdict is not Correct"""
