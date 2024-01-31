import { StarknetProvider } from "../components/starknet-provider";
import ConnectWallet from "../components/connect-wallet";

export default function Home() {
  return (
    <div>
      <StarknetProvider>
        <ConnectWallet />
      </StarknetProvider>
    </div>
  );
}
