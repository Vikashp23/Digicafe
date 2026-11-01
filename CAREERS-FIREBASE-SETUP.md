# DigiCafe Careers – Firebase setup

The Careers page uses the existing DigiCafe Firebase project. Before accepting live applications, enable Firebase Storage for the project and merge the following rules into the project's existing rules. Do not replace unrelated existing rules.

## Firestore rules

Add this match block inside the existing `service cloud.firestore { match /databases/{database}/documents { ... } }` block:

```text
match /careerApplications/{applicationId} {
  allow create: if
    request.resource.data.keys().hasAll([
      'fullName','mobile','email','city','state','qualification',
      'experience','position','workMode','resumeName','resumePath',
      'resumeSize','resumeType','status','source','createdAt'
    ]) &&
    request.resource.data.fullName is string &&
    request.resource.data.fullName.size() > 1 &&
    request.resource.data.fullName.size() <= 100 &&
    request.resource.data.mobile is string &&
    request.resource.data.mobile.size() <= 20 &&
    request.resource.data.email is string &&
    request.resource.data.email.size() <= 120 &&
    request.resource.data.resumeSize is int &&
    request.resource.data.resumeSize > 0 &&
    request.resource.data.resumeSize <= 5 * 1024 * 1024 &&
    request.resource.data.resumePath is string &&
    request.resource.data.resumePath.matches('career-resumes/.*') &&
    request.resource.data.status == 'New' &&
    request.resource.data.source == 'DigiCafe Careers Website';

  allow read, delete: if request.auth != null &&
    request.auth.token.email in [
      'digicafe.admin@gmail.com',
      'vikashpathak.mgmt@gmail.com',
      'admin@digicafe.com',
      'support@digicafe.com'
    ];

  allow update: if request.auth != null &&
    request.auth.token.email in [
      'digicafe.admin@gmail.com',
      'vikashpathak.mgmt@gmail.com',
      'admin@digicafe.com',
      'support@digicafe.com'
    ] &&
    request.resource.data.diff(resource.data).affectedKeys()
      .hasOnly(['status','updatedAt']);
}
```

## Firebase Storage rules

Merge this match block inside the existing `service firebase.storage { match /b/{bucket}/o { ... } }` block:

```text
match /career-resumes/{applicationId}/{fileName} {
  allow create: if
    request.resource.size > 0 &&
    request.resource.size <= 5 * 1024 * 1024 &&
    request.resource.contentType in [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

  allow read, update, delete: if request.auth != null &&
    request.auth.token.email in [
      'digicafe.admin@gmail.com',
      'vikashpathak.mgmt@gmail.com',
      'admin@digicafe.com',
      'support@digicafe.com'
    ];
}
```

The public can upload a new resume but cannot list or download resumes. Only authenticated DigiCafe admin accounts can read or manage uploaded files. Keep the rest of the project's rules unchanged.

## Activation checklist

1. Open Firebase Console → project `digicafe-ee519`.
2. Confirm Cloud Storage is enabled and the default bucket is `digicafe-ee519.firebasestorage.app`.
3. Merge and publish the Firestore and Storage rules above.
4. Confirm the Firebase Email Trigger extension is configured for the `mail` collection if email notifications are required.
5. Test one application from a private/incognito browser window, then sign in to the DigiCafe Admin Portal and open **Career Applications**.
