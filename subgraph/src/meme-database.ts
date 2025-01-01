import { Address, ByteArray, Bytes } from "@graphprotocol/graph-ts";
import {
  MemeAdded as MemeAddedEvent,
  MemeDatabase,
  MemeDeleted as MemeDeletedEvent,
} from "../generated/MemeDatabase/MemeDatabase";
import { MemeAdded, MemeDeleted } from "../generated/schema";
import { MemeMetadata as MemeMetadataTemplate } from "../generated/templates";

export function handleMemeAdded(event: MemeAddedEvent): void {
  let entity = new MemeAdded(
    Bytes.fromByteArray(ByteArray.fromBigInt(event.params.sessionId))
  );
  entity.sessionId = event.params.sessionId;
  entity.data = event.params.data;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  let memes = MemeDatabase.bind(
    Address.fromString("0x5d00671DCb428279320b9b37F8615488A0f74c9d")
  );

  entity.owner = memes.getMemeOwner(event.params.sessionId);
  entity.token = memes.getMemeToken(event.params.sessionId);

  let ipfsHash = (entity.data as String).split("/").pop();
  if (ipfsHash != null) {
    entity.metadata = ipfsHash;
    MemeMetadataTemplate.create(ipfsHash);
  }

  entity.save();
}

export function handleMemeDeleted(event: MemeDeletedEvent): void {
  let entity = new MemeDeleted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.sessionId = event.params.sessionId;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}
