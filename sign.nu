#!/usr/bin/env nu

let login = open secret.json
npx web-ext sign -s src/ --channel unlisted --api-key ($login.api-key) --api-secret ($login.api-secret)
