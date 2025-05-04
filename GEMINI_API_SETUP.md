# Setting Up the Gemini API Key

The AI Code Reviewer extension requires a valid Gemini API key to function. This guide will help you set up the API key.

## Step 1: Get a Gemini API Key

1. Go to [Google AI Studio](https://ai.google.dev/)
2. Sign in with your Google account
3. Click on "Get API key" in the top right corner
4. Create a new API key or use an existing one
5. Copy the API key

## Step 2: Add the API Key to the Backend

1. Open the `backend/.env` file
2. Replace `your_gemini_api_key_here` with your actual Gemini API key:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```
3. Save the file

## Step 3: Verify the API Key

1. Start the backend server:
   ```
   cd backend
   npm start
   ```
2. Open a web browser and navigate to:
   ```
   http://localhost:3000/test-gemini
   ```
3. If the API key is valid, you should see a success message
4. If you see an error message, check that your API key is correct

## Troubleshooting

### Invalid API Key

If you see an error message like "Invalid API key", make sure:
- You've copied the entire API key correctly
- There are no extra spaces or characters
- The API key is active in your Google AI Studio account

### API Quota Exceeded

If you see an error message about quota limits:
- Check your usage in the Google AI Studio dashboard
- Consider creating a new API key
- Wait until your quota resets

### Network Errors

If you see network errors:
- Make sure your internet connection is working
- Check if there are any firewall or proxy settings blocking the connection
- Verify that the Gemini API is available (check the Google AI Studio status page)

## API Key Security

- Keep your API key secure and do not share it
- Do not commit the `.env` file with your API key to version control
- Consider using environment variables or a secrets manager for production deployments
