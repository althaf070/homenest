import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { addAppointment, deleteMyProperty, fetchPropertyById } from "../lib/services";
import Loader from "../components/Loader";
import tower from "../assets/tower.png";
import {
  Badge,
  Button,
  Modal,
  Label,
  Datepicker,
  Textarea
} from "flowbite-react";
import { useAuth } from "../lib/useAuth";
import Toaster from "../components/Toaster";

const PropertyDetails = () => {
  const { pid } = useParams();
  const [properties, setProperties] = useState(null);
  const [message, setMessage] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [success, setSetsuccess] = useState(null);
  const { user } = useAuth();
const navigate = useNavigate()
  const msgInputRef = useRef(null);

  const fetchItem = async () => {
    const properties = await fetchPropertyById(pid);
    const msg = `Hey i would like to see your ${properties?.title} on following  date`;
    setMessage(msg);
    setProperties(properties);
  };
  useEffect(() => {
    fetchItem();
  }, []);

  const handleDatePickerChange = (date) => {
    setSelectedDate(date);
    console.log(date);
  };

  const handleSubmitAppointment = async () => {
    try {
      await addAppointment(
        user?.uid,
        pid,
        message,
        selectedDate,
        properties.ownerId
      );
      setSetsuccess(true);
      setOpenModal(false);
    } catch (error) {
      console.log(error);
    }
  };
  //*TODO handle waiting time when deleting
  //*TODO add chat functionality
  //*TODO add toast to all successfull operations

  const handleDeleteProperty = async () => {
    await deleteMyProperty(pid)
    navigate("/")
  }
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
                src={properties.imageURL || tower}
                alt={properties.title}
                className="rounded-lg shadow-xl"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = tower;
                }}
              />
              <div className="bg-gradient-to-r from-slate-500 to-teal-700 p-4 text-[whiteSmoke] my-4 rounded-lg text-md relative">
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
                {success && (
                  <div className="absolute bottom-10 -right-16 ">
                    <Toaster message={"Appointment Sucessfull"} />
                  </div>
                )}
                {properties.ownerId == user.uid ?(
                 <div className="flex gap-2 my-2">
                 <Button color={"warning"} href={`/edit-proprty/${pid}`}>Edit Property</Button>
                 <Button color={"failure"} onClick={handleDeleteProperty}>Delete Property</Button>
                 </div>
                ):(
                  <Button
                  className="my-4"
                  color="success"
                  onClick={() => setOpenModal(true)}
                >
                  Book AppointMent
                </Button>
                )}

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

          <Modal
            show={openModal}
            size="md"
            popup
            onClose={() => setOpenModal(false)}
            initialFocus={msgInputRef}
          >
            <Modal.Header />
            <Modal.Body>
              <div className="space-y-6">
                <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                  Book Appointmnet to see property
                </h3>
                <div>
                  <div className="mb-2 block">
                    <Label value="Your Message" />
                  </div>
                  <Textarea
                    id="comment"
                    placeholder="Leave a comment..."
                    required
                    rows={4}
                    ref={msgInputRef}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>
                <div>
                  <div className="mb-2 block">
                    <Label value="Pick Your Date" />
                  </div>
                  <Datepicker
                  onSelectedDateChanged={handleDatePickerChange}
                  />
                </div>
                <div className="w-full">
                  <Button onClick={handleSubmitAppointment}>Submit</Button>
                </div>
              </div>
            </Modal.Body>
          </Modal>
        </div>
      ) : (
        <Loader />
      )}
    </section>
  );
};
export default PropertyDetails;
