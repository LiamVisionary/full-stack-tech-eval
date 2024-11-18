A simple full-stack favorite city manager.

## Full Stack Tech Eval 

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000)


## Data Persistence

• Simple data persistence via local storage. Can be tested by disconnecting from the internet and refreshing the page. 

• Data will load immediately from local storage if available, while simultaneously retrieving the latest data from the backend. 

## API

• GET  /items => retrieves items from a supabase postgres db
• POST /items => adds an item to the db (pass in name via the request body)


## Additional

• Data is set to lowercase upon submission to the db to simplify the uniqueness constraint check.

• UI is bare minimum. If desired, I can whip up something fancy with animations, feedback effects, better composition, color scheme, etc. Just let me know!

## Online Demo





