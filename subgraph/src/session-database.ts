import { Address, ByteArray, Bytes, store } from "@graphprotocol/graph-ts";
import {
  OwnerKeySet as OwnerKeySetEvent,
  SessionAdded as SessionAddedEvent,
  SessionDatabase,
  SessionDeleted as SessionDeletedEvent,
  SessionUpdated as SessionUpdatedEvent,
} from "../generated/SessionDatabase/SessionDatabase";
import {
  SessionAdded,
  SessionDeleted,
  OwnerKeySet,
  SessionUpdated,
} from "../generated/schema";

export function handleSessionAdded(event: SessionAddedEvent): void {
  let entity = new SessionAdded(
    Bytes.fromByteArray(ByteArray.fromBigInt(event.params.sessionId))
  );

  let sessions = SessionDatabase.bind(
    Address.fromString("0x012902519C28FB6a473650d01329981284C866E4")
  );

  entity.sessionId = event.params.sessionId;
  entity.encryptedData = event.params.encryptedData;
  entity.owner = sessions.getSessionOwner(event.params.sessionId);

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleSessionDeleted(event: SessionDeletedEvent): void {
  let entity = new SessionDeleted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.sessionId = event.params.sessionId;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  let session = SessionAdded.load(
    Bytes.fromByteArray(ByteArray.fromBigInt(event.params.sessionId))
  );

  if (session) {
    store.remove(
      "SessionAdded",
      Bytes.fromByteArray(
        ByteArray.fromBigInt(event.params.sessionId)
      ).toHexString()
    );
  }

  entity.save();
}

export function handleSessionUpdated(event: SessionUpdatedEvent): void {
  let entity = new SessionUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.sessionId = event.params.sessionId;
  entity.encryptedData = event.params.encryptedData;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  let session = SessionAdded.load(
    Bytes.fromByteArray(ByteArray.fromBigInt(event.params.sessionId))
  );

  if (session) {
    session.encryptedData = event.params.encryptedData;

    session.save();
  }

  entity.save();
}

export function handleOwnerKeySet(event: OwnerKeySetEvent): void {
  let entity = new OwnerKeySet(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.owner = event.params.owner;
  entity.encryptedKeys = event.params.encryptedKeys;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}
