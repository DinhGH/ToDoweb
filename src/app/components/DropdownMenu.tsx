import { useEffect, useRef } from "react";

type Props = {
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onDone: () => void;
};

export default function DropdownMenu({
  onClose,
  onEdit,
  onDelete,
  onDone,
}: Props) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div
      ref={dropdownRef}
      className="
        z-10
        p-2
        bg-white
        shadow-lg
        absolute top-0 left-1/2 -translate-x-1/2 rounded
      "
    >
      <button
        onClick={onDone}
        className="
          block
          w-full
          px-4 py-1
          rounded-2xl
          hover:bg-[#5180F6]
        "
      >
        Done
      </button>
      <button
        onClick={onEdit}
        className="
          block
          w-full
          px-4 py-1
          rounded-2xl
          hover:bg-[#5180F6]
        "
      >
        Edit
      </button>
      <button
        onClick={onDelete}
        className="
          block
          w-full
          px-4 py-1
          rounded-2xl
          hover:bg-[#5180F6]
        "
      >
        Remove
      </button>
    </div>
  );
}
