# Decentralized Land Registry — Blockchain Assignment

## Project Structure
```
land-registry/
├── contracts/
│   └── LandRegistry.sol       ← Smart contract (Student 1)
├── scripts/
│   └── deploy.js              ← Deploy script (Student 3)
├── test/
│   └── LandRegistry.test.js   ← Tests (Student 3)
├── frontend/
│   └── index.html             ← Full frontend, single file (Student 2 & 4)
├── hardhat.config.js
└── package.json
```

---

## Setup & Run (Step by Step)

### 1. Install dependencies
```bash
npm install
```

### 2. Start local blockchain (pick one)
```bash
# Option A — Hardhat node
npx hardhat node

# Option B — Open Ganache GUI and start a workspace on port 7545
```

### 3. Compile the contract
```bash
npx hardhat compile
```

### 4. Deploy the contract
```bash
# Hardhat node
npx hardhat run scripts/deploy.js --network hardhat

# Ganache GUI
npx hardhat run scripts/deploy.js --network ganache
```
Copy the printed contract address.

### 5. Update the frontend
Open `frontend/index.html` and paste the address on this line:
```js
const CONTRACT_ADDRESS = "PASTE_CONTRACT_ADDRESS_HERE";
```

### 6. Open the frontend
Just open `frontend/index.html` in your browser. No build step needed.

### 7. Connect MetaMask
- Add network: RPC `http://127.0.0.1:8545` (Hardhat) or `7545` (Ganache), Chain ID `1337`
- Import a test account using a private key from Ganache/Hardhat
- Click "Connect Wallet" in the app

### 8. Run tests
```bash
npx hardhat test
```

---

## Demo Scenario (for presentation)

1. **Register** — Upload any file + enter `ZMB-LUS-001` → Register
2. **Verify** — Upload same file + enter `ZMB-LUS-001` → Shows AUTHENTIC
3. **Verify fraud** — Upload a *different* file + same ID → Shows INVALID
4. **Transfer** — Enter land ID + another MetaMask address → Transfer
5. **History** — Enter land ID → See full ownership timeline

---

## Student Roles

| Student | Responsibility | Files |
|---------|---------------|-------|
| 1 | Smart Contract (Solidity) | `contracts/LandRegistry.sol` |
| 2 | Wallet & Blockchain Calls (ethers.js) | `frontend/index.html` — JS section |
| 3 | Deploy, Test, Hardhat Setup | `hardhat.config.js`, `scripts/`, `test/` |
| 4 | User Interface (HTML/CSS) | `frontend/index.html` — HTML/CSS section |
