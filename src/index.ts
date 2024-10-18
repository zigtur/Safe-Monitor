import SafeApiKit from "@safe-global/api-kit";
require('dotenv').config();
const { readFile } = require('fs/promises');
const Discord = require('discord.js');

const token = process.env.DISCORD_TOKEN;
const channel_id = process.env.DISCORD_CHANNEL_ID;

// Helper function for sleep
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Function to send Discord alert for new transactions
async function sendDiscordAlert(client: any, safe: string, nonce: string, txHash: string) {
    console.log("New tx from Safe: ", txHash);

    const embed = new Discord.EmbedBuilder()
        .setColor(0xAB16F1)
        .setTitle("New pending Safe Transaction!")
        .setAuthor({ name: 'Safe Tx Monitor', iconURL: 'https://i.ibb.co/Rzy5kcX/bot.jpg' })
        .setDescription("There is a new Safe Transaction to review!")
        .addFields(
            { name: 'Safe address', value: safe, inline: false },
            { name: 'Nonce', value: nonce, inline: false },
            { name: 'Transaction Hash', value: txHash, inline: false }
        )
        .setTimestamp()
        .setFooter({ text: "Safe Tx", iconURL: 'https://app.safe.global/favicons/favicon.ico' });

    const channel = await client.channels.fetch(channel_id);
    await channel.send({ embeds: [embed] });
}

// Main function
async function main() {
    const params = JSON.parse(await readFile(process.env.PARAMS_FILE));

    const apiKit = new SafeApiKit({
        chainId: params.chainId, // set the correct chainId from params
    });

    const safeAddresses = params.safeWalletAddresses;

    // Initialize Discord bot
    const client = new Discord.Client({ intents: [Discord.GatewayIntentBits.Guilds] });
    await client.login(token);

    const known_tx: Set<string> = new Set();

    // Event listener once the bot is ready
    client.once('ready', () => {
        console.log('Discord bot initialized!');
    });

    // Infinite loop to poll for new transactions
    while (true) {
        try {
            // Fetch and process pending transactions for each safe address
            await Promise.all(safeAddresses.map(async (safeAddress: string) => {
                const pendingTxs = await apiKit.getPendingTransactions(safeAddress);

                pendingTxs.results.forEach((tx: any) => {
                    const txKey = `${tx.safe}${tx.nonce}${tx.safeTxHash}`;

                    if (!known_tx.has(txKey)) {
                        // New transaction detected
                        known_tx.add(txKey);
                        sendDiscordAlert(client, tx.safe, String(tx.nonce), tx.safeTxHash);
                    }
                });
            }));
        } catch (error) {
            console.error("Error fetching or processing transactions:", error);
        }

        // Sleep for 10 seconds before checking again
        await sleep(10000);
    }
}

main().catch(console.error);