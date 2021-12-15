import * as dotenv from "dotenv";

dotenv.config();

const API_URL = process.env.API_URL!;

import { createAlchemyWeb3 } from "@alch/alchemy-web3";

const web3 = createAlchemyWeb3(API_URL)

import contract from "../artifacts/contracts/MyNFT.sol/MyNFT.json";
// import {AbiItem} from "web3-utils";

console.log(JSON.stringify(contract.abi))

const contractAddress = "0x15ca34999ba621d7438bdaa406039dc8ab890fc6"

const nftContract = new web3.eth.Contract(contract.abi as any, contractAddress);





const PUBLIC_KEY = process.env.PUBLIC_KEY!;
const PRIVATE_KEY = process.env.PRIVATE_KEY!;

async function mintNFT(tokenURI:string) {
  const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, 'latest'); //get latest nonce

  //the transaction
  const tx = {
    'from': PUBLIC_KEY,
    'to': contractAddress,
    'nonce': nonce,
    'gas': 500000,
    'data': nftContract.methods.mintNFT(PUBLIC_KEY, tokenURI).encodeABI()
  };

  const signPromise = web3.eth.accounts.signTransaction(tx, PRIVATE_KEY)
  signPromise
    .then((signedTx) => {
      if (signedTx === undefined)
        throw new Error("signedTx is undefined");

      web3.eth.sendSignedTransaction(
        signedTx.rawTransaction!,
        function (err, hash) {
          if (!err) {
            console.log(
              "The hash of your transaction is: ",
              hash,
              "\nCheck Alchemy's Mempool to view the status of your transaction!"
            )
          } else {
            console.log(
              "Something went wrong when submitting your transaction:",
              err
            )
          }
        }
      )
    })
    .catch((err) => {
      console.log(" Promise failed:", err)
    })
}

mintNFT(
  "https://gateway.pinata.cloud/ipfs/QmStEUxHTDqA8mnFcRPyR2NRgmY7wz6Lp7yYiVfQo5wVRT"
)
