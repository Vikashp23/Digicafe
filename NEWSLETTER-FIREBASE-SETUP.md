# DigiCafe monthly newsletter — Firebase activation

The public website now displays a newsletter signup in two places:
- A first-visit popup (shown after 9 seconds; dismissed after the visitor closes it or subscribes).
- A permanent monthly newsletter form in the footer.

The form records the email address, optional name, consent timestamp, signup source, channel (email), frequency (monthly), and subscribed status in the Firestore collection `newsletterSubscribers`.

## 1. Publish the Firestore rule

Open Firebase Console → project **digicafe-ee519** → Firestore Database → Rules.

Merge the following match block inside the existing `match /databases/{database}/documents` block. Do not replace unrelated rules.

```text
match /newsletterSubscribers/{subscriberId} {
  allow create: if
    request.resource.data.keys().hasAll([
      'email', 'channel', 'frequency', 'consent',
      'consentText', 'consentSource', 'consentAt', 'status', 'updatedAt'
    ]) &&
    request.resource.data.email is string &&
    request.resource.data.email.size() >= 6 &&
    request.resource.data.email.size() <= 254 &&
    request.resource.data.email.matches('^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$') &&
    request.resource.data.channel == 'email' &&
    request.resource.data.frequency == 'monthly' &&
    request.resource.data.consent == true &&
    request.resource.data.status == 'subscribed' &&
    request.resource.data.consentSource in ['footer', 'popup'];

  allow read, update, delete: if request.auth != null &&
    request.auth.token.email in [
      'digicafe.admin@gmail.com',
      'vikashpathak.mgmt@gmail.com',
      'admin@digicafe.com',
      'support@digicafe.com'
    ];
}
```

This allows anonymous visitors to add a consented subscription but does not let the public list or download subscriber records. Only the listed authenticated admin accounts can read/manage them. Keep your existing rules intact and test them in the Rules Playground before publishing.

## 2. Email delivery and monthly campaigns

The website signup only stores subscribers; it does not send a newsletter by itself. The browser must never be given an email-provider API key, and a public page must not be allowed to send arbitrary messages through the `mail` collection.

Your site already contains a Firebase Email Trigger pattern for the `mail` collection, but the repository does not prove that the extension is installed, connected to a verified sender, or configured for bulk newsletter campaigns.

To activate monthly delivery safely:
1. Confirm the Firebase Trigger Email extension is installed for project `digicafe-ee519` and connected to a verified sender address on your email provider.
2. Use a trusted server-side Firebase Cloud Function (or equivalent backend) to read active `newsletterSubscribers` records and send a monthly campaign. Restrict campaign creation/sending to authenticated DigiCafe admins.
3. Add an unsubscribe endpoint/token. On unsubscribe, the backend must mark the subscriber as unsubscribed and exclude them from all future campaigns.
4. Set a monthly schedule in the backend (for example, the 1st of each month) and test with an internal address before sending to all subscribers.

Do not run a bulk send directly from `index.html`: it would expose subscriber data and create an abuse/spam risk.

## 3. Test the signup

After publishing the Firestore rule and waiting for GitHub Pages to deploy:
- Open the website in a private/incognito window; the popup should appear after about 9 seconds.
- Subscribe using an email address you control and tick the consent checkbox.
- Check Firestore → `newsletterSubscribers` for the new record.
- Close the popup and refresh; it should remain dismissed in that browser.
- Test the footer form as well.

## Current status

Website signup UI and Firestore write logic are committed. Firestore rules, sender verification, server-side monthly scheduling, campaign sending, and unsubscribe handling require Firebase Console/backend configuration and are not activated by a GitHub Pages commit alone.
