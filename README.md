# Deploy to dev prisma server
`cd prisma`
`prisma deploy -e ../config/dev.env`

# Deploy to prod prisma server
`cd prisma`
`prisma login`
`prisma deploy -e ../config/prod.env`

# Run dev node server
`npm run dev`

# Run prod node server
On Heroku: `npm run start` (env vars stored in Heroku)
Locally: `env-cmd -f ./config/prod.env node dist/index.js`

# Features
Postgres dev and prod DBs hosted on Heroku
Prod server (docker container) hosted on Prisma cloud 
Node js application hosted on Heroku