This is a guide to the steps to begin the project that shouldn't need to be done again but are included for context or in case the project needs to be re-created.

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