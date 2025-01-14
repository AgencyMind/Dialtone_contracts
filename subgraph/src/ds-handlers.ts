import {
  Bytes,
  JSONValueKind,
  dataSource,
  json,
} from "@graphprotocol/graph-ts";
import { MemeMetadata } from "../generated/schema";

export function handleMemeMetadata(content: Bytes): void {
  let metadata = new MemeMetadata(dataSource.stringParam());
  const value = json.fromString(content.toString()).toObject();
  if (value) {
    let image = value.get("image");
    if (image && image.kind === JSONValueKind.STRING) {
      metadata.image = image.toString();
    }
    let name = value.get("name");
    if (name && name.kind === JSONValueKind.STRING) {
      metadata.name = name.toString();
    }
    let lore = value.get("lore");
    if (lore && lore.kind === JSONValueKind.STRING) {
      metadata.lore = lore.toString();
    }

    let symbol = value.get("symbol");
    if (symbol && symbol.kind === JSONValueKind.STRING) {
      metadata.symbol = symbol.toString();
    }

    metadata.save();
  }
}

