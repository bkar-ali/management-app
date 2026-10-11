import React from "react";

type Props = { password: string };

export const getStrength = (pass: string) => {
  let strength: number = 0;
  if (pass.length >= 6) strength++;
  if (pass.match(/[A-Z]/) && pass.match(/[a-z]/)) strength++;
  if (pass.match(/[\d]/)) strength++;
  if (pass.match(/[^A-Za-z\d]/)) strength++;
  return strength;
};

const PasswordCriteria = ({ password }: Props) => {
  const criteria = [
    { label: "At least 6 characters", met: password.length >= 6 },
    { label: "Contains uppercase letter", met: /[A-Z]/.test(password) },
    { label: "Contains lowercase letter", met: /[a-z]/.test(password) },
    { label: "Contains a number", met: /\d/.test(password) },
    { label: "Contains special character", met: /[^A-Za-z0-9]/.test(password) },
  ];
  return (
    <div className="mt-2 space-y-1">
      {criteria.map((item, index) => (
        <div key={index} className="flex text-xs duration-300 items-center">
          {item.met ? (
            <span className="text-primary mr-2 size-4">✓</span>
          ) : (
            <span className="text-gray-500 mr-2 size-4">✗</span>
          )}
          <span
            className={
              item.met
                ? `text-primary duration-300`
                : `text-gray-500 duration-300`
            }
          >
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
};

const PasswordStrengthMeter = ({ password }: Props) => {
  const strengthNumber = getStrength(password);

  const getColor = (strength: number) => {
    if (strength === 0) return "bg-red-500";
    if (strength === 1) return "bg-red-400";
    if (strength === 2) return "bg-yellow-500";
    if (strength === 3) return "bg-yellow-400";
    return "bg-green-500";
  };

  const getStrengthText = (strength: number) => {
    if (strength === 0) return "Very Weak";
    if (strength === 1) return "Weak";
    if (strength === 2) return "Fair";
    if (strength === 3) return "Good";
    return "Strong";
  };

  return (
    <div className="mt-2">
      <div className="flex justify-between mb-2">
        <span className={`text-xs text-gray-400`}>Password Strength: </span>
        <span className={`text-xs text-gray-400`}>
          {getStrengthText(strengthNumber)}
        </span>
      </div>
      <div className="flex space-x-1">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className={`h-1 w-1/4 rounded-full duration-300 
                ${index < strengthNumber ? getColor(strengthNumber) : "bg-gray-600"}
              `}
          />
        ))}
      </div>

      <PasswordCriteria password={password} />
    </div>
  );
};

export default PasswordStrengthMeter;
