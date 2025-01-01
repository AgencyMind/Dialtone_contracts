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
    let title = value.get("title");
    if (title && title.kind === JSONValueKind.STRING) {
      metadata.title = title.toString();
    }
    let token = value.get("token");
    if (token && token.kind === JSONValueKind.STRING) {
      metadata.token = token.toString();
    }

    let tags = value.get("tags");
    if (tags && tags.kind === JSONValueKind.STRING) {
      metadata.tags = tags.toString();
    }

    metadata.save();
  }
}
