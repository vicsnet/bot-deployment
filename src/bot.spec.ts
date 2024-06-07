import { JsonRpcProvider, Result, Interface, ethers  } from "ethers";
// import { Interface } from "ethers/lib/utils";
import { instance, mock, resetCalls, verify, when, } from "ts-mockito";
import { TestTransactionEvent } from "forta-agent-tools/lib/test";
import {
  Finding,
  FindingSeverity,
  FindingType,
  HandleTransaction,
  LogDescription,
  TransactionEvent,
  createTransactionEvent,
} from "@fortanetwork/forta-bot";
import {
  handleTransaction,
  EVENT,
  CREATE_AGENT_FUNCTION,
  UPDATE_AGENT_FUNCTION,
  Deployment_Address,
  Nethermind_Address,

} from "./bot";
import { TransactionDescription } from "@fortanetwork/forta-bot/dist/transactions";

// const FORTA_INTERFACE = new Interface(CREATE_AGENT_FUNCTION);

describe("Bot deployment",()=>{
  let handleTransction: HandleTransaction;
  const mockedTxEvent = mock(TransactionEvent);
  const mockedProvider = mock(JsonRpcProvider); 

  beforeEach(()=>{
    resetCalls(mockedTxEvent);
    resetCalls(mockedProvider);
  });

  describe("handle deployment",()=>{
    it("returns finding if event is created", async()=>{
      const mockedCreateAgentEvent = mock<TransactionDescription>();
      const mockedResult = mock(Result);
      const agentId = 1;
      const by = "0x23";
      const meta_data="12qwsdf";
      const chain_ids =[1];
      when (mockedResult.agentId).thenReturn(agentId);
      when(mockedResult.by).thenReturn(by);
      when(mockedResult.meta_data).thenReturn(meta_data);
      when(mockedResult.chain_ids).thenReturn(chain_ids);
      const chainId = 137;
      const hash = "0x34uy7";
      when(mockedTxEvent.chainId).thenReturn(chainId);
      when(mockedTxEvent.hash).thenReturn(hash);


      when(mockedTxEvent.filterFunction(CREATE_AGENT_FUNCTION, Deployment_Address)).thenReturn([instance(mockedCreateAgentEvent)]);
const funcName= "createAgent"
      const findings = await handleTransaction(instance(mockedTxEvent), instance(mockedProvider));

      expect(findings).toStrictEqual([
        Finding.fromObject({
          name: `Nethermind Forta BOT  ${funcName}`,
          description: `${funcName}`,
          alertId:"FORTA-1",
          severity: FindingSeverity.Low,
          type:FindingType.Info,
          metadata: {
                        
                      },
                      source: {
                        chains: [{ chainId }],
                        transactions: [{ hash, chainId }],
                      },
        })
      ]);
      verify(
        mockedTxEvent.filterFunction(CREATE_AGENT_FUNCTION, Deployment_Address)
      ).once();
    })

  })
})

