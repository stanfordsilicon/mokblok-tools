# mokblok-tools
A web application that allows people to submit translations for langauges


## Project Setup
1. Clone the repository to your local machine.
   ```bash
   git clone https://github.com/stanfordsilicon/mokblok-tools.git
    ``` 
2. Navigate to the project directory.
   ```bash
   cd mokblok-tools
   ```
3. Install the dependencies.
   ```bash
   npm install
   ```
4. Start the development server.
   ```bash
   npm run dev
   ```

## Authentication

Google OAuth only stays stable if Auth.js knows the app's canonical public URL.

1. Copy `.env.example` to `.env.local`.
2. Set `AUTH_URL` to the exact origin you use in the browser.
   Local development should usually be `http://localhost:3000`.
   Production should be your real deployed origin, for example `https://mokblok-tools.example.org`.
3. In the Google Cloud OAuth client, add the matching callback URI:
   `YOUR_AUTH_URL/api/auth/callback/google`

If `AUTH_URL` is missing, Auth.js falls back to the incoming request host. That can drift across localhost vs `127.0.0.1`, preview domains, or reverse proxies and cause `Error 400: redirect_uri_mismatch`.
