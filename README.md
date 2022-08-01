# Dutch Sales Server

This small express server get the sales data from supermarkets websites and load it to a Firestore database.

Required environment variables:

- GCLOUD_CERT_FILE_PATH: path to google cloud service account certificate json
- PORT: port where the server will listen

The server can be started with `yarn start`

```
export GCLOUD_CERT_FILE_PATH=./sales-app-sa-key.json && yarn start
```

## Todos

- [x] Check if getting data is really needed
  - [x] change from puppeteer to simpler fetching
- [ ] Create CRON job to automatically run web scraping
- [ ] Create setup script which creates a service and run the server in background
- [ ] Add more supermarkets
  - [x] Albert Heijn
  - [ ] Coop
  - [x] Aldi
  - [x] Ekoplaza
- [ ] Parse dates to create TTL for db objects
