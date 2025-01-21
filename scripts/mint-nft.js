require("dotenv").config();
const API_URL = process.env.API_URL;
const PUBLIC_KEY = process.env.PUBLIC_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(API_URL);
const contract = require("../artifacts/contracts/MyNFT.sol/MyNFT.json");

console.log(JSON.stringify(contract.abi));

const contractAddress = "0x031ac728C205DAbCF3a2b0E53cDD12E625451eAb";
const nftContract = new web3.eth.Contract(contract.abi, contractAddress);

async function mintNFT(tokenURI) {
  try {
    const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, "latest");
    const tx = {
      from: PUBLIC_KEY,
      to: contractAddress,
      nonce: nonce,
      gas: 500000,
      data: nftContract.methods.mintNFT(PUBLIC_KEY, tokenURI).encodeABI(),
    };

    const signedTX = await web3.eth.accounts.signTransaction(tx, PRIVATE_KEY);

    const receipt = await web3.eth.sendSignedTransaction(signedTX.rawTransaction);

    console.log("Transaction successful with hash:", receipt.transactionHash);
  } catch (error) {
    console.error("Something wrong with minting the NFT:", error);
  }
}

mintNFT("https://azure-many-dragonfly-78.mypinata.cloud/ipfs/bafkreiexuvdt22gma55blgxg2nujqhl24lfbudyj74zlu6r6i7lcsowbqm");
