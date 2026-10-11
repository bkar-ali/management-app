import React from "react";
import { CiSearch } from "react-icons/ci";
type inputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = ({ className, ...props }: inputProps) => {
  return (
    <div className={`relative w-fit ${className}`}>
      <input
        {...props}
        className={` duration-300 border border-mainBorder bg-input rounded-xl px-3 py-1 focus:outline-none focus:border-primary w-56 md:w-64 lg:w-80`}
      />
      <CiSearch className="absolute top-1/2 -translate-y-1/2 right-3" />
    </div>
  );
};

export default Input;
