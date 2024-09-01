// PropetiesList.js
import { useEffect, useState } from "react";
import PropertiesCard from "./PropetiesCard";
import { deleteMyProperty, fetchAllProperties } from "../lib/services";

const PropertiesList = () => {
  const [properties, setProperties] = useState([]);
  const [gridView, setGridView] = useState(false);

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
    <div className={gridView ? "grid place-items-center md:grid-cols-5 mb-10 sm:grid-cols-2" : ""}>
      {properties.map((property) => (
        <PropertiesCard
          property={property}
          key={property.id}
          setGridView={setGridView}
          gridView={gridView}
          onDelete = {handleDeleteProperty}
        />
      ))}
    </div>
  );
};

export default PropertiesList;
