// Dev-only switches the mock repositories read on every call (toggled from the kitchen sink).
let simulateNetworkErrors = false;

export const devSettings = {
  get simulateNetworkErrors(): boolean {
    return simulateNetworkErrors;
  },
  setSimulateNetworkErrors(value: boolean): void {
    simulateNetworkErrors = value;
  },
};
