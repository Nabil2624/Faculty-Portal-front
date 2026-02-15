
export default function ModalWrapper({ children, onClose }) {
  return (
    <div
      className="fixed inset-0 bg-black/50
                 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex justify-center items-center w-auto max-w-full max-h-[95vh] overflow-auto"
      >
        {children}
      </div>
    </div>
  );
}
