# ⚡ Cyberpunk Onchain PFP Battle Game

### 🔥 The Next Evolution of Interactive NFT Battles

Enter the neon-drenched battlegrounds of the future, where your NFTs aren't just collectibles—they're warriors. Built on Avalanche, our cyberpunk-style onchain PFP vs PFP battle game revolutionizes NFT combat with a **dynamic power system**, strategic gameplay, and **true ownership**.

## 🛠 Key Features

- **⚔️ PFP vs PFP Battles** – Engage in thrilling one-on-one fights, where your NFT's unique traits determine its power.
- **🧠 Integrated DQN NFTs** – AI-powered NFTs with evolving abilities and strategic decision-making.
- **⚡ Dynamic Power System** – Power fluctuates based on battle performance, ensuring a constantly evolving metagame.
- **🏆 High-Stakes & Casual Modes** – Choose between intense, high-reward battles or more strategic, low-power casual fights.
- **⛓️ Fully Onchain Gameplay** – Enjoy fast, low-cost transactions on Avalanche, ensuring seamless and trustless combat.
- **🛡️ True Ownership** – Every battle, win, and upgrade is recorded onchain, giving players complete control over their assets.

## 🎮 Gameplay Overview
1. **Select Your NFT Fighter** – Choose from a roster of unique, onchain warriors.
2. **Enter the Arena** – Pick between high-stakes or casual battle modes.
3. **Strategize & Fight** – Leverage your NFT's abilities and the dynamic power system to outplay your opponent.
4. **Claim Your Rewards** – Earn onchain rewards and level up your NFT's power.

## 🌎 Why Avalanche?
- **Blazing-fast transactions** ⚡
- **Low fees for seamless battles** 🏹
- **Robust smart contract security** 🔐

## 🚀 Join the Fight
Get ready to redefine NFT gaming with **fast-paced, strategic combat and onchain ownership**. Will you rise to the top, or will your PFP be left in the digital dust?

👾 Stay tuned for updates and be among the first to enter the cyberpunk battlegrounds!

# Card Battle Arena

An online multiplayer card game where players battle with cards that have random attack and defense points.

## Game Rules

1. Each player starts with 5 random cards and 20 HP.
2. Players take turns playing cards against each other.
3. Cards have attack and defense values, as well as elemental types (fire, water, earth, air).
4. Elements have strengths and weaknesses:
   - Fire is strong against Air, weak against Water
   - Water is strong against Fire, weak against Earth
   - Earth is strong against Water, weak against Air
   - Air is strong against Earth, weak against Fire
5. When a card has an elemental advantage, its attack is increased by 50%.
6. When a card has an elemental disadvantage, its attack is reduced by 25%.
7. The player who deals more damage wins the round and damages the opponent's HP.
8. If a player's HP reaches 0, the opponent wins a round.
9. The first player to win 3 rounds wins the game.

## Project Structure

- `new_client/`: Next.js client application with integrated Socket.IO server

## Installation

```bash
cd new_client
npm install
```

## Running the Game

1. Start the Next.js application:

```bash
cd new_client
npm run dev
```

2. Open your browser and navigate to `http://localhost:3000`

3. Open another browser window or tab to `http://localhost:3000` to play as the second player

## Required Libraries

### Dependencies

- Next.js
- React
- Socket.IO Client
- Socket.IO (server)
- TailwindCSS

## How It Works

The game uses Socket.IO integrated directly into Next.js API routes to handle real-time communication between players. This approach simplifies deployment and eliminates the need for a separate server.

The Socket.IO server is initialized in the `/api/socket.js` file, which sets up all the game logic and event handlers. The client connects to this server through the Socket.IO client library.

## Environment Variables

No environment variables are required since the Socket.IO server is integrated into the Next.js application. The client and server communicate through the same origin.

