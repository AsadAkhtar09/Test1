const HDWalletProvider = require('@truffle/hdwallet-provider');
const { Web3 } = require('web3');

const seedPhrase = 'unknown marriage riot wide purpose talk vocal position mosquito tornado round own';
const providerUrl = 'https://eth-sepolia.g.alchemy.com/v2/h_5Q7WPpI2yRbWyVeh56j7Yd4fLWO252';

const provider = new HDWalletProvider({
    mnemonic: {
        phrase: seedPhrase
    },
    providerOrUrl: providerUrl
});
const web3 = new Web3(provider);

const contractAddress = '0x274ED7562Aba3F482C14d13eeE8F2235923D74c3';
const contractABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[],"name":"_totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"delegate","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"delegate","type":"address"},{"internalType":"uint256","name":"numTokens","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"tokenOwner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"burn","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"mint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"receiver","type":"address"},{"internalType":"uint256","name":"numTokens","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"buyer","type":"address"},{"internalType":"uint256","name":"numTokens","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}];

const contract = new web3.eth.Contract(contractABI, contractAddress);

function generateAddresses(seedPhrase, numAddresses) {
    const addresses = [];
    for (let i = 0; i < numAddresses; i++) {
        const acct = web3.eth.accounts.create(web3.utils.keccak256(seedPhrase + i));
        addresses.push(acct.address);
    }
    return addresses;
}




async function sendTokens(addresses) {
    for (const address of addresses) {
        if (!address) {
            console.error(`Address is undefined for ${address}`);
            continue;
        }
        const tokenAmount = Math.floor(Math.random() * 999) + 1;
        try {
            await contract.methods.transfer(address, web3.utils.toWei(tokenAmount.toString(), 'ether')).send({ from: "0x114A514C2C0E927dD425fE9842624Fd2522ea72E" });
        } catch (error) {
            console.error(`Failed to send tokens to address ${address}:`, error);
        }
    }
}


async function main() {
    const numAddresses = 10000;
    const addresses = generateAddresses(seedPhrase, numAddresses);
    await sendTokens(addresses);
}

main().then(() => {
    console.log('Tokens sent successfully to all addresses.');
    process.exit(0);
}).catch(err => {
    console.error('Error:', err);
    process.exit(1);
});
