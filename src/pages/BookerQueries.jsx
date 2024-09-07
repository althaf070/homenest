/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useAuth } from "../lib/useAuth";
import { appointmentPropertyOwner } from "../lib/services";
import { Table, Select, Toast} from "flowbite-react";
import DateTimePickerModal from "../components/DateTimePicker";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { HiCheck, HiExclamation, HiX } from "react-icons/hi";

const BookerQueries = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false)

  const updateDocument = async (id, appointmentData) => {
    const docRef = doc(db, "appointments", id);
    try {
      // Update the document with selected fields
      await updateDoc(docRef, appointmentData);
      console.log("Document updated successfully");
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  useEffect(() => {
    const fetchAppointments = async () => {
      if (user) {
        try {
          const data = await appointmentPropertyOwner(user.uid);
          const updatedAppointments = data.map((item) => ({
            ...item,
            status: "pending", // default status for each item
          }));
          setAppointments(updatedAppointments);
        } catch (error) {
          console.error("Error fetching appointments: ", error);
        }
      }
    };
    fetchAppointments();
  }, [user]);

useEffect(() => {
setTimeout(() => {
  setIsSubmitted(false)
}, 2000);
}, [isSubmitted])

  const updateStatusInDocument = async (id, newStatus) => {
    const docRef = doc(db, "appointments", id);
    try {
      // Update only the status field in Firestore
      await updateDoc(docRef, {
        status: newStatus,
      });
      console.log(`Document status updated to: ${newStatus}`);
    } catch (error) {
      console.error("Error updating document status: ", error);
    }
  };
  const handleStatusChange = (id, newStatus) => {
    setAppointments((prevAppointments) =>
      prevAppointments.map((appoint) =>
        appoint.id === id ? { ...appoint, status: newStatus } : appoint
      )
    );
    updateStatusInDocument(id, newStatus);
    setIsSubmitted(true)
  };

  const handleSubmit = (id, selectedDate, startTime, endTime) => {
    // Update document with new date, time, and status
    const appointmentData = {
      appointmentDate: selectedDate,
      startTime,
      endTime,
      status: "scheduled", 
    };
    updateDocument(id, appointmentData);
    console.log(`Submitting changes for appointment ID: ${id}`);
  };

  return (
    <div>
      <h1 className="text-2xl text-center font-semibold">Your Queries</h1>
      {isSubmitted  &&
      <div className="flex justify-center items-end">
        <Toast>
        <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
          <HiCheck className="h-5 w-5" />
        </div>
        <div className="ml-3 text-sm font-normal">Status Updated</div>
        <Toast.Toggle />
      </Toast>
      </div>
      }
      {appointments.length === 0 ? (
        <h1 className="text-2xl font-semibold text-center mt-20">
          You have no queries.
        </h1>
      ) : (
        <div className="overflow-x-auto min-h-screen">
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>Property Name</Table.HeadCell>
              <Table.HeadCell>Booked Date</Table.HeadCell>
              <Table.HeadCell>Status</Table.HeadCell>
              
            </Table.Head>
            <Table.Body className="divide-y">
              {appointments.map((item) => (
                <Table.Row
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                  key={item.id}
                >
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {item.propertyName}
                  </Table.Cell>
                  <Table.Cell>{item.date}</Table.Cell>
                  <Table.Cell>
                    <div className="max-w-md">
                      <Select
                        id="status"
                        required
                        onChange={(e) =>
                          handleStatusChange(item.id, e.target.value)
                        }
                        // value={item.status}
                        defaultValue={item.status}
                      >
                        <option value="pending">Pending</option>
                        <option value="scheduled">Scheduled</option>
                        <option value="visited">Visited</option>
                        <option value="cancel">Cancel</option>
                      </Select>
                    </div>
                  </Table.Cell>

                  <Table.Cell>
                    {item.status === "scheduled" && (
                      <DateTimePickerModal
                        onSubmit={(selectedDate, startTime, endTime) =>
                          handleSubmit(item.id, selectedDate, startTime, endTime)
                        }
                        setIsSubmitted={setIsSubmitted}
                      />
                    )}
                  </Table.Cell>

              
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      )}
     
    </div>
  );
};

export default BookerQueries;
