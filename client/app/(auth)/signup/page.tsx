"use client";
// Libraries
import { motion } from "framer-motion";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";

// Next.js
import Link from "next/link";
import { useRouter } from "next/navigation";

// Components
import PasswordStrengthMeter from "@/app/components/PasswordStrengthMeter";
import Input from "@/app/components/Input";
import SubmitButton from "@/app/components/SubmitButton";

// Icons
import { IoMdPerson } from "react-icons/io";
import { MdOutlineMail } from "react-icons/md";
import { CiLock } from "react-icons/ci";

// Schemas
import { signupSchema } from "@/app/schemas/authSchema";

// API
import { useSignupMutation, ApiError } from "@/app/store/api";

// Types
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

type FormInput = z.input<typeof signupSchema>;
type FormData = z.output<typeof signupSchema>;

const initialForm: FormInput = {
  username: "",
  email: "",
  password: "",
};

const Page = () => {
  const router = useRouter();
  const [signup, { isLoading }] = useSignupMutation();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isValid },
  } = useForm<FormInput, undefined, FormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: initialForm,
    mode: "onTouched",
  });

  const password = useWatch({ control, name: "password" });

  const onsubmit = async (data: FormData) => {
    try {
      const { user, message } = await signup(data).unwrap(); // Unwrap the result to get the actual response data

      if (user.emailVerificationToken) {
        sessionStorage.setItem("verificationCode", user.emailVerificationToken);
      }
      toast.info(message);

      router.replace("/verify-email");

      reset();
    } catch (error) {
      const err = error as FetchBaseQueryError;

      if (err.data) {
        const data = err.data as ApiError;
        toast.error(data.message);
      } else {
        toast.error("Signup Failed");
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
        <h2 className="mb-5 font-bold text-center w-full text-3xl bg-linear-to-r from-primary to-purple-600 text-transparent bg-clip-text">
          Create Account
        </h2>
        <form onSubmit={handleSubmit(onsubmit)}>
          <Input
            type="text"
            placeholder="Full Name"
            icon={IoMdPerson}
            {...register("username")}
            error={errors.username?.message}
          />

          <Input
            type="text"
            placeholder="Email"
            icon={MdOutlineMail}
            {...register("email")}
            error={errors.email?.message}
          />

          <Input
            placeholder="Password"
            icon={CiLock}
            {...register("password")}
            error={errors.password?.message}
            showbutton={true}
          />

          <PasswordStrengthMeter password={password} />
          <SubmitButton
            isLoading={isLoading}
            isValid={isValid}
            name="Sign Up"
          />
        </form>
      </div>
      <div className="px-8 py-4 bg-gray-900/50 flex justify-center">
        <p className="text-gray-400 text-sm">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default Page;
