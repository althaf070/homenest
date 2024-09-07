import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  addAppointment,
  deleteMyProperty,
  fetchPropertyById
} from "../lib/services";
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
import {
  collection,
  getDocs,
  query,
  where
} from "firebase/firestore";
import { db } from "../config/firebase";

const PropertyDetails = () => {
  const { pid } = useParams();
  const [properties, setProperties] = useState(null);
  const [message, setMessage] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toDateString());
  const [success, setSetsuccess] = useState(null);
  const [hasBooked, setHasBooked] = useState(false);
  const { user } = useAuth();

  const navigate = useNavigate();
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
    const formattedDate = formatDate(date); 
    setSelectedDate(formattedDate); 
  };

  const formatDate = (date) => {
    if (!date) return "";

    const options = { month: "short", day: "2-digit", year: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };
  const checkUserBooking = async () => {
    if (user) {
      // Query the 'appointments' collection for any document where 'bookedUserId' matches the current user
      const q = query(
        collection(db, "appointments"),
        where("bookedUserId", "==", user.uid),
        where("bookedpropertyId", "==", pid) 
      );
      
      const querySnapshot = await getDocs(q); 
      if (!querySnapshot.empty) {
        setHasBooked(true); console.log("booked");
        
      } else {
        setHasBooked(false); 
      }
    }
  };

  const handleSubmitAppointment = async () => {
    try {
      await addAppointment(
        user?.uid,
        pid,
        message,
        selectedDate,
        properties.ownerId,
        properties.title
      );
      setSetsuccess(true);
      setOpenModal(false);
      checkUserBooking();
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    checkUserBooking();
  }, [user,pid]);


  useEffect(() => {
    if (success) {
      setTimeout(() => {
        setSetsuccess(false);
      }, 3000);
    }
  }, [success]);
  //*TODO handle waiting time when deleting
  //*TODO add chat functionality
  //*TODO add toast to all successfull operations

  const handleDeleteProperty = async () => {
    await deleteMyProperty(pid);
    navigate("/");
  };
  return (
    <section className="m-5 bg-[#1d6b73] min-h-screen rounded-2xl shadow-xl shadow-gray-800 p-3">
      {properties ? (
        <div>
          <h1 className="md:text-4xl font-semibold capitalize text-[whiteSmoke] m-3">
            {properties.title}
          </h1>
          <div className="grid md:grid-cols-3 md:gap-20 gap-3">
            <div className="col-span-1">
              <div className="md:h-[500px] md:w-[500px] h-[300px] w-[300px]">
              <img
                src={properties.imageURL || tower}
                alt={properties.title}
                className="rounded-lg shadow-xl w-full h-full"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = tower;
                }}
              />
              </div>
              <div className="bg-gradient-to-r from-slate-500 to-teal-700 p-4 text-[whiteSmoke] my-4 rounded-lg text-md relative md:w-[500px] w-[300px]">
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
                  <div className="absolute bottom-10 md:-right-16 ">
                    <Toaster message={"Appointment Sucessfull"} />
                  </div>
                )}
                {properties.ownerId == user.uid && (
                  <div className="flex gap-2 my-2">
                    <Button color={"warning"} href={`/edit-proprty/${pid}`}>
                      Edit Property
                    </Button>
                    <Button color={"failure"} onClick={handleDeleteProperty}>
                      Delete Property
                    </Button>
                  </div>
                )}
                {!hasBooked ? (
                  <Button
                    className="my-4"
                    color="success"
                    onClick={() => setOpenModal(true)}
                  >
                    Book Appointment
                  </Button>
                ) : <Button className="mt-3 w-[200px]" color={"dark"} href="/myappointments">Track Booking Status</Button>}

                {/* TODO -Chat functionality*/}
              </div>
            </div>
            <div className="grid md:col-span-2 grid-rows-3 md:p-10 mt-5 md:m-[-25px] gap-5 w-full">
              {/* amneties */}
              <div className="rounded-lg shadow-lg bg-gradient-to-r from-slate-700 to-slate-500 text-white p-3 overflow-hidden">
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
                    minDate={new Date()}
                    value={selectedDate}
                    onSelectedDateChanged={handleDatePickerChange}
                  />
                  <p>
                    Selected Date:{" "}
                    {selectedDate
                      ? selectedDate.toString()
                      : "No date selected"}
                  </p>
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
