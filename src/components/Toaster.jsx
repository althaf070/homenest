/* eslint-disable react/prop-types */
import { HiCheck } from "react-icons/hi";
import { Toast } from "flowbite-react";
const Toaster = ({message}) => {
  return (
    <Toast duration={500}>
    <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
      <HiCheck className="h-5 w-5" />
    </div>
    <div className="ml-3 text-sm font-normal">{message}</div>
    <Toast.Toggle />
  </Toast>
  )
}

export default Toaster