import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt } from "@graphprotocol/graph-ts"
import {
  SessionAdded,
  SessionDeleted,
  SessionUpdated
} from "../generated/SessionDatabase/SessionDatabase"

export function createSessionAddedEvent(
  sessionId: BigInt,
  encryptedData: string
): SessionAdded {
  let sessionAddedEvent = changetype<SessionAdded>(newMockEvent())

  sessionAddedEvent.parameters = new Array()

  sessionAddedEvent.parameters.push(
    new ethereum.EventParam(
      "sessionId",
      ethereum.Value.fromUnsignedBigInt(sessionId)
    )
  )
  sessionAddedEvent.parameters.push(
    new ethereum.EventParam(
      "encryptedData",
      ethereum.Value.fromString(encryptedData)
    )
  )

  return sessionAddedEvent
}

export function createSessionDeletedEvent(sessionId: BigInt): SessionDeleted {
  let sessionDeletedEvent = changetype<SessionDeleted>(newMockEvent())

  sessionDeletedEvent.parameters = new Array()

  sessionDeletedEvent.parameters.push(
    new ethereum.EventParam(
      "sessionId",
      ethereum.Value.fromUnsignedBigInt(sessionId)
    )
  )

  return sessionDeletedEvent
}

export function createSessionUpdatedEvent(
  sessionId: BigInt,
  encryptedData: string
): SessionUpdated {
  let sessionUpdatedEvent = changetype<SessionUpdated>(newMockEvent())

  sessionUpdatedEvent.parameters = new Array()

  sessionUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "sessionId",
      ethereum.Value.fromUnsignedBigInt(sessionId)
    )
  )
  sessionUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "encryptedData",
      ethereum.Value.fromString(encryptedData)
    )
  )

  return sessionUpdatedEvent
}
