import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { BigInt } from "@graphprotocol/graph-ts"
import { MemeAdded } from "../generated/schema"
import { MemeAdded as MemeAddedEvent } from "../generated/MemeDatabase/MemeDatabase"
import { handleMemeAdded } from "../src/meme-database"
import { createMemeAddedEvent } from "./meme-database-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let sessionId = BigInt.fromI32(234)
    let data = "Example string value"
    let newMemeAddedEvent = createMemeAddedEvent(sessionId, data)
    handleMemeAdded(newMemeAddedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("MemeAdded created and stored", () => {
    assert.entityCount("MemeAdded", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "MemeAdded",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "sessionId",
      "234"
    )
    assert.fieldEquals(
      "MemeAdded",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "data",
      "Example string value"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
