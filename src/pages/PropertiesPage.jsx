import { useState,useEffect } from "react";
import PropertiesCard from "../components/PropetiesCard"
import { deleteMyProperty, fetchAllProperties } from "../lib/services";

const PropertiesPage = () => {
    const [properties, setProperties] = useState([]);
   
    useEffect(() => {
        const fetchData = async () => {
          try {
            const propertiesData = await fetchAllProperties();
            setProperties(propertiesData);
          } catch (error) {
            console.log(error.message);
          }
        }
        fetchData()
      }, []);
        const handleDeleteProperty = async (propertyId) => {
    try {
        await deleteMyProperty(propertyId);
        setProperties((prevProperties) => 
            prevProperties.filter((property) => property.id !== propertyId)
        );
    } catch (error) {
        console.error("Failed to delete property:", error);
    }
};
  return (
    <div className= "grid gap-3 place-items-center w-full mb-5" id="property">
    {properties.map((property) => (
      <PropertiesCard
        property={property}
        key={property.id}
        gridView={false}
        onDelete = {handleDeleteProperty}
      />
    ))}
  </div>
  )
}

export default PropertiesPage