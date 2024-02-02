import { StarknetProvider } from "../../components/starknet-provider";
import ConnectWallet from "../../components/connect-wallet";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const messageBytes = router.query.id;
    if (messageBytes) {
      // send a request to /api/validate
      fetch("/api/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messageBytes }),
      })
        .then((res) => res.json())
        .then((res) => {
          console.log(res);
        });
    }
  }, [router.query.id]);

  return (
    <div>
      <StarknetProvider>
        <ConnectWallet />
      </StarknetProvider>
    </div>
  );
}
