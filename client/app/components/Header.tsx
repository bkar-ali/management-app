import React from "react";
import { ReactNode } from "react";
import { IconType } from "react-icons";
// React icon
import { FaPlus } from "react-icons/fa";

type Props = {
  name: string;
  buttonName?: string;
  isSmallText?: boolean;
  event?: () => void;
  Icon?: IconType;
  margin?: boolean;
};

const Header = ({
  name,
  buttonName,
  isSmallText = false,
  event,
  Icon = FaPlus,
  margin = true,
}: Props) => {
  return (
    <div
      className={`${margin && "mb-5"} flex w-full items-center justify-between`}
    >
      <h1 className={`${isSmallText ? "text-lg" : "text-2xl "} font-semibold `}>
        {name}
      </h1>

      {buttonName && (
        <button
          className="duration-300 flex items-center rounded-md bg-primary px-3 py-2 text-white hover:bg-primary-hover cursor-pointer"
          onClick={event}
        >
          <Icon className="mr-2" size={18} />

          {buttonName}
        </button>
      )}
    </div>
  );
};

export default Header;
