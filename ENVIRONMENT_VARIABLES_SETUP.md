# Verifying and Setting OPENAI_API_KEY Environment Variable

## Why is OPENAI_API_KEY important?

The `OPENAI_API_KEY` environment variable stores your OpenAI API key, which is required for the app's AI features to function correctly. Missing or incorrect configuration of this variable leads to 500 Internal Server Errors when calling AI-related APIs.

---

## How to Verify if OPENAI_API_KEY is Set

### Locally (Development)

1. Open your terminal.
2. Run the following command:

On Windows (Command Prompt or PowerShell):
```bash
echo %OPENAI_API_KEY%
```

On macOS/Linux:
```bash
echo $OPENAI_API_KEY
```

3. If you receive no output or an empty line, it means the variable is not set.

---

## How to Set OPENAI_API_KEY Locally

1. Create a `.env.local` file at the root of your project if it doesn't exist.
2. Add the following line to `.env.local`:

```
OPENAI_API_KEY=your_openai_api_key_here
```

3. Replace `your_openai_api_key_here` with your actual OpenAI API key string.

4. Save the file and restart your development server.

---

## How to Set OPENAI_API_KEY in Production

- Depending on your hosting provider (Vercel, Heroku, AWS, etc.), set the environment variable `OPENAI_API_KEY` via the provider's dashboard or CLI.

Example for Vercel:

1. Go to your project dashboard.
2. Go to Settings > Environment Variables.
3. Add a new variable with:
   - Name: `OPENAI_API_KEY`
   - Value: your OpenAI API key
   - Environment: Production (and Preview if needed)
4. Save and redeploy the project.

---

## Additional Notes

- Never commit your API key or `.env.local` file to public repositories.
- Ensure the environment variables are correctly loaded by your deployment platform.
- If you continue to experience issues, check logs for specific error messages and verify API usage quota and billing in your OpenAI account.

---
