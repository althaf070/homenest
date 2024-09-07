import { collection, deleteDoc, doc, getDoc, getDocs,addDoc,query, where } from "firebase/firestore"
import { db } from "../config/firebase"

// fetching all properties

const propertiesRef = collection(db, "properties");
const appointmentref = collection(db, "appointments");

export const fetchAllProperties = async () => {
    try {
      const data = await getDocs(propertiesRef);
      const filterData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
    return filterData
    } catch (error) {
      console.log(error.message);
    }
  };

// deleting a users propert document
export const deleteMyProperty = async (id) => {
const propertyDoc = doc(db,"properties",id)
try {
 await deleteDoc(propertyDoc)
 
console.log("properties deleted");
} catch (error) {
    console.log(error.message);
    
}

}

export const fetchPropertyById = async (id)=> {
try {
  const propertDocRef =doc(db, "properties",id) 
  const docSnap = await getDoc(propertDocRef)

  if(docSnap.exists()){
    const properties = docSnap.data()
    return properties
  
  }else {
    alert("No properties found")
  }
} catch (error) {
  console.log(error.message);
}
}

export const fethPropertyByOwnerId = async(userid)=> {
  try {

    const q = query(propertiesRef,where('ownerId', '==',userid))
    const querySnapshot = await getDocs(q);
    const fetchedProperties = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    return fetchedProperties
  } catch (error) {
    console.log(error);
  }
}

// Booking

export const addAppointment = async (userid,propertyid,message,date,propertyOwnerId,propertyName) => {

  const currentDate = new Date();
  // const formattedTime = currentDate.toLocaleTimeString();

  try {
    const appointmentRef =await addDoc(appointmentref,{
      bookedUserId: userid, 
      bookedpropertyId: propertyid, 
      date:date,
      time: currentDate,
      message: message,
      status: "pending",
      propertyOwnerId:propertyOwnerId,
      propertyName:propertyName,
    })
    console.log('Appointment added with ID:', appointmentRef.id);
  } catch (error) {
    console.error('Error adding appointment:', error);
  }
};

export const bookedAppointments = async(userid)=> {
try {
  const q = query(appointmentref,where('bookedUserId', '==',userid))
  const querySnapshot = await getDocs(q);
  const fetchAppointments = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
  return fetchAppointments
} catch (error) {
  console.log(error);
  
}
}

export const deleteBookedAppointment = async(id) => {
  const appointmentyDoc = doc(db,"appointments",id)
  try {
    await deleteDoc(appointmentyDoc)
   console.log("Appointment deleted");
   } catch (error) {
       console.log(error.message);
   }
}

export const appointmentPropertyOwner= async(ownerId) => {
try {
  const q = query(appointmentref,where('propertyOwnerId','==',ownerId))
  const querySnapshot = await getDocs(q);
  const fetchAppointments = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
  return fetchAppointments
} catch (error) {
  console.log(error);
}
}

export const fetchPropertyCategory = async(category)=> {
  try {
   const q =query(propertiesRef,where("type",'==',category))
   const querySnapshot = await getDocs(q);
   const fetchProperty = querySnapshot.docs.map(doc => ({
     id: doc.id,
     ...doc.data(),
   }));
   return fetchProperty
  } catch (error) {
    console.log(error);
    
  }
}