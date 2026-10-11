"use client";
// Libraries
import { z } from "zod";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

// Next.js
import Link from "next/link";
import { useRouter } from "next/navigation";

// Components
import Input from "@/app/components/Input";
import SubmitButton from "@/app/components/SubmitButton";

// Icons
import { FaAngleLeft } from "react-icons/fa6";
import { MdOutlineMail } from "react-icons/md";

// Schemas
import { forgetPasswordSchema } from "@/app/schemas/authSchema";

// API
import { useForgetPasswordMutation, ApiError } from "@/app/store/api";

// Types
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

type FormInput = z.input<typeof forgetPasswordSchema>;
type FormData = z.output<typeof forgetPasswordSchema>;
const initialForm: FormInput = { email: "" };
const Page = () => {
  const router = useRouter();
  const [forgetPassword, { isLoading }] = useForgetPasswordMutation();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<FormInput, undefined, FormData>({
    resolver: zodResolver(forgetPasswordSchema),
    defaultValues: initialForm,
    mode: "onTouched",
  });
  const onSubmit = async (data: FormData) => {
    try {
      const { message, code } = await forgetPassword(data).unwrap();
      toast.info(message);
      sessionStorage.setItem("resetPasswordCode", code);
      router.replace("/verify-reset-password");
      reset();
    } catch (error) {
      console.log("ERROR:", error);

      const err = error as FetchBaseQueryError;

      console.log("ERR DATA:", err.data);

      if (err.data) {
        const data = err.data as ApiError;

        console.log("MESSAGE:", data.message);

        toast.error(data.message);
      } else {
        toast.error("Email Not Found");
      }
    }
    // catch (error) {
    //   const err = error as FetchBaseQueryError;
    //   if (err.data) {
    //     const data = err.data as ApiError;
    //     toast.error(data.message);
    //   } else {
    //     toast.error("Email Not Found");
    //   }
    // }
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md w-full bg-gray-800/50 rounded-2xl shadow-xl 
			overflow-hidden"
    >
      <div className="p-6">
        <h2 className="mb-5 font-bold text-center w-full text-3xl bg-linear-to-r from-primary to-purple-600 text-transparent bg-clip-text">
          Forget Password
        </h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <p className="text-gray-300 mb-6 text-center">
            Enter your email address and we&apos;ll send you a link to reset
            your password.
          </p>
          <Input
            icon={MdOutlineMail}
            type="email"
            placeholder="Email Address"
            {...register("email")}
            error={errors.email?.message}
          />
          <SubmitButton
            name="Send Reset Link"
            isLoading={isLoading}
            isValid={isValid}
          />
        </form>
      </div>
      <div className="px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center">
        <Link
          href={"/login"}
          className="text-sm text-primary hover:underline flex items-center"
        >
          <FaAngleLeft className="h-4 w-4 mr-2" /> Back to Login
        </Link>
      </div>
    </motion.div>
  );
};

export default Page;
