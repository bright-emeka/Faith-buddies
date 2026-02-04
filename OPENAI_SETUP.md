# OpenAI API Setup Guide for Bible Social

This guide helps you set up the OpenAI API for the AI Bible chat feature.

## Step 1: Create OpenAI Account

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Click "Sign up" (or log in if you have an account)
3. Complete email verification
4. Add payment method (required for API usage)

## Step 2: Create API Key

1. In the OpenAI Dashboard, click your profile icon (top right)
2. Select **"API keys"** from the dropdown
3. Click **"+ Create new secret key"**
4. Give it a name like "Bible Social Backend"
5. Copy the key immediately - **you won't see it again**

Format: `sk-...` (long string starting with "sk-")

## Step 3: Add to Backend .env

Open `backend/.env` and add:

```
OPENAI_API_KEY=sk-your-full-key-here
```

Example:
```
OPENAI_API_KEY=sk-proj-abc123def456ghi789jkl012mno345
```

## Step 4: Verify API Key Works

Test the key by making a simple request:

```bash
curl https://api.openai.com/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer sk-your-key" \
  -d '{
    "model": "gpt-3.5-turbo",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

You should get a response (not an error about invalid key).

## Step 5: Monitor Usage

The backend uses `gpt-3.5-turbo` model. To monitor your usage:

1. Go to [Usage Dashboard](https://platform.openai.com/account/usage/overview)
2. Check your current usage and limits
3. Set usage limits if desired (Settings > Billing > Usage Limits)

## Understanding API Costs

- **Model**: `gpt-3.5-turbo` is the fastest and cheapest option
- **Pricing**: ~$0.001-0.002 per 1000 tokens (words)
- **Typical chat**: ~500-1000 tokens per exchange

Example:
- 1,000 API calls with 1000 tokens each = ~$1-2
- Budget $10-20/month for development use
- Enable usage limits to prevent surprises

## Setting Up Cost Controls

1. Go to [Billing Settings](https://platform.openai.com/account/billing/overview)
2. Click **"Usage Limits"**
3. Set a monthly budget (e.g., $20)
4. API requests will be rejected if you hit the limit

## Troubleshooting

### "Invalid API key"
- Make sure the key starts with `sk-`
- Copy the entire key (don't trim whitespace)
- Check you're using a **secret key**, not a publishable key
- Regenerate key if it's very old

### "Rate limit exceeded"
- You're making too many requests too fast
- Add delay between requests
- Consider upgrading to a paid tier if this persists

### "Insufficient credits"
- You haven't set up a payment method
- Check https://platform.openai.com/account/billing/overview
- Add a valid credit/debit card

### "Authorization header invalid"
- Make sure format is exactly: `Authorization: Bearer sk-...`
- No extra spaces or prefixes
- Backend will add this automatically

## API Key Security

⚠️ **CRITICAL**: Never commit your API key to git!

Practices:
- Use `.env` file (already in `.gitignore`)
- Never share your API key
- If key is compromised, regenerate it immediately
- Rotate keys periodically
- In production, use environment variables

## Model Choice: Why gpt-3.5-turbo?

For the Bible AI, we chose `gpt-3.5-turbo` because:
- **Fast**: ~1 second response time
- **Cheap**: Low cost per token
- **Capable**: Understands scripture and context
- **Reliable**: Consistent results

Alternative models:
- `gpt-4`: More accurate but slower (~5x cost)
- `gpt-4-turbo`: Faster than gpt-4, still expensive

## Production Considerations

1. **Rate Limiting**: Add request throttling to prevent abuse
2. **Caching**: Store common questions to avoid repeated API calls
3. **Token Limits**: Set `max_tokens` to control response length
4. **Budget**: Monitor spending and set alerts
5. **Fallback**: Have a response when API is unavailable

## API Response Format

The backend receives responses in this format:

```json
{
  "id": "chatcmpl-...",
  "object": "chat.completion",
  "created": 1234567890,
  "model": "gpt-3.5-turbo-0125",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "According to John 3:16, God loved the world so much that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life."
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 250,
    "completion_tokens": 150,
    "total_tokens": 400
  }
}
```

The backend extracts and returns just the `message.content` to the frontend.

## Testing the API Integration

Once backend is running:

1. Start backend: `npm run dev` (in backend directory)
2. Start frontend: `npm start` (in frontend directory)
3. Sign up with a test account
4. Ask the AI: "What does the Bible say about faith?"
5. You should get a scripture-based response

If you get errors:
- Check backend logs for API errors
- Verify `OPENAI_API_KEY` in `.env`
- Check OpenAI usage dashboard for errors
- Make sure API key is active and has usage credits

## Tips for Better Responses

The backend includes this system prompt to guide AI responses:

```
You are a wise and compassionate Bible teacher...
Answer ALL questions strictly from the Bible
Always quote scripture references (Book Chapter:Verse)
...
```

This ensures the AI:
- Stays focused on Scripture
- Provides verse citations
- Maintains biblical accuracy
- Uses humble, loving tone

## OpenAI Links

- [OpenAI API Documentation](https://platform.openai.com/docs/api-reference)
- [Chat Completions Endpoint](https://platform.openai.com/docs/api-reference/chat/create)
- [API Usage Dashboard](https://platform.openai.com/account/usage/overview)
- [Billing Settings](https://platform.openai.com/account/billing/overview)

---

Need help? Check the main README.md or OpenAI documentation.
