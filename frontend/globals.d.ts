export {};

declare global {
  interface Window {
    ethereum?: any;
    phantom?: {
      ethereum?: any;
    };
  }
}
