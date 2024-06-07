import { JsonRpcProvider } from "ethers";
import {
  BlockEvent,
  Finding,
  Initialize,
  HandleBlock,
  HealthCheck,
  HandleTransaction,
  HandleAlert,
  AlertEvent,
  TransactionEvent,
  FindingSeverity,
  FindingType,
  scanEthereum,
  scanPolygon,
  scanAlerts,
  runHealthCheck,
} from "@fortanetwork/forta-bot";

export const ERC20_TRANSFER_EVENT =
  "event Transfer(address indexed from, address indexed to, uint256 value)";

export const EVENT =
  "event AgentUpdated (index_topic_1 uint256 agentId, index_topic_2 address by, string metadata, uint256[] chainIds)";

export const TETHER_ADDRESS = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
export const Deployment_Address = "0x61447385B019187daa48e91c55c02AF1F1f3F863";
export const Nethermind_Address = "0x88dC3a2284FA62e0027d6D6B1fCfDd2141a143b8";
export const CREATE_AGENT_FUNCTION =
  "function createAgent(uint256 agentId,address ,string metadata,uint256[] chainIds)";
export const UPDATE_AGENT_FUNCTION =
  "function updateAgent(uint256 agentId,string metadata,uint256[] chainIds)";
export const TETHER_DECIMALS = 6;
let findingsCount = 0;

export const handleTransaction: HandleTransaction = async (
  txEvent: TransactionEvent,
 
) => {
  const findings: Finding[] = [];

  // limiting this bot to emit only 5 findings so that the alert feed is not spammed
  if (txEvent.from !== Nethermind_Address.toLowerCase()) {
    return findings;
  }

  const functionCalls = txEvent.filterFunction(
    [CREATE_AGENT_FUNCTION, UPDATE_AGENT_FUNCTION],
    Deployment_Address
  );
  functionCalls.forEach((eventCalls) => {
    
    const funAgentName = eventCalls.name;

    findings.push(
      Finding.fromObject({
        name: `Nethermind Forta BOT ${
           funAgentName === "createAgent" ? "Created" : "Updated"
         }`, 
         description:funAgentName === "createAgent" ? "New Bot has been deployed by the Nethermind team" : "Bot has been updated by the Nethermind team",
         alertId: funAgentName === "createAgent" ? "FORTA-1" : "FORTA-2", 
         severity:FindingSeverity.Low, 
         type:FindingType.Info,
        //  metadata:{
          
        //  } ,
          // source:{
          //   chains: [{ chainId: txEvent.chainId }],
          //   transactions: [{ hash: txEvent.hash, chainId: txEvent.chainId }],
          // },
      })
    
    );
  });
 
  return findings;
};



async function main() {
  // scanEthereum({
  //   rpcUrl: "https://cloudflare-eth.com/",
  //   handleTransaction,
  // });

  scanPolygon({
    rpcUrl: "https://polygon-mainnet.g.alchemy.com/v2/dlDxW9tQ0J9-9SwizlMGzPq8PBRMLoEK",
    localRpcUrl: "137",
    handleTransaction,
  });

  
  runHealthCheck();
}

// only run main() method if this file is directly invoked (vs just imported for testing)
if (require.main === module) {
  main();
}
