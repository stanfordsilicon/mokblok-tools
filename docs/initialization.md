This is a guide to the steps to begin the project that shouldn't need to be done again but are included for context or in case the project needs to be re-created.

## Initial Setup Steps

1. Create repository
   - Go to GitHub and create a new repository for the project, in this case named `mokblok-tools`.
   - Initialize it with a README file.
   - Clone the repository to your local machine (originally created using VSCode)
2. Setup the react environment
   - Open terminal and navigate to the project directory.
   - Run `npm create vite@latest` to set up a new React application in the current directory.
     - Project Name: `mokblok-tools`
     - Select `React` as the framework.
     - Select `TypeScript` as the variant.
     - Install dependencies when prompted.
3. Setup the website
   1. Remove the default files created by Vite:
      - Delete `src/assets`, `src/App.css`
   2. Create new files:
      - Update `src/App.tsx` with basic structure including header and footer.
4. Install ESLint and Prettier for code quality and formatting:
   ```bash
   npm install --save-dev prettier eslint-config-prettier eslint @eslint/js eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-import eslint-plugin-prettier
   ```

## Github.io Deployment Setup

1. Create a new branch named `gh-pages` in the repository.
2. Configure GitHub Pages in the repository settings:
   - Go to the "Pages" section in the repository settings.
   - Select the `gh-pages` branch as the source for GitHub Pages.
   - Save the settings.
3. Set up deployment scripts:   
   - Add deployment scripts to `package.json` to automate the deployment process to GitHub Pages.
4. Update `vite.config.ts` to set the base path for the project when deployed on GitHub Pages.
5. Test deployment:
   1. Build the project using `npm run build`.
   2. Deploy the built project to GitHub Pages using the deployment script `npm run deploy`.