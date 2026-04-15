# Stripe, Beehiiv, And Tally Wire-Up Checklist

Use this checklist to connect JetLag's landing page to real external tools.

## 1. Stripe Payment Link

### Create

- Product name: `JetLag Express Plan`
- Description: `Personalized jet lag recovery plan for one upcoming trip`
- Price: `$29`
- Optional upsell product: `JetLag Express Rush`
- Optional upsell price: `$49`

### Stripe Fields To Fill

- Public business name
- Support email
- Statement descriptor
- Product name
- Product description
- Price amount
- Currency
- Payment link URL
- Success URL
- Cancel URL

### Recommended Success URL

Send buyers to a page or message that says:

- thank you
- next step is intake
- turnaround expectation
- support email

### Landing Page URL Placeholder

Replace:

- `https://YOUR_PAYMENT_LINK_HERE`

## 2. Beehiiv Newsletter Signup

### Create

- Publication name: `JetLag`
- Tagline: `Travel recovery intelligence for people who need to function across time zones`
- Signup CTA: `Join the newsletter`

### Beehiiv Fields To Fill

- Publication name
- Publication URL
- Sender name
- Sender email
- Welcome email enabled or disabled
- Signup form URL
- Confirmation page URL
- Custom audience tag, if used

### Suggested Welcome Copy Points

- what JetLag sends
- how often it sends
- why it is different
- optional CTA to reply with upcoming route

### Landing Page URL Placeholder

Replace:

- `https://YOUR_NEWSLETTER_SIGNUP_URL_HERE`

## 3. Tally Feedback Form

### Form Name

`JetLag Feedback`

### Questions To Include

- Name
- Email
- Are you traveling soon?
- Route or destination
- What usually goes wrong with jet lag for you?
- Have you used any jet lag tools before?
- What did you like or dislike about them?
- Would you pay for a personalized recovery plan?
- Anything else you want JetLag to solve?

### Tally Fields To Configure

- Form title
- Form description
- Required email field
- Required open text pain-point field
- Optional route field
- Hidden source field, if desired
- Thank-you page message
- Form URL

### Landing Page URL Placeholder

Replace:

- `https://YOUR_FEEDBACK_FORM_URL_HERE`

## 4. Final Wire-Up Pass

Once the links exist, update these paths:

- `revenue-sprint/landing-page/index.html`
- any deployed site copy
- newsletter CTA copy where relevant

## 5. Minimum Live Stack

To be fully live, JetLag needs:

1. Public landing page URL
2. Stripe payment link
3. Beehiiv signup form URL
4. Tally feedback form URL
