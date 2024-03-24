import { useRef } from "react";
import { Minus } from "../icon/minus";

const Dialog = () => {
  const ref = useRef<HTMLDialogElement>(null);

  function showDialog() {
    ref.current!.show;
  }

  function closeDialog() {
    ref.current!.close();
  }

  return (
    <dialog>
      <form>menu</form>
    </dialog>
  );
};

const Form = () => {
  return (
    <form method="dialog">
      <button onClick={() => close}>
        <Minus />
      </button>
    </form>
  );
};

export { Dialog };
