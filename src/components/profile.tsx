import { useEffect, useState } from "react";
import { useAccount, useConnect, useDisconnect } from "@starknet-react/core";
import { useStarknetkitConnectModal } from "starknetkit";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const [profileData, setProfileData] = useState(null);
  const [retry, setRetry] = useState(false);
  const [retries, setRetries] = useState(0);
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { address, isConnected } = useAccount();
  const { starknetkitConnectModal } = useStarknetkitConnectModal({
    dappName: "Starknet Farcaster",
  });

  const connectWallet = async () => {
    const { connector } = await starknetkitConnectModal();
    await connect({ connector });
  };

  const disconnectWallet = async () => {
    await disconnect();
  };

  useEffect(() => {
    const getMapping = async (starknetAddress: string) => {
      try {
        const response = await fetch(
          `/api/getMapping?starknetAddress=${starknetAddress}`
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        setRetry(false);

        return response.json();
      } catch (error) {
        setRetry(true);
        setRetries(retries + 1);
        console.error("Failed to get mapping:", error);
      }
    };

    if (address || (address && retry && retries < 3)) {
      getMapping(address).then((res) => {
        if (res) {
          console.log("res", res);
          fetch(`/api/userData?fid=${res.fid}`)
            .then((response) => response.json())
            .then((data) => {
              setProfileData(data);
            })
            .catch((error) => {
              console.error("Error fetching user data:", error);
            });
        }
      });
    }
  }, [address, retry, retries]);
  return (
    <div
      style={{
        padding: "20px",
        margin: "auto",
        textAlign: "center",
      }}
    >
      {isConnected ? (
        <div>
          {profileData ? (
            <ProfileCard profileData={profileData} />
          ) : (
            <p>Loading...</p>
          )}
        </div>
      ) : (
        <div>
          <p
            style={{
              marginBottom: "15px",
              fontSize: "1.2rem",
            }}
          >
            Connect to Starknet to view your Farcaster profile
          </p>
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
            Connect wallet
          </button>
        </div>
      )}
    </div>
  );
}

const ProfileCard = ({ profileData }: any) => {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "20px",
        textAlign: "center",
        maxWidth: "300px",
        margin: "auto",
      }}
    >
      {!profileData.pfp &&
        !profileData.username &&
        !profileData.bio &&
        !profileData.display && (
          <div>
            <p>No Farcaster profile connected to this address yet.</p>
            <p>
              Connect Farcaster to Starknet{" "}
              <Link href="https://warpcast.com/tjelailah/0xae04135d">here</Link>{" "}
              to view your Farcaster profile
            </p>
          </div>
        )}

      {profileData.pfp && (
        <Image
          src={profileData.pfp}
          alt="Profile"
          width={100}
          height={100}
          style={{ borderRadius: "50%" }}
        />
      )}
      <h3>{profileData.username}</h3>
      <p>{profileData.bio}</p>
      <p>{profileData.display}</p>
    </div>
  );
};
