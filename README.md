# Premier League Seasons Matrix

A beautiful interactive visualization that shows how every team has performed across all Premier League seasons (1992/93 – present).

## What is this?

This project visualizes **historical Premier League standings** as a matrix:

- **Rows** = Teams (sortable)
- **Columns** = Seasons
- **Circles** represent each team's position in that season
- Color coding highlights **Champions** (gold), **Top teams**, **Mid-table**, and **Relegated** teams (red)

### Key Features

- **Interactive sorting** — Sort teams by:
  - A–Z (Alphabetical)
  - Most Titles
  - Most Relegations
  - Most Points (cumulative)
- **Click any team** on the Y-axis to highlight all their seasons
- **Hover** on any circle to see detailed statistics for that season
- Smooth transitions when sorting or selecting teams

## The Question This Answers

> **"How have different teams performed across the history of the Premier League?"**

It makes it easy to spot:
- Consistent top performers
- Teams that frequently get relegated ("yo-yo clubs")
- Teams that had golden eras
- Long-term trends in the league


# sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```sh
# create a new project
npx sv create my-app
```

To recreate this project with the same configuration:

```sh
# recreate this project
pnpm dlx sv@0.12.4 create --template minimal --types ts --add prettier eslint tailwindcss="plugins:none" --install pnpm my-svelte-dashboard
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```sh
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```sh
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.
