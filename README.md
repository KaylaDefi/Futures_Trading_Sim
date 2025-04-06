Currently under development.

I built a crypto futures trading simulator that calculates the liquidation price based on the user’s entry price, leverage, and position type (long or short). The core logic is written in Rust for speed and reliability, and it's compiled to WebAssembly (WASM) so it runs directly in the browser. My Next.js + TypeScript frontend loads the WASM module, takes user inputs, and displays the calculated liquidation price in real time.

Breakdown:

Frontend: Next.js + React + Tailwind UI

Core logic: Rust function that computes liquidation price

Rust → WebAssembly: compiled using wasm-pack

Runs in browser: WASM module is loaded dynamically, no server needed

Liquidation logic: simple financial math (entry_price, leverage, maintenance margin)

Reactivity: When user inputs change, React re-calculates and updates UI
