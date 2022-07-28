# Dutch Sales Server

This small express server get the sales data from supermarkets websites and load it to a Firestore database.

To run the app you need a service account certificate json and set GCLOUD_CERT_FILE_PATH environment variable to it's path. After that the server can be started with `yarn start`

```
export GCLOUD_CERT_FILE_PATH=./sales-app-sa-key.json && yarn start
```

## Todos

- [x] Check if getting data is really needed
  - [x] change from puppeteer to simpler fetching
- [ ] Create CRON job to automatically run web scraping
- [ ] Add more supermarkets
  - [ ] Albert Heijn
  - [ ] Coop
  - [ ] Aldi
  - [ ] Lidl
- [ ] Parse dates to create TTL for db objects
