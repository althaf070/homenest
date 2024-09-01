import { Button } from "flowbite-react";
import { propertyCategories } from "../utils/constants";
import { useState } from "react";
import PropetiesList from "../components/PropetiesList";

const Home = () => {
  const [catlogs, setCatlogs] = useState("All");

  return (
    <>
      <section
        id="home"
        className="md:h-screen h-[90vh] w-full overflow-hidden relative shadow-lg mb-6"
      >
        <div className="h-full w-full relative">
          <img
            src="/wave-haikei.svg"
            alt="bg"
            className="h-full w-full object-cover"
          />
          <div className="absolute top-0 mt-5 md:mt-0 md:grid p-3 md:P-0 grid-cols-12">
            <div className="col-span-6 md:mt-24 md:ml-10">
              <h1 className="md:text-8xl text-4xl font-semibold text-white">
                Find Your Dream{" "}
              </h1>
              <p className="text-gray-200">
                Our Catalog Will Surprise You,discover luxury propeties at
                affrdable price
              </p>
              <Button radientmonochrome="cyan" className="mt-5 mb-5">
                Explore Now
              </Button>
            </div>

            <div className="col-span-6 right-0">
              <img
                src="/build.jpg"
                alt="building"
                className="w-full h-full object-cover rounded-lg shadow-lg"
                loading="lazy"
              />
            </div>
          </div>
        </div>
        <section className="w-full">
          {/* large screen */}
          <div className="md:block p-5 bg-[whitesmoke] md:w-[1200px] w-full absolute bottom-3 rounded-lg md:mx-[10rem] mr-5 shadow-lg">
            <div className="flex md:justify-around justify-between flex-wrap m-3">
              {propertyCategories.length > 0 &&
                propertyCategories.map((category, i) => (
                  <div
                    key={i}
                    onClick={() => setCatlogs(category)}
                    className={`cursor-pointer p-3 rounded-lg ${
                      catlogs === category ?
                      "bg-gray-700 text-white" : "bg-slate-200"
                    }`}
                  >
                    {category}
                  </div>
                ))}
            </div>
          </div>
        </section>
      </section>
      <PropetiesList query={catlogs}/>
    </>
  );
};

export default Home;
