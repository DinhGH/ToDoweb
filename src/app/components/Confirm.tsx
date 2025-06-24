import { useEffect, useRef } from "react";

type Props = {
  mess: string;
  onClose: () => void;
  onConfirm: () => void;
};

export default function Confirm({ mess, onClose, onConfirm }: Props) {
  const confirmRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        confirmRef.current &&
        !confirmRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <div
      ref={confirmRef}
      className="
        z-50
        w-full max-w-md
        p-6
        text-center
        bg-white
        rounded-xl border border-gray-300
        shadow-lg
        fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
      "
    >
      <h1
        className="
          mb-4
          text-xl font-semibold text-gray-800
        "
      >
        {mess}
      </h1>
      <div
        className="
          flex
          justify-center gap-4
        "
      >
        <button
          onClick={onClose}
          className="
            px-4 py-2
            text-gray-800 font-medium
            bg-gray-300
            rounded-lg
            transition-all
            hover:bg-gray-400 duration-200
          "
        >
          Close
        </button>
        <button
          onClick={onConfirm}
          className="
            px-4 py-2
            text-white font-medium
            bg-red-500
            rounded-lg
            transition-all
            hover:bg-red-600 duration-200
          "
        >
          Confirm
        </button>
      </div>
    </div>
  );
}
