# Safe-Monitor

## What is this project?

The goal of this project is to monitor **new** pending transactions for Safe Wallets.

It can be used as an alternative way to get data from the Safe servers.
This can be particularly useful to check the transaction hash you are going to sign.

You are signing from an untrusted computer? Take **your phone**, read the transaction hash from Discord
to increase confidence of its validity.

*Note: This project can be used as a sort of 2FA. :warning: This is not a security recommendation!!! :warning:*

![SafeMonitor Bot](./images/SafeMonitor.png)

### The hashes are different, why?

If the hash you read from your Safe Wallet interface is different than the hash you read from your phone on Discord, then there is an issue.

You most likely should investigate further to understand if you have been compromised.

### Critical points

If the Discord of the admin responsible for the bot is compromised, then the bot may also be compromised.

## How to set up?

First, copy the `.env.example` file into `.env` and set up your sensitive settings.

```file
PARAMS_FILE="./params.json"
DISCORD_CHANNEL_ID=""
DISCORD_TOKEN=""
```

Then, set up your settings in `.params.json`:

```json
{
    "safeWalletAddresses": [
        "SAFE_WALLET_ADDRESS_1",
        "SAFE_WALLET_ADDRESS_2"
    ],
    "chainId": ["CHAIN_ID_1", "CHAIN_ID_2"]
}

```

You are good to go!

## How to start?

To run the production mode:
```bash
npm install
npm run build
npm start
```


To run the dev mode:
```bash
npm install
npm run dev
```

## Run on Docker production

Search for [beirao/safe-monitor:latest](https://hub.docker.com/r/beirao/safe-monitor) on Docker hub.

### Set the volume: add `params.json`

**Host Path**: Select the path to your `/path/to/.params.json` file on your local machine.

**Container Path**: Set this to `/app/.params.json`.

### Set env

```
PARAMS_FILE="./params.json"
DISCORD_CHANNEL_ID="your channel ID"
DISCORD_TOKEN="your token"
```

## Docker Dev

Install [Docker](https://www.docker.com/).

Create a `.params.json` file with your addresses and chain IDs you want to monitor.

```bash
source .env

docker login

docker pull --platform linux/amd64 node:18-alpine

docker build --platform linux/amd64 -t monitoringsafetxs --load .

docker run -d -v ./.params.json:/app/.params.json --name safe-tx-monitor-container -e DISCORD_TOKEN=${DISCORD_TOKEN} -e DISCORD_CHANNEL_ID=${DISCORD_CHANNEL_ID} -e PARAMS_FILE="./.params.json" monitoringsafetxs
```

Generate the image:
```bash
sudo docker save -o safe-tx-monitor-container.tar monitoringsafetxs
```

## Contributions

Do not hesitate to open a PR to contribute to the project!
