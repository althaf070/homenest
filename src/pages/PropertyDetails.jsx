import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchPropertyById } from "../lib/services";
import Loader from "../components/Loader";
import tower from "../assets/tower.png";
import { Badge, Button } from "flowbite-react";

const PropertyDetails = () => {
  const { pid } = useParams();
  const [properties, setProperties] = useState(null);

  const fetchItem = async () => {
    const properties = await fetchPropertyById(pid);
    setProperties(properties);
  };
  useEffect(() => {
    fetchItem();
  }, []);
  console.log(properties);
  return (
    <section className="m-5 bg-[#1d6b73] min-h-screen rounded-2xl shadow-xl shadow-gray-800 p-3">
      {properties ? (
        <div>
          <h1 className="md:text-4xl font-semibold capitalize text-[whiteSmoke] m-3">
            {properties.title}
          </h1>
          <div className="grid md:grid-cols-2 ">
            <div className="">
              <img
                src={properties.imageURL}
                alt={properties.title}
                className="rounded-lg shadow-xl"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = tower;
                }}
              />
              <div className="bg-gradient-to-r from-slate-500 to-teal-700 p-4 text-[whiteSmoke] my-4 rounded-lg text-md ">
                <p>About Property:{properties.description}</p>
                <p>Property Type:{properties.type}</p>
                <p className="m-2">
                  {properties.type == "land"
                    ? `${properties.size}cent`
                    : `${properties.size}sqft`}
                </p>
                {properties.available ? (
                  <Badge color="failure" className="w-40">
                    Property Currently Not Available
                  </Badge>
                ) : (
                  <Badge color="success" className="w-40">
                    Property Available
                  </Badge>
                )}
                  <Button className="my-4" color="success">Book AppointMent</Button>
               {/* TODO -Chat functionality*/}
              </div>
            </div>
            <div className="grid grid-rows-3 md:p-10 mt-5 md:m-[-25px] gap-5">
              {/* amneties */}
              <div className="rounded-lg shadow-lg bg-gradient-to-r from-slate-700 to-slate-500 text-white p-3">
                <h1 className="text-2xl font-semibold tracking-wide">
                  Price:{properties.price} Rs.
                </h1>
                <h3 className="text-md mb-1 underline underline-offset-4">
                  Amneties
                </h3>

                <h2 className="text-md tracking-wide">
                  We have:
                  {properties.amenities.map((fac) => (
                    <span className="ml-1" key={fac}>
                      {fac},
                    </span>
                  ))}
                </h2>
                <h2 className="text-md tracking-wide">
                  Bedrooms:{properties.bedrooms}
                </h2>
                <h2 className="text-md tracking-wide">
                  Bathrooms:{properties.bathrooms}
                </h2>
              </div>
              {/* address */}
              <div className="bg-gradient-to-bl from-orange-100 to-green-500 rounded-lg shadow-lg p-3 text-white">
                <h3 className="text-md mb-1 underline underline-offset-4">
                  Address
                </h3>
                <h2 className="text-md tracking-wide">
                  City: {properties.address.city}
                </h2>
                <h2 className="text-md tracking-wide">
                  Street: {properties.address.street}
                </h2>
                <h2 className="text-md tracking-wide">
                  ZipCode: {properties.address.zipCode}
                </h2>
                <h2 className="text-md tracking-wide">
                  State: {properties.address.state}
                </h2>
              </div>

              {/* contact-section */}
              <div className="bg-gradient-to-r from-green-600 via-teal-400 to-emerald-200 rounded-lg shadow-lg p-3 text-white">
                <h3 className="text-md mb-1 underline underline-offset-4">
                  Contact Information
                </h3>
                <h2 className="capitalize text-md tracking-wide">
                  Contact Name: {properties.contactinfo.name}
                </h2>
                <h2 className="text-md tracking-wide">
                  email: {properties.contactinfo.email}
                </h2>
                <h2 className="capitalize text-md tracking-wide">
                  ph no:{properties.contactinfo.phno}
                </h2>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Loader />
      )}
    </section>
  );
};
export default PropertyDetails;
