import { ImSpinner6 } from "react-icons/im";

const LoadingSpinner = () => {
  return (
    <div
      className="min-h-screen flex justify-center items-center bg-linear-to-br
  from-mainBackground
  via-[#17152B]
  to-[#24184A]"
    >
      <ImSpinner6 className="w-10 h-10 animate-spin mx-auto text-white" />
    </div>
  );
};

export default LoadingSpinner;
