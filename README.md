Currently under development.

# Crypto Futures Trading Simulator

A crypto futures trading simulator where users can connect a wallet (MetaMask on testnet), specify a trade size, choose leverage and position type (long or short), and simulate entering and exiting trades. The simulator calculates liquidation price, position size, and realized PnL, giving users a realistic feel for perpetual futures trading — without risking real assets.

## Technologies

- **Frontend**: Next.js + React (TypeScript)
- **Wallet Integration**: MetaMask via `ethers.js`, with real-time balance and network detection
- **Core Logic**: Rust (compiled to WebAssembly using `wasm-pack`)
- **State Management**: React Context API for wallet and account state

## Features

- Connect and disconnect MetaMask wallet (testnet only)
- Fetch and display live ETH price
- Input trade amount, leverage, and position type
- Calculate liquidation price and position size using WebAssembly
- Manually enter and exit trades
- Display real-time profit or loss upon exiting a position

## How It Works

- Rust handles all core calculations for performance and precision
- WebAssembly runs directly in the browser — no backend required
- React manages reactivity and user interface updates

## In Progress

- See Issues to follow along.

