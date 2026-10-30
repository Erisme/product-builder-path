import { useStore } from "../state/store";

export function Toast() {
  const { toastMsg } = useStore();
  return (
    <div className={"toast" + (toastMsg ? " show" : "")} role="status" aria-live="polite">
      {toastMsg}
    </div>
  );
}
