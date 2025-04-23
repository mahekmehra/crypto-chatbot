const GEMINI_API_KEY =  process.env.GEMINI_API_KEY || "YOUR_GEMINI_API_KEY_HERE";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

// Comprehensive list of crypto-related keywords
const cryptoKeywords = [
    "crypto", "cryptocurrency", "bitcoin", "btc", "ethereum", "eth", "blockchain", "tax", "capital gains",
    "trading", "wallet", "defi", "nft", "non-fungible token", "mining", "staking", "coin", "token", "altcoin",
    "stablecoin", "exchange", "smart contract", "hashrate", "gas fee", "decentralized", "centralized",
    "ledger", "private key", "public key", "airdrop", "fork", "halving", "ico", "initial coin offering",
    "dex", "cex", "yield farming", "liquidity pool", "metaverse", "web3", "dapp", "decentralized app","hello",
    "hi","thankyou","thanks","ok","good"
];

// Regex patterns for tax-related queries
const taxPatterns = {
    capitalGains: /(?:bought|purchased)\s+(\d*\.?\d*)\s*(?:btc|bitcoin|eth|ethereum|[a-zA-Z]+)\s*(?:at\s*\$?(\d+[,.\d]*))?\s*(?:and\s*(?:sold|sells)\s*(?:at\s*\$?(\d+[,.\d]*)))?.*tax\s*rate\s*(?:is\s*)?(\d*\.?\d*)%/i,
    staking: /(?:earned|received)\s*(\d*\.?\d*)\s*(?:btc|bitcoin|eth|ethereum|[a-zA-Z]+)\s*(?:from\s*staking|as\s*staking\s*rewards?).*value\s*(?:of\s*\$?(\d+[,.\d]*))?.*tax\s*rate\s*(?:is\s*)?(\d*\.?\d*)%/i,
    mining: /(?:mined|mining)\s*(\d*\.?\d*)\s*(?:btc|bitcoin|eth|ethereum|[a-zA-Z]+)\s*(?:worth\s*\$?(\d+[,.\d]*))?.*tax\s*rate\s*(?:is\s*)?(\d*\.?\d*)%/i,
    airdrop: /(?:received|got)\s*(\d*\.?\d*)\s*(?:btc|bitcoin|eth|ethereum|[a-zA-Z]+)\s*(?:from\s*airdrop|as\s*airdrop)?.*value\s*(?:of\s*\$?(\d+[,.\d]*))?.*tax\s*rate\s*(?:is\s*)?(\d*\.?\d*)%/i
};

// Display welcome message on page load
function displayWelcomeMessage() {
    const messagesDiv = document.getElementById("messages");
    const welcomeMessage = `
        <p>Welcome to Crypto Tax Chatbot!</p>
        <p>I can:</p>
        <ul>
            <li>Answer crypto questions (e.g., "What is Bitcoin?")</li>
            <li>Calculate capital gains tax (e.g., "Bought 1 BTC at $30,000, sold at $50,000, 20% tax")</li>
            <li>Calculate staking tax (e.g., "Earned 0.5 ETH staking worth $2000, 15% tax")</li>
            <li>Calculate mining tax (e.g., "Mined 0.1 BTC worth $6000, 25% tax")</li>
            <li>Calculate airdrop tax (e.g., "Got 1000 tokens airdrop worth $500, 10% tax")</li>
        </ul>
    `;
    messagesDiv.innerHTML += `<div class="bot-message">${welcomeMessage}</div>`;
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}


function clearChat() {
    const messagesDiv = document.getElementById("messages");
    messagesDiv.innerHTML = "";
    displayWelcomeMessage();
}


// Check if the query is crypto-related
function isCryptoRelated(message) {
    const lowerMessage = message.toLowerCase();
    return cryptoKeywords.some(keyword => lowerMessage.includes(keyword));
}

// Calculate tax based on query type
function calculateTax(message) {
    const lowerMessage = message.toLowerCase();

    // Capital Gains Tax
    const capitalGainsMatch = message.match(taxPatterns.capitalGains);
    if (capitalGainsMatch) {
        const quantity = parseFloat(capitalGainsMatch[1]) || 1;
        const buyPrice = capitalGainsMatch[2] ? parseFloat(capitalGainsMatch[2].replace(/,/g, "")) : null;
        const sellPrice = capitalGainsMatch[3] ? parseFloat(capitalGainsMatch[3].replace(/,/g, "")) : null;
        const taxRate = parseFloat(capitalGainsMatch[4]) / 100;

        if (buyPrice && sellPrice) {
            const gain = (sellPrice - buyPrice) * quantity;
            if (gain <= 0) return "No capital gains tax applies as there was no profit.";
            const tax = gain * taxRate;
            return `Capital Gains: $${gain.toFixed(2)}. Tax at ${taxRate * 100}%: $${tax.toFixed(2)}.`;
        }
        return "Please provide both purchase and selling prices for capital gains tax.";
    }

    // St “‘You’re welcome! I’m here to assist with any cryptocurrency-related questions or tax calculations. What would you like to know?’aking Rewards Tax
    const stakingMatch = message.match(taxPatterns.staking);
    if (stakingMatch) {
        const quantity = parseFloat(stakingMatch[1]) || 1;
        const value = stakingMatch[2] ? parseFloat(stakingMatch[2].replace(/,/g, "")) : null;
        const taxRate = parseFloat(stakingMatch[3]) / 100;

        if (value) {
            const income = quantity * value;
            const tax = income * taxRate;
            return `Staking Income: $${income.toFixed(2)}. Tax at ${taxRate * 100}%: $${tax.toFixed(2)}.`;
        }
        return "Please provide the value of the staking rewards.";
    }

    // Mining Income Tax
    const miningMatch = message.match(taxPatterns.mining);
    if (miningMatch) {
        const quantity = parseFloat(miningMatch[1]) || 1;
        const value = miningMatch[2] ? parseFloat(miningMatch[2].replace(/,/g, "")) : null;
        const taxRate = parseFloat(miningMatch[3]) / 100;

        if (value) {
            const income = quantity * value;
            const tax = income * taxRate;
            return `Mining Income: $${income.toFixed(2)}. Tax at ${taxRate * 100}%: $${tax.toFixed(2)}.`;
        }
        return "Please provide the value of the mined cryptocurrency.";
    }

    // Airdrop Tax
    const airdropMatch = message.match(taxPatterns.airdrop);
    if (airdropMatch) {
        const quantity = parseFloat(airdropMatch[1]) || 1;
        const value = airdropMatch[2] ? parseFloat(airdropMatch[2].replace(/,/g, "")) : null;
        const taxRate = parseFloat(airdropMatch[3]) / 100;

        if (value) {
            const income = quantity * value;
            const tax = income * taxRate;
            return `Airdrop Income: $${income.toFixed(2)}. Tax at ${taxRate * 100}%: $${tax.toFixed(2)}.`;
        }
        return "Please provide the value of the airdropped cryptocurrency.";
    }

    return null;
}

// Fetch response from Gemini API
async function fetchGeminiResponse(message) {
    try {
        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `Provide a concise and accurate answer to this cryptocurrency-related query: ${message}`
                    }]
                }]
            })
        });
        const data = await response.json();
        if (data.candidates && data.candidates[0].content.parts[0].text) {
            return data.candidates[0].content.parts[0].text;
        }
        return "No valid response from API.";
    } catch (error) {
        console.error("Gemini API error:", error);
        return "Error fetching response. Please check and try again later.";
    }
}

// Main function to handle sending messages
async function sendMessage() {
    const input = document.getElementById("user_input");
    const message = input.value.trim();
    if (!message) return;

    const messagesDiv = document.getElementById("messages");
    messagesDiv.innerHTML += `<div class="user-message">${message}</div>`;
    input.value = "";

    let botResponse = "This is out of scope";

    if (isCryptoRelated(message)) {
        const taxResult = calculateTax(message);
        if (taxResult) {
            botResponse = taxResult;
        } else {
            botResponse = await fetchGeminiResponse(message);
        }
    }

    messagesDiv.innerHTML += `<div class="bot-message">${botResponse}</div>`;
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// Event listeners
document.getElementById("user_input").addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
});