Currently under development.

A crypto futures trading simulator where users can connect a wallet (MetaMask on testnet), specify a trade size, choose leverage and position type (long or short), and simulate entering and exiting trades. The simulator calculates liquidation price, position size, and realized PnL, giving users a realistic feel for perpetual futures trading — without risking real assets.

🔧 Technologies

Frontend: Next.js + React (TypeScript)

Wallet Integration: MetaMask via ethers.js, with real-time balance and network detection

Core Logic: Rust (compiled to WebAssembly via wasm-pack)

Context Management: React Context API for account and wallet state

🧠 Key Features

Connect/disconnect MetaMask wallet (testnet only)

Fetch and display live ETH price

Input trade amount, leverage, and position type

Calculate liquidation price and position size using WASM

Enter and exit positions manually

Show real-time PnL (profit/loss) upon exiting trades

💻 How It Works

Rust handles all core calculations for speed and precision

WASM loads dynamically in the browser — no backend required

React state manages all user input and reactivity

🚧 In Progress

Improved UI for trade history and PnL tracking

Multiple positions and cross-margin logic

Testnet order simulation with on-chain confirmations
