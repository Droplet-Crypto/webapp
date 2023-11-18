import {
  ECDSAProvider,
  ERC20Abi,
  getRPCProviderOwner,
} from "@zerodev/sdk";
import { Magic } from "magic-sdk";
import {
  Hex,
  createPublicClient,
  encodeFunctionData,
  getContract,
  http,
} from "viem";
import {
  ActionExecutionStatus,
  SupportedChain,
  Token,
} from "./types";

const zerodevProjectId =
  "20dc52a9-91ff-43a9-9d32-1edd3cb23aff";

export const magic = new Magic(
  "pk_live_899A168D9677BF0D",
  {
    network: "mainnet",
  }
);

async function getECDSAProvider(): Promise<ECDSAProvider> {
  return await ECDSAProvider.init({
    projectId: zerodevProjectId,
    owner: getRPCProviderOwner(magic.rpcProvider),
  });
}

export async function getKernelAddress(): Promise<Hex> {
  const provider = await getECDSAProvider();
  return await provider.getAddress();
}

export async function executeBasicUserop() {
  const provider = await getECDSAProvider();
  const opResult =
    await provider.sendUserOperation({
      target:
        "0x4bBa290826C253BD854121346c370a9886d1bC26",
      data: "0x",
    });
  console.log("User op hash", opResult.hash);
  const txHash =
    await provider.waitForUserOperationTransaction(
      opResult.hash as Hex
    );
  console.log("Transaction hash", txHash);
}

export async function sendTokens(
  token: Token,
  to: Hex,
  humanAmount: number,
  updateState: (
    status: ActionExecutionStatus,
    content: string
  ) => void
) {
  const uintAmount = BigInt(
    humanAmount * 10 ** token.decimals
  );
  const provider = await getECDSAProvider();
  const opResult =
    await provider.sendUserOperation({
      target: token.address,
      data: encodeFunctionData({
        abi: ERC20Abi,
        functionName: "transfer",
        args: [to, uintAmount],
      }),
    });
  console.log(
    "Submitted user op with hash",
    opResult.hash
  );
  updateState(
    ActionExecutionStatus.SUBMITED,
    opResult.hash
  );
  const txHash =
    await provider.waitForUserOperationTransaction(
      opResult.hash as Hex
    );
  console.log(
    "Executed userop in transaction with hash",
    txHash
  );
  updateState(
    ActionExecutionStatus.EXECUTED,
    txHash
  );
}

export async function getTokenHumanBalance(
  chain: SupportedChain,
  accountAddress: Hex,
  token: Token
) {
  const publicClient = createPublicClient({
    chain,
    transport: http(),
  });

  const contract = getContract({
    address: token.address,
    abi: ERC20Abi,
    publicClient,
  });

  const uintBalance =
    await contract.read.balanceOf([
      accountAddress,
    ]);

  return (
    Number(uintBalance) / 10 ** token.decimals
  );
}
