import {
  ECDSAProvider,
  getRPCProviderOwner,
} from "@zerodev/sdk";
import { Magic } from "magic-sdk";
import { Hex } from "viem";

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
