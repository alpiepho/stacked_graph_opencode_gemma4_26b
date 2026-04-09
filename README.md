# Stacked Graph Project

Try here: https://alpiepho.github.io/stacked_graph_opencode_gemma4_26b/

A progressive web app for visualizing personal financial CSV data as an interactive stacked bar chart, binned by month.


## Features

- Interactive stacked graph visualizations.
- Fast development with Vite.
- Modern web technologies.

## Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed on your machine.

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```bash
   cd <project-directory>
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## Development

To start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or the port indicated in your terminal).

## Build

To create a production build:

```bash
npm run build
```

The build output will be located in the `dist/` directory.

## Preview

To preview the production build locally:

```bash
npm run preview
```

## Deployment to GitHub Pages

To deploy this PWA to GitHub Pages:

1.  **Install the `gh-pages` package:**
    ```bash
    npm install gh-pages --save-dev
    ```

2.  **Update `package.json`:**
    Add a `homepage` field and a `deploy` script:
    ```json
    "homepage": "https://<your-username>.github.io/<your-repo-name>/",
    "scripts": {
      ...
      "predeploy": "npm run build",
      "deploy": "gh-pages -d dist"
    }
    ```

3.  **Configure `vite.config.js`:**
    Set the `base` property to your repository name:
    ```javascript
    export default defineConfig({
      base: '/<your-repo-name>/',
      plugins: [ ... ]
    });
    ```

4.  **Deploy:**
    ```bash
    npm run deploy
    ```

## Technologies Used

- [Vite](https://vitejs.dev/) - Build tool and development server.
- [Chart.js](https://www.chartjs.org/) - Data visualization library.
- [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript) - Programming language.

## Created with opencode

This project was developed using **opencode**, an interactive CLI tool, powered by the local **Gemma4** model. The development process leveraged specialized **superpowers** (skills) to automate tasks like generating files, managing dependencies, and updating documentation.


## Short commings
- had to restart Opencode session several times
- had to keep telling to to "go"
- Opencode got stuck writing a fix to a file...gave up and used Copliot with Claude Sonnet 4.6 Hiku
- Opencode did not finish githup pages, again gave up and used Copilot

In general, Opencode kind of worked and created the app faster with less steps, but the result is not as good.

Here are the exported Opencode sessions:
- session-ses_28ca.md - PWA creation
- session-ses_28c5.md - Implement stacked graph design
- session-ses_28c1.md - Fixing syntax error in main.js
