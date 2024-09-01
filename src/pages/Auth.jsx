
import Register from "../components/auth/Register";
const Auth = () => {
  return (
    <section className="flex flex-col justify-center items-center h-full w-screen p-5">
     <div className="p-3 bg-[whitesmoke] md:w-[40%] rounded-lg shadow-lg">
      <Register/>
     </div>
    </section>
  );
};

export default Auth;
