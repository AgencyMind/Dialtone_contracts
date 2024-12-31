import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt } from "@graphprotocol/graph-ts"
import { MemeAdded, MemeDeleted } from "../generated/MemeDatabase/MemeDatabase"

export function createMemeAddedEvent(
  sessionId: BigInt,
  data: string
): MemeAdded {
  let memeAddedEvent = changetype<MemeAdded>(newMockEvent())

  memeAddedEvent.parameters = new Array()

  memeAddedEvent.parameters.push(
    new ethereum.EventParam(
      "sessionId",
      ethereum.Value.fromUnsignedBigInt(sessionId)
    )
  )
  memeAddedEvent.parameters.push(
    new ethereum.EventParam("data", ethereum.Value.fromString(data))
  )

  return memeAddedEvent
}

export function createMemeDeletedEvent(sessionId: BigInt): MemeDeleted {
  let memeDeletedEvent = changetype<MemeDeleted>(newMockEvent())

  memeDeletedEvent.parameters = new Array()

  memeDeletedEvent.parameters.push(
    new ethereum.EventParam(
      "sessionId",
      ethereum.Value.fromUnsignedBigInt(sessionId)
    )
  )

  return memeDeletedEvent
}
