import {
  MemeAdded as MemeAddedEvent,
  MemeDeleted as MemeDeletedEvent
} from "../generated/MemeDatabase/MemeDatabase"
import { MemeAdded, MemeDeleted } from "../generated/schema"

export function handleMemeAdded(event: MemeAddedEvent): void {
  let entity = new MemeAdded(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.sessionId = event.params.sessionId
  entity.data = event.params.data

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleMemeDeleted(event: MemeDeletedEvent): void {
  let entity = new MemeDeleted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.sessionId = event.params.sessionId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
