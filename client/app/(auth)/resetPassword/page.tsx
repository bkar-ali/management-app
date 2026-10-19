"use client";
// React
import { useEffect } from "react";

// Libraries
import { motion } from "framer-motion";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";

// Next.js
import { useRouter } from "next/navigation";

// Components
import Input from "@/app/components/Input";
import PasswordStrengthMeter from "@/app/components/PasswordStrengthMeter";
import SubmitButton from "@/app/components/SubmitButton";

// Icons
import { CiLock } from "react-icons/ci";

// Schemas
import { resetPasswordSchema } from "@/app/schemas/authSchema";

// API
import { useResetPasswordMutation } from "@/app/store/api";

// Types
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { ApiError } from "@/app/store/api";

type ForInput = z.input<typeof resetPasswordSchema>;
type FormData = z.output<typeof resetPasswordSchema>;

const initialForm = {
  password: "",
  confirmPassword: "",
};

const ResetPassword = () => {
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const router = useRouter();

  useEffect(() => {
    if (!sessionStorage.getItem("resetPasswordCode")) {
      router.replace("/forgotPassword");
    }
  }, [router]);

  const {
    register,
    reset,
    handleSubmit,
    control,
    formState: { isValid, errors },
  } = useForm<ForInput, undefined, FormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: initialForm,
    mode: "onTouched",
  });

  const password = useWatch({ control, name: "password" });

  const onSubmit = async (data: FormData) => {
    const code = sessionStorage.getItem("resetPasswordCode");
    if (!code) {
      toast.error("Reset session expired. Please request a new code.");
      router.replace("/forgotPassword");
      return;
    }

    try {
      await resetPassword({
        code,
        newPassword: data.password,
      }).unwrap();
      sessionStorage.removeItem("resetPasswordCode");
      router.replace("/login");
      reset();
    } catch (error) {
      const err = error as FetchBaseQueryError;
      if (err.data) {
        const apiError = err.data as ApiError;
        toast.error(apiError.message);
      } else {
        toast.error("Reset Password Failed");
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md w-full bg-gray-800/50 bg-opacity-50 rounded-2xl shadow-xl overflow-hidden"
    >
      <div className="p-6">
        <h2 className="mb-5 font-bold text-center w-full text-3xl bg-linear-to-r from-primary to-purple-600 text-transparent bg-clip-text">
          Reset Password
        </h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            icon={CiLock}
            placeholder="New Password"
            showbutton
            {...register("password")}
            error={errors.password?.message}
          />
          <Input
            icon={CiLock}
            placeholder="Confirm New Password"
            showbutton
            {...register("confirmPassword")}
            error={errors.confirmPassword?.message}
          />
          <PasswordStrengthMeter password={password} />
          <SubmitButton
            name="Set New Password"
            isValid={isValid}
            isLoading={isLoading}
          />
        </form>
      </div>
    </motion.div>
  );
};

export default ResetPassword;
