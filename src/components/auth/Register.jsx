import { Button, Checkbox, Label, TextInput } from "flowbite-react";
import { useState } from "react";
import { useAuth } from "../../lib/useAuth";

const Register = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const {registerUser, signInWithGoogle} = useAuth()

    const handleSubmit = async(e)=> {
        e.preventDefault()
        registerUser(email,password)
    }
  return (
    <form className="flex max-w-lg flex-col gap-4" onSubmit={handleSubmit}>
    <div>
      <div className="mb-2 block">
        <Label htmlFor="email2" value="Your email" />
      </div>
      <TextInput id="email2" type="email" placeholder="name@gmail.com" required shadow value={email} onChange={(e) => setEmail(e.target.value)} />
    </div>
    <div>
      <div className="mb-2 block">
        <Label htmlFor="password2" value="Your password" />
      </div>
      <TextInput id="password2" type="password" required shadow value={password} onChange={(e) => setPassword(e.target.value)}/>
    </div>
   
    <div className="flex items-center gap-2">
      <Checkbox id="agree" />
      <Label htmlFor="agree" className="flex">
        I agree with the&nbsp;
        <p className="text-cyan-600 hover:underline dark:text-cyan-500">
          terms and conditions
        </p>
      </Label>
    </div>
    <Button type="submit">Register new account</Button>
    <p className="text-gray-400 text-center">OR</p>
    <Button gradientMonochrome="teal" onClick={signInWithGoogle}>Sign In with Google</Button>
  </form>
  )
}

export default Register