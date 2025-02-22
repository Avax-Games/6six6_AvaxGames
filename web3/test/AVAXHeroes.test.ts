import { expect } from "chai";
import { ethers } from "hardhat";
import { AVAXHeroes } from "../typechain-types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("AVAXHeroes", function () {
  let avaxHeroes: AVAXHeroes;
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;
  let addr2: SignerWithAddress;
  const META_URI = "https://game.example/api/item/{id}.json";

  beforeEach(async function () {
    // Get signers
    [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy contract
    const AVAXHeroes = await ethers.getContractFactory("AVAXHeroes");
    avaxHeroes = await AVAXHeroes.deploy(META_URI);
    await avaxHeroes.deployed();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await avaxHeroes.owner()).to.equal(owner.address);
    });

    it("Should set the base URI", async function () {
      expect(await avaxHeroes.baseURI()).to.equal(META_URI);
    });
  });

  describe("Game Operations", function () {
    it("Should register a new player", async function () {
      await avaxHeroes.connect(addr1).registerPlayer("Player1", "Token1");
      const player = await avaxHeroes.getPlayer(addr1.address);
      expect(player.playerName).to.equal("Player1");
      expect(player.playerMana).to.equal(10);
      expect(player.playerHealth).to.equal(25);
    });

    it("Should create a battle", async function () {
      // Register player first
      await avaxHeroes.connect(addr1).registerPlayer("Player1", "Token1");
      
      // Create battle
      await avaxHeroes.connect(addr1).createBattle("Battle1");
      const battle = await avaxHeroes.getBattle("Battle1");
      expect(battle.name).to.equal("Battle1");
      expect(battle.players[0]).to.equal(addr1.address);
    });
  });
});