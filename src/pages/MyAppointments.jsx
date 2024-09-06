import { useEffect, useState } from "react";
import { useAuth } from "../lib/useAuth";
import { bookedAppointments, deleteBookedAppointment } from "../lib/services";
import { Table,Button,Badge } from "flowbite-react";
// Retrieve the appointments I booked
// *TODO fix date issue
const MyAppointments = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      if (user) {
        try {
          const data = await bookedAppointments(user.uid);
          console.log(data);
          setAppointments(data);
        } catch (error) {
          console.error("Error fetching appointments: ", error);
        }
      }
    };
    fetchAppointments();
  }, [user]);

  const deleteAppointment = async(id) => {
    try {
      await deleteBookedAppointment(id)
      setAppointments((prevAppointment) => prevAppointment.filter(appoint => appoint.id !== id))
    } catch (error) {
      console.log(error);
      
    }
  }
  return (
    <section>
      <h1 className="text-center font-semibold text-xl">Booked Appointments</h1>
      {appointments.length === 0 ? (
        <h1 className="text-2xl font-semibold text-center mt-20">No appointments found.</h1>
      ) : (
        <div className="overflow-x-auto">
        <Table hoverable>
          <Table.Head>
            <Table.HeadCell>Property Name</Table.HeadCell>
            <Table.HeadCell>Booked Date</Table.HeadCell>
            <Table.HeadCell>Booking Status</Table.HeadCell>
            <Table.HeadCell>Appointment Date</Table.HeadCell>
            <Table.HeadCell>Cancel Appointment</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {appointments.map((item,i) => (
              <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800" key={i}>
              <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                {item.propertyName}
              </Table.Cell>
              <Table.Cell>{item.date}</Table.Cell>
              <Table.Cell className="capitalize">{item.status == "pending" ? <Badge color="warning">{item.status}</Badge> :item.status == "success" ? <Badge color="success">{item.status}</Badge> : <Badge color="success">{item.status}</Badge>}</Table.Cell>
              <Table.Cell>{item.apdate? item.apdate :"No Appointment Scheduled"}</Table.Cell>
              <Table.Cell>
                <Button color={"failure"} onClick={()=> deleteAppointment(item.id)}>Cancel</Button>
              </Table.Cell>
            </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
      )}
     
    </section>
  );
};

export default MyAppointments;
