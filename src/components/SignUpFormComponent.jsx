
import { useState, useRef, useEffect } from "react"
import BottomToast from "./BottomToast"
import BigButtonWrapper from "./BigButton"

function OtpVerificationPopup({ email, onVerificationSuccess, onClose, BASE_URL }) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const inputRefs = useRef([])

  // Focus the first input when component mounts
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }
  }, [])

  const handleChange = (index, value) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Auto-focus to next input
    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus()
    }
  }

  const handleKeyDown = (index, e) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === "Backspace" && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1].focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text")

    // Check if pasted content is a 6-digit number
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split("")
      setOtp(digits)

      // Focus the last input
      if (inputRefs.current[5]) {
        inputRefs.current[5].focus()
      }
    }
  }

  const verifyOtp = async () => {
    console.log("Verifying OTP...")
    const otpValue = otp.join("")

    if (otpValue.length !== 6) {
      setError("Please enter a valid 6-digit OTP")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(`https://55cr1n59r3.execute-api.us-east-2.amazonaws.com/dev/v1/auth/verify-otp`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          "body": {
          email,
          otp: otpValue,
          }
        }),
      })

      const data = await response.json()

      if (response.ok) {
        onVerificationSuccess()
      } else {
        setError(data.detail || "OTP verification failed")
      }
    } catch (error) {
      setError("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const resendOtp = async () => {
    setIsLoading(true)

    try {
      const response = await fetch(`${BASE_URL}/v1/resend-otp`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setError("OTP has been resent to your email")
        setTimeout(() => setError(null), 3000)
      } else {
        setError(data.detail || "Failed to resend OTP")
      }
    } catch (error) {
      setError("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="bg-white rounded-lg p-8 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Verify Your Email</h2>
        <p className="text-gray-600 mb-6">
          We've sent a verification code to {email}. Please enter the 6-digit code below.
        </p>

        <div className="flex justify-between mb-6">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={index === 0 ? handlePaste : undefined}
              className="w-12 h-12 text-center text-xl font-bold border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          ))}
        </div>

        <div className="mt-4 text-center">
          <button onClick={verifyOtp} disabled={isLoading} className="text-primary hover:underline focus:outline-none">
            Verify OTP
          </button>
        </div>

        <div className="mt-4 text-center">
          <button onClick={resendOtp} disabled={isLoading} className="text-primary hover:underline focus:outline-none">
            Resend OTP
          </button>
        </div>

        {error && <BottomToast text={error} textState={setError} color="grey" />}
      </div>
    </div>
  )
}

export default OtpVerificationPopup

