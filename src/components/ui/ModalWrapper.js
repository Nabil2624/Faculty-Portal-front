export default function ModalWrapper({ children, onClose }) {
  return (
    <div
      className="fixed inset-0 bg-black/40 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div className="rounded-lg w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}
