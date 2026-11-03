# API Checkpoint — User Directory

A React project created with Vite for the GoMyCode API checkpoint.

## Features

- Fetch users from `https://jsonplaceholder.typicode.com/users` using Axios inside `useEffect`.
- Display a loading message while waiting and an error message if the request fails.
- Retry a failed request using the Try again button.
- Display each user's name, email and company name.
- Filter users by name while typing, ignoring capital letters.
- Click a user card to expand or collapse the address, phone and website.
- Handle empty lists and searches with no matches.

## Run locally

```bash
npm install
npm run dev
```

Open the address printed by Vite. Use Node.js 22.12+ or a supported newer LTS version.

```bash
npm test
npm run lint
npm run build
```

## Main file

`src/UserList.jsx` contains the request, search and expandable cards. The required state values are `listOfUsers`, `loading` and `error`. Search text, expanded user ID and retry count have their own state too.

The effect fetches the users when the component mounts. Clicking Try again changes the retry count, causing the effect to run again. An AbortController cancels the request when the component unmounts. A 15-second timeout prevents an endless loading message.

The card is a button, so it also works with a keyboard. Its `aria-expanded` value tells assistive technology whether the details are open. The initials are plain text, not generated profile photos.

## Checks

Automated tests mock Axios to check loading, successful rendering, search, no matches, expanding/collapsing details, errors, retry, empty lists and request cancellation. Build and lint commands check the project separately.

The directory uses sample API data and needs internet access. It does not edit the API's users or require an API key. Website and phone values are displayed as text. GitHub contains the source code; this repository is not automatically deployed as a live website.
