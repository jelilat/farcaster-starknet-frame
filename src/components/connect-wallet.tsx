"use client";
import { useEffect } from "react";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useSignTypedData,
} from "@starknet-react/core";
import { useStarknetkitConnectModal } from "starknetkit";
import {
  shortString,
  typedData,
  Contract,
  RpcProvider,
  Signature,
} from "starknet";
import { timeValid } from "@/utils";

type FarcasterData = {
  fid: number;
  timestamp: number;
};

function ConnectWallet({ fid, timestamp }: FarcasterData) {
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { address, isConnected } = useAccount();
  const { starknetkitConnectModal } = useStarknetkitConnectModal({
    dappName: "Starknet Farcaster",
  });

  const message: typedData.TypedData = {
    domain: {
      name: "Starknet Farcaster",
      version: "1",
      chainId: shortString.encodeShortString("SN_MAIN"),
    },
    types: {
      StarkNetDomain: [
        { name: "name", type: "felt" },
        { name: "version", type: "felt" },
        { name: "chainId", type: "felt" },
      ],
      Verification: [
        { name: "fid", type: "felt" },
        { name: "timestamp", type: "felt" },
      ],
    },
    message: {
      fid,
      timestamp,
    },
    primaryType: "Verification",
  };
  const { data, signTypedData, isPending } = useSignTypedData(message);

  const connectWallet = async () => {
    const { connector } = await starknetkitConnectModal();
    await connect({ connector });
  };

  const disconnectWallet = async () => {
    await disconnect();
  };

  const verifySignature = async (
    contractAddress: string,
    signature: Signature
  ) => {
    const provider = new RpcProvider({
      nodeUrl: "https://free-rpc.nethermind.io/mainnet-juno/",
    });

    try {
      const classHash = await provider.getClassHashAt(contractAddress);
      const contractClass = await provider.getClass(classHash);
      const abi = contractClass.abi;

      const contract = new Contract(abi, contractAddress, provider);
      const msgHash = typedData.getMessageHash(message, contractAddress);
      console.log(contractAddress, msgHash);
      const validSignature = await contract.isValidSignature(
        msgHash,
        signature
      );
      console.log(validSignature);
      // Store the result in a database
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (data) {
      console.log(data);
      verifySignature(address!, data);
    }
  }, [data]);

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "300px",
        margin: "auto",
        textAlign: "center",
      }}
    >
      {/* {address && <p style={{ marginBottom: "15px" }}>Address: {address}</p>} */}

      {!isConnected ? (
        <button
          onClick={connectWallet}
          style={{
            padding: "10px 15px",
            cursor: "pointer",
            backgroundColor: "black",
            color: "white",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Connect to Starknet
        </button>
      ) : (
        <div>
          <button
            onClick={() => {
              if (timeValid(timestamp)) {
                signTypedData();
              }
            }}
            disabled={!address}
            style={{
              padding: "10px 15px",
              cursor: "pointer",
              backgroundColor: "black",
              color: "white",
              border: "none",
              borderRadius: "5px",
              marginBottom: "10px",
            }}
          >
            {isPending ? "Waiting for wallet..." : "Verify address ownership"}
          </button>
          <br />
          <button
            onClick={disconnectWallet}
            style={{
              padding: "10px 15px",
              cursor: "pointer",
              backgroundColor: "#f44336",
              color: "white",
              border: "none",
              borderRadius: "5px",
            }}
          >
            Disconnect wallet
          </button>
        </div>
      )}
    </div>
  );
}

export default ConnectWallet;
