import { ethers } from "ethers";

const AbIs = require("./resource/abis.json");
const Addresses = require("./resource/addresses.json");

const supportChainId = 42161;

const RPCS = {
    42161: "https://arb1.arbitrum.io/rpc",
    // 4002: "https://rpc.testnet.fantom.network",
    // 1337: "http://localhost:7545",
    // 31337: "http://localhost:8545/",
};

const providers = {
    42161: new ethers.providers.JsonRpcProvider(RPCS[supportChainId]),
    // 4002: new ethers.providers.JsonRpcProvider(RPCS[4002]),
    // 1337: new ethers.providers.JsonRpcProvider(RPCS[1337]),
    // 31337: new ethers.providers.JsonRpcProvider(RPCS[31337]),
};

const provider = providers[supportChainId];

const presaleContract = new ethers.Contract(
    Addresses.Presale,
    AbIs.Presale,
    provider
);
const BUSDContract = new ethers.Contract(Addresses.Busd, AbIs.ERC20, provider);

export { presaleContract, BUSDContract, supportChainId, provider };
