import { getHttpEndpoint } from "@orbs-network/ton-access";
import { mnemonicToWalletKey } from "ton-crypto";
import { TonClient, WalletContractV4, internal } from "ton";

async function main() {
  const mnemonic = "raven time drama ..."; //more words goes here
  const key = await mnemonicToWalletKey(mnemonic.split(" "));
  const wallet = WalletContractV4.create({
    publicKey: key.publicKey,
    workchain: 0,
  });

  const endpoint = await getHttpEndpoint({ network: "testnet" });
  const client = new TonClient({ endpoint });

  if (!(await client.isContractDeployed(wallet.address))) {
    return console.log(
      "WALLET NOT DEPLOYED.. AWWWWWW, MAN, YOU SHOULD DO BETTER!"
    );
  }

  const walletContract = client.open(wallet);
  const seqno = await walletContract.getSeqno();
  await walletContract.sendTransfer({
    secretKey: key.secretKey,
    seqno: seqno,
    messages: [
      internal({
        to: "EQA4V9tF4lY2S_J-sEQR7aUj9IwW-Ou2vJQlCn--2DLOLR5e",
        value: "0.05",
        body: "WTF MAN WHERE IS MY NFTZZZZZ??",
        bounce: true,
      }),
    ],
  });

  let currentSeqno = seqno;
  while (currentSeqno == seqno) {
    console.log("WAITING....");
    await sleep(1500);
    currentSeqno = await walletContract.getSeqno();
  }
  console.log("TRANSACTION COMPLETE, YO! ^_^");
}

main();

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
