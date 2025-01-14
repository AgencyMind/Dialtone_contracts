import { Address, ByteArray, Bytes, store } from "@graphprotocol/graph-ts";
import {
  MemeAdded as MemeAddedEvent,
  MemeDatabase,
  MemeDeleted as MemeDeletedEvent,
  MemeEdited as MemeEditedEvent,
  WorkflowsAdded as WorkflowsAddedEvent,
} from "../generated/MemeDatabase/MemeDatabase";
import {
  MemeAdded,
  MemeDeleted,
  MemeEdited,
  WorkflowsAdded,
} from "../generated/schema";
import { MemeMetadata as MemeMetadataTemplate } from "../generated/templates";

export function handleMemeAdded(event: MemeAddedEvent): void {
  let entity = new MemeAdded(
    Bytes.fromByteArray(ByteArray.fromBigInt(event.params.memeId))
  );
  entity.sessionId = event.params.memeId;
  entity.data = event.params.data;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  let memes = MemeDatabase.bind(
    Address.fromString("0xa9af59DcDDFac01D3B51CC80982fe13EcDb0E0d6")
  );

  entity.owner = memes.getMemeOwner(event.params.memeId);
  entity.token = memes.getMemeToken(event.params.memeId);
  entity.symbol = memes.getMemeTokenSymbol(event.params.memeId);
  entity.name = memes.getMemeTokenName(event.params.memeId);
  entity.feed = memes.getMemeTokenFeed(event.params.memeId);

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
  entity.sessionId = event.params.memeId;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  store.remove(
    "MemeAdded",
    Bytes.fromByteArray(ByteArray.fromBigInt(event.params.memeId)).toHexString()
  );

  entity.save();
}

export function handleWorkflowsAdded(event: WorkflowsAddedEvent): void {
  let entity = new WorkflowsAdded(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  let memes = MemeDatabase.bind(
    Address.fromString("0xa9af59DcDDFac01D3B51CC80982fe13EcDb0E0d6")
  );

  let meme = MemeAdded.load(
    Bytes.fromByteArray(ByteArray.fromBigInt(event.params.memeId))
  );

  if (meme) {
    meme.workflows = memes.getMemeTokenWorkflows(event.params.memeId);

    meme.save();
  }

  entity.save();
}

export function handleMemeEdited(event: MemeEditedEvent): void {
  let entity = new MemeEdited(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  let memes = MemeDatabase.bind(
    Address.fromString("0xa9af59DcDDFac01D3B51CC80982fe13EcDb0E0d6")
  );

  let meme = MemeAdded.load(
    Bytes.fromByteArray(ByteArray.fromBigInt(event.params.memeId))
  );

  if (meme) {
    meme.data = memes.getMemeData(event.params.memeId);
    meme.feed = memes.getMemeTokenFeed(event.params.memeId);

    let ipfsHash = (meme.data as String).split("/").pop();
    if (ipfsHash != null) {
      meme.metadata = ipfsHash;
      MemeMetadataTemplate.create(ipfsHash);
    }

    meme.save();
  }

  entity.save();
}
