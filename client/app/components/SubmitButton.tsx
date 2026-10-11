import { ImSpinner6 } from "react-icons/im";

type Props = {
  isLoading: boolean;
  isValid: boolean;
  name: string;
};

const SubmitButton = ({ isLoading, isValid, name }: Props) => {
  return (
    <button
      type="submit"
      style={{ fontWeight: 700 }}
      disabled={!isValid || isLoading}
      className={`${isValid ? "cursor-pointer from-primary hover:scale-[1.03] to-purple-600 hover:to-purple-800 text-white " : "cursor-not-allowed from-primary/30 to-purple-600/30 text-white/50"} mt-3 w-full bg-linear-to-r px-4 py-3 rounded-lg transition duration-300 focus:ring-2 focus:ring-primary focus:outline-none focus:ring-offset-2 focus:ring-offset-gray-900`}
    >
      {isLoading ? (
        <ImSpinner6 className="w-6 h-6 animate-spin mx-auto" />
      ) : (
        name
      )}
    </button>
  );
};

export default SubmitButton;
