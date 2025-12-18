## pokemon_app
An experiment to further learn about JavaScript with one of the best animes ever, Pokemon!  
Bulbasaur is my favorite Pokemon.

### Roadmap (completed)

1. Integrate a database with NodeJS ✅
2. Improve web security ✅
3. Make a single page user interface with React ✅
4. Improve Web Application Security dealing with misconfigurations and hardening ✅

### Finished
1. Integrated a simple UX-design with only the necessary components to play a ROM with the JS emulator. (20-11-2025)
2. Added a basic EmulatorJS-powered GBA player so you can upload a `.gba` ROM and play it in the browser. (18-12-2025)
3. Updated the main page to a modern single-page React-powered layout with an EmulatorJS play area and improved UX styling. (18-12-2025)
4. Integrated a small SQLite database with NodeJS to log ROM play events and exposed simple stats APIs. (18-12-2025)
5. Improved web security and hardening using Helmet, rate limiting, safer CORS, and an explicit error handler. (18-12-2025)

### How to Run
1. Install dependencies (first time only): `npm install`.
2. From the project root, run `npm start` (or `node server.js`).
3. Open `http://localhost:3000` in your browser.
4. Use the navigation at the top to move between sections and, in **Play GBA**, choose a `.gba` file and click **Play ROM**.

> Note: EmulatorJS assets are loaded from the public CDN, so you need an internet connection the first time it loads.

### GitHub Push / Pull Helpers (Windows / PowerShell)

Two helper scripts are included to speed up syncing with GitHub:

- `git-push.ps1` – stages all changes, commits, and pushes to `origin main`.
  - Usage: `.\git-push.ps1` or `.\git-push.ps1 -Message "your commit message"`
- `git-pull.ps1` – pulls the latest changes from `origin main`.
  - Usage: `.\git-pull.ps1`

Before using them the first time, set up Git and your remote in this folder:

1. `git init`
2. `git branch -M main`
3. Create a new empty repo on GitHub and copy its HTTPS URL.
4. `git remote add origin https://github.com/your-username/your-repo.git`
5. `git add .`
6. `git commit -m "Initial commit"`
7. `git push -u origin main`
