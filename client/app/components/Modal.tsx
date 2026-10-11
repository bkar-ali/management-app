import React from "react";
import ReactDOM from "react-dom";
import Header from "./Header";
import { IoMdClose } from "react-icons/io";

type Props = {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  name: string;
};

const Modal = ({ isOpen, children, onClose, name }: Props) => {
  if (!isOpen) return null;
  return ReactDOM.createPortal(
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex h-full w-full items-center justify-center overflow-y-auto bg-gray-600/50 p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl rounded-lg bg-mainBackground p-4 shadow-lg"
      >
        <div className="mb-5 flex w-full items-center justify-between">
          <h1 className={` font-semibold text-mainText `}>{name}</h1>
          <button
            className="duration-300 rounded-full flex items-center bg-primary p-2 text-white hover:bg-primary-hover cursor-pointer"
            onClick={onClose}
          >
            <IoMdClose size={18} />
          </button>
        </div>

        {/* <Header
          name={name}
          Icon={IoMdClose}
          event={onClose}
          buttonName="s"
          isSmallText
        /> */}
        {children}
      </div>
    </div>,
    document.body,
  );
};

export default Modal;
