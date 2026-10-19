"use client";
// Libraries
import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";

// Next.js
import { useRouter } from "next/navigation";

// API
import { useVerifyResetPassowrdMutation } from "@/app/store/api";

const VerifyEmail = () => {
  const router = useRouter();
  const [verifyResetPass, { isLoading }] = useVerifyResetPassowrdMutation();
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const isComplete = code.every((d) => d !== "");

  useEffect(() => {
    if (!sessionStorage.getItem("resetPasswordCode")) {
      router.replace("/forgotPassword");
    }
  }, [router]);

  const handleChange = (index: number, value: string) => {
    value = value.replace(/\s/g, ""); //? Remove Spaces
    if (/\D/.test(value)) return; //? If There is Any character

    const newCode = [...code];

    if (value.length > 1) {
      const pastedCode = value.slice(0, 6).split("");
      for (let i = 0; i < pastedCode.length; i++) {
        newCode[i] = pastedCode[i];
      }
      setCode(newCode);

      const lastFocusIndex = newCode.findLastIndex((d) => d !== "");
      const focusIndex = lastFocusIndex < 5 ? lastFocusIndex + 1 : 5;
      inputRefs.current[focusIndex]?.focus();
    } else {
      newCode[index] = value;
      setCode(newCode);
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handelKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handelPasted = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault(); // ? Prevent Put All Digits In One Input
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    const newcode = [...code];
    pasted.split("").forEach((digit, index) => {
      newcode[index] = digit;
    });
    setCode(newcode);
    const nextIndex = Math.min(pasted.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const resetPasswordCodeSubmit = useCallback(async () => {
    const verificationCode = code.join("");
    try {
      await verifyResetPass({ code: verificationCode }).unwrap();
      router.replace("/resetPassword");
    } catch (error) {
      console.log(error);
      toast.error("Invalid Reset code. Please try again");
    }
  }, [verifyResetPass, code, router]);

  const handelSubmit = useCallback(
    async (e: React.SubmitEvent<HTMLFormElement>) => {
      e.preventDefault();
      resetPasswordCodeSubmit();
    },
    [resetPasswordCodeSubmit],
  );

  //! Auto submit when all fields are filled
  useEffect(() => {
    if (code.every((d) => d !== "")) {
      resetPasswordCodeSubmit();
    }
  }, [code, resetPasswordCodeSubmit]);

  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    const timer = setTimeout(() => {
      toast(`${sessionStorage.getItem("resetPasswordCode")}!`, {
        cancel: {
          label: "Close",
          onClick: () => console.log("Canceled"),
        },
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-800/50 max-w-md w-full rounded-2xl shadow-xl overflow-hidden"
    >
      <div className="px-10 py-8">
        <h2 className="mb-5 font-bold text-center w-full text-3xl bg-linear-to-r from-primary to-purple-600 text-transparent bg-clip-text">
          Verify Your Email
        </h2>
        <p className="text-center text-gray-300 mb-6">
          Enter the 6-digit code sent to your email address.
        </p>
        <form onSubmit={handelSubmit} className="space-y-6">
          <div className="flex justify-between">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(ele) => {
                  inputRefs.current[index] = ele;
                }}
                type="text"
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handelKeyDown(index, e)}
                onPaste={(e) => handelPasted(e)}
                inputMode="numeric"
                autoComplete="one-time-code"
                value={digit}
                maxLength={1}
                className="w-12 h-12 text-center text-2xl font-bold bg-gray-700 text-white border-2 border-gray-600 rounded-lg focus:border-purple-600 focus:outline-none"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={isLoading || !isComplete}
            style={{ fontWeight: 700 }}
            className={`${
              !isLoading && isComplete
                ? "cursor-pointer from-primary hover:scale-[1.03] to-purple-600 hover:to-purple-800 text-white"
                : "cursor-not-allowed from-primary/30 to-purple-600/30 text-gray-300"
            } mt-3 w-full bg-linear-to-r px-4 py-3 rounded-lg transition duration-300 focus:ring-2 focus:ring-primary focus:outline-none focus:ring-offset-2 focus:ring-offset-gray-900`}
          >
            {isLoading ? "Verifying..." : "Verify Email"}
          </button>
        </form>
      </div>
      <div className="px-8 py-4 bg-gray-900/50 flex justify-center">
        <p className="text-gray-400 text-sm flex">
          Didn&apos;t receive it?{" "}
          <span
            className="ml-1 flex justify-center text-[14px] text-primary hover:text-purple-600 duration-300 tracking-wider hover:underline cursor-pointer"
            onClick={() => router.replace("/forgotPassword")}
          >
            Send Again
          </span>
        </p>
      </div>
    </motion.div>
  );
};

export default VerifyEmail;
