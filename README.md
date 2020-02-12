# API for physio-tracker-frontend

### Features
- Postgres dev and prod DBs hosted on Heroku
- Prod server (docker container) hosted on Prisma cloud 
- Node js client application hosted on Heroku - https://lit-inlet-86349.herokuapp.com/


### Local Development

#### Deploy to dev prisma server
`cd prisma`

`docker-compose up -d`

`prisma deploy -e ../config/dev.env`

#### Run node client
`npm run dev`

### Production 

##### Deploy to prod prisma server
`cd prisma`

`prisma login`

`prisma deploy -e ../config/prod.env`


#### Deploy node client
Deploy node app: `git push heroku master`

#### Run prod node server locally
<!-- On Heroku: `npm run start` (env vars stored in Heroku) -->
`npm run heroku-postbuild`

`env-cmd -f ./config/prod.env node dist/index.js`
