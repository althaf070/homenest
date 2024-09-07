/* eslint-disable react/prop-types */
// PropetiesList.js
import { useEffect, useState } from "react";
import PropertiesCard from "./PropetiesCard";
import { deleteMyProperty, fetchAllProperties, fetchPropertyCategory } from "../lib/services";

const PropertiesList = ({query}) => {
  const [properties, setProperties] = useState([]);

  const fetchData = async () => {
    try {
      const propertiesData = await fetchAllProperties();
      setProperties(propertiesData);
    } catch (error) {
      console.log(error.message);
    }
  }
  
  const propertyByCategory = async (qw) => {
    try {
      const propertiesData = await fetchPropertyCategory(qw);
      setProperties(propertiesData);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    if (query === 'All') {
      fetchData();
    } else {
      propertyByCategory(query);
    }
  }, [query]); 

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
    <div className="grid place-items-center md:grid-cols-5 mb-10 sm:grid-cols-2">
      {properties.map((property) => (
        <PropertiesCard
          property={property}
          key={property.id}
          // setGridView={setGridView}
          gridView={true}
          onDelete = {handleDeleteProperty}
        />
      ))}
    </div>
  );
};

export default PropertiesList;
