import { collection, deleteDoc, doc, getDoc, getDocs } from "firebase/firestore"
import { db } from "../config/firebase"
// fetching all properties

const propertiesRef = collection(db, "properties");


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