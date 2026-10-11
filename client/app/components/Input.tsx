import React from "react";
import { IconType } from "react-icons";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { useState } from "react";

type InputProps = {
  icon: IconType;
  error?: string;
  showbutton?: boolean;
  // showPassword?: boolean;
  // setShowPassword?: (showPassword: boolean) => void;
} & React.InputHTMLAttributes<HTMLInputElement>;

const Input = ({
  icon: Icon,
  error,
  showbutton = false,
  ...props
}: InputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="mb-6">
      <div className="relative">
        <div className="absolute inset-y-0 pointer-events-none pl-3 flex items-center">
          <Icon className="size-5 text-primary" />
        </div>
        <input
          type={showbutton && showPassword ? "text" : "password"}
          {...props}
          className="w-full py-2 pl-10 bg-gary-800 border border-gray-700 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none text-white placeholder-gray-300 transition duration-200 "
        />
        {showbutton && (
          <button
            type="button"
            className="absolute text-primary cursor-pointer inset-y-0 right-0 pr-3"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? (
              <IoEyeOutline size={20} />
            ) : (
              <IoEyeOffOutline size={20} />
            )}
          </button>
        )}
      </div>
      {error && <span className="text-sm text-red-500 mt-1">{error}</span>}
    </div>
  );
};

export default Input;
