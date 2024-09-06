import { useEffect, useState } from "react";
import { useAuth } from "../lib/useAuth";
import {
  appointmentPropertyOwner,
  deleteBookedAppointment
} from "../lib/services";
import { Table, Button, Select,  } from "flowbite-react";

import DateTimePickerModal from "../components/DateTimePicker";

const BookerQueries = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      if (user) {
        try {
          const data = await appointmentPropertyOwner(user.uid);
          // Assuming your data doesn't have a `status` field initially
          const updatedAppointments = data.map((item) => ({
            ...item,
            status: "pending" // default status for each item
          }));
          setAppointments(updatedAppointments);
        } catch (error) {
          console.error("Error fetching appointments: ", error);
        }
      }
    };
    fetchAppointments();
  }, [user]);

  const deleteAppointment = async (id) => {
    try {
      await deleteBookedAppointment(id);
      setAppointments((prevAppointment) =>
        prevAppointment.filter((appoint) => appoint.id !== id)
      );
    } catch (error) {
      console.log(error);
    }
  };



  const handleStatusChange = (id, newStatus) => {
    setAppointments((prevAppointments) =>
      prevAppointments.map((appoint) =>
        appoint.id === id ? { ...appoint, status: newStatus } : appoint
      )
    );
  };

  return (
    <div>
      <h1 className="text-2xl text-center font-semibold">Your Queries</h1>
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
              <Table.HeadCell>Change Status</Table.HeadCell>
              <Table.HeadCell>
                {appointments.some(
                  (appointment) => appointment.status === "scheduled"
                )
                  ? "Fix date"
                  : "Cancel Appointment"}
              </Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {appointments.map((item, i) => (
                <Table.Row
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                  key={i}
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
                        value={item.status} // now status is unique to each item
                      >
                        <option value="pending">Pending</option>
                        <option value="scheduled">Schedule</option>
                        <option value="visited">Visited</option>
                      </Select>
                    </div>
                  </Table.Cell>

                  <Table.Cell>
                    {item.status === "scheduled" ? (
                      <>
                      <DateTimePickerModal/>
                      </>
                    ) : item.status == "visited" ? (
                        "done"
                    ):(
                        <Button
                          color={"failure"}
                          onClick={() => deleteAppointment(item.id)}
                        >
                          Cancel
                        </Button>
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
