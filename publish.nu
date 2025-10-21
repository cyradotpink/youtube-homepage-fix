#!/usr/bin/env nu

let login = open secret.json
npx web-ext sign -s src/ --amo-metadata amo-metadata.json --channel listed --api-key ($login.api-key) --api-secret ($login.api-secret)
