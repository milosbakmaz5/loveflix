type Gate = {
  opened: Promise<void>;
  open: () => void;
};

/** Holds a mocked call open until the test says so, so a pending state can't finish unseen. */
export function createGate(): Gate {
  let open = () => {};
  const opened = new Promise<void>((resolve) => {
    open = resolve;
  });
  return { opened, open };
}
