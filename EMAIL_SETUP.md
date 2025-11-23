# Email Service Setup Instructions

## Get Your Resend API Key

1. **Sign up for Resend** (free tier - 100 emails/day)
   - Go to: https://resend.com/signup
   - Sign up with your email or GitHub

2. **Get your API key**
   - After signing up, go to: https://resend.com/api-keys
   - Click "Create API Key"
   - Give it a name (e.g., "BrightSteps Development")
   - Copy the API key (starts with `re_`)

3. **Add to your `.env` file**
   ```
   RESEND_API_KEY="re_your_api_key_here"
   RESEND_FROM_EMAIL="onboarding@resend.dev"
   ```

4. **For production (optional)**
   - Verify your domain in Resend dashboard
   - Update `RESEND_FROM_EMAIL` to use your domain (e.g., "noreply@yourdomain.com")

## Test It

1. Restart your dev server: `npm run dev`
2. Go to `/forgot-password`
3. Enter your email
4. Check your email inbox for the reset link!

## Free Tier Limits

- 100 emails per day
- 3,000 emails per month
- Perfect for development and small projects

## Notes

- The email will come from "onboarding@resend.dev" by default
- To use your own domain, you need to verify it in Resend
- Emails might go to spam initially - mark as "Not Spam" to train filters
