import { Spinner } from "flowbite-react"

const Loader = () => {
  return (
    <div className="flex w-full h-screen items-center justify-center">
    <Spinner aria-label="large Center-aligned spinner example" size="xl" />
  </div>
  )
}

export default Loader