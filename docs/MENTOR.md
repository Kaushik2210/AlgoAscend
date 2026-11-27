# AlgoMentor

The workspace offers authored hints by default. To enable optional AI guidance, set `MENTOR_CHAT_URL` to a full OpenAI-compatible chat completions endpoint and set `MENTOR_MODEL`. Add `MENTOR_API_KEY` if the service requires bearer authentication. Choose a model and endpoint that accept `messages` and `max_completion_tokens`.

Only the submitted question, selected language and mode, and public challenge context leave the application. Drafts, notes, progress, test input, hidden cases, and judge output are excluded. Replies are displayed as plain text and labeled as AI-generated. The model has no tools or access to the execution service. The application limits accepted input, concurrent requests, output size, and upstream waiting time.

Test the exact model and provider before enabling it for learners. The public application needs authentication, shared request quotas, and provider spending limits before enabling paid inference.

- [OpenAI Chat Completions](https://developers.openai.com/api/reference/resources/chat)
- [Gemini OpenAI compatibility](https://ai.google.dev/gemini-api/docs/openai)
- [Ollama OpenAI compatibility](https://docs.ollama.com/api/openai-compatibility)
