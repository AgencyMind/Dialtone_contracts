import {
  SessionAdded as SessionAddedEvent,
  SessionDeleted as SessionDeletedEvent,
  SessionUpdated as SessionUpdatedEvent,
} from "../generated/SessionDatabase/SessionDatabase"
import {
  SessionAdded,
  SessionDeleted,
  SessionUpdated,
} from "../generated/schema"

export function handleSessionAdded(event: SessionAddedEvent): void {
  let entity = new SessionAdded(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.sessionId = event.params.sessionId
  entity.encryptedData = event.params.encryptedData

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleSessionDeleted(event: SessionDeletedEvent): void {
  let entity = new SessionDeleted(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.sessionId = event.params.sessionId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleSessionUpdated(event: SessionUpdatedEvent): void {
  let entity = new SessionUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.sessionId = event.params.sessionId
  entity.encryptedData = event.params.encryptedData

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
