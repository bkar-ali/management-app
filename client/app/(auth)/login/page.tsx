"use client";
// Libraries
import { motion } from "framer-motion";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

// Next.js
import Link from "next/link";
import { useRouter } from "next/navigation";

// Components
import Input from "@/app/components/Input";
import SubmitButton from "@/app/components/SubmitButton";

// Icons
import { IoMdPerson } from "react-icons/io";
import { CiLock } from "react-icons/ci";

// Schemas
import { loginSchema } from "@/app/schemas/authSchema";

// API
import { ApiError, useLoginMutation } from "@/app/store/api";

// Types
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { legacy_createStore } from "redux";

type FormInput = z.input<typeof loginSchema>;
type FormData = z.output<typeof loginSchema>;

const initialForm: FormInput = {
  email: "",
  password: "",
};

const Page = () => {
  const router = useRouter();
  const [login, { isLoading }] = useLoginMutation();
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormInput, undefined, FormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: initialForm,
    mode: "onTouched",
  });
  const onsubmit = async (data: FormData) => {
    try {
      const { message } = await login(data).unwrap();
      toast.info(message);
      router.replace("/");

      reset();
    } catch (error) {
      const err = error as FetchBaseQueryError;
      if (err.data) {
        const data = err.data as ApiError;
        toast.error(data.message);
      } else {
        toast.error("Login Failed");
      }
    }
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
        <h2 className="text-3xl font-bold p-5 flex items-center justify-center bg-linear-to-r from-primary to-purple-600 text-transparent bg-clip-text">
          Welcome Back
        </h2>
        <form onSubmit={handleSubmit(onsubmit)}>
          <Input
            icon={IoMdPerson}
            type="text"
            placeholder="Full Name"
            {...register("email")}
            error={errors.email?.message}
            // value={"alice@example.com"}
          />
          <Input
            icon={CiLock}
            placeholder="Password"
            showbutton
            {...register("password")}
            error={errors.password?.message}
          />
          <div className="flex items-center mb-6">
            <Link
              href="/forgetPassword"
              className="text-sm text-primary
               hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <SubmitButton name="Log In" isLoading={isLoading} isValid={isValid} />
        </form>
      </div>
      <div className="px-8 py-4 bg-gray-900/50 flex justify-center">
        <p className="text-gray-400 text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-primary hover:underline">
            Signup
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default Page;
