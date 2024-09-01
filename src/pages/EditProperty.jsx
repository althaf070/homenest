import { useParams } from "react-router-dom";
import ListingForm from "../components/ListingForm"
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import Loader from "../components/Loader";

const EditProperty = () => {
    const { pid } = useParams(); 
    const [existingData, setExistingData] = useState(null);
  
    useEffect(() => {
      const fetchProperty = async () => {
        if (!pid) return <h1 className="text-2xl">No Such Items Found</h1>
  
        const docRef = doc(db, "properties", pid); 
        const docSnap = await getDoc(docRef);
  
        if (docSnap.exists()) {
          setExistingData({ id: docSnap.id, ...docSnap.data() }); // Set the state with existing property data
        } else {
          console.log("No such document!"); 
        }
      };
  
      fetchProperty();
    }, [pid]); // Dependency array includes propertyId
  
    if (!existingData) return <Loader/>; 
    return <ListingForm existingData={existingData} isEditMode={true} />; // Pass data and mode to ListingForm
}

export default EditProperty