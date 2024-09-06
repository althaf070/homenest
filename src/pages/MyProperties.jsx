import { useEffect } from "react"
import { useState } from "react"
import { deleteMyProperty, fethPropertyByOwnerId } from "../lib/services"
import {useAuth} from '../lib/useAuth'
import PropertiesCard from "../components/PropetiesCard"

const MyProperties = () => {
  const [myProperties, setMyProperties] = useState([])

  const {user} = useAuth()

  useEffect(() => {
  const fethMyproperty = async()=> {
    const data = await fethPropertyByOwnerId(user.uid)
    setMyProperties(data)
    console.log(data);
  }
  fethMyproperty()
  }, [])
  const handleDeleteProperty = async (propertyId) => {
    try {
        await deleteMyProperty(propertyId);
        setMyProperties((prevProperties) => 
            prevProperties.filter((property) => property.id !== propertyId)
        );
    } catch (error) {
        console.error("Failed to delete property:", error);
    }
};
if(myProperties.length==0) return <h1 className="text-center text-2xl font-semibold">No items Added by you</h1>
  return (
    <>
    <h1 className="text-center text-2xl font-semibold">My Properties</h1>
     <div className="grid place-items-center md:grid-cols-5 mb-10 sm:grid-cols-2">
      {myProperties.map((property) => (
        <PropertiesCard
          property={property}
          key={property.id}
          // setGridView={setGridView}
          gridView={true}
          onDelete = {handleDeleteProperty}
        />
      ))}
    </div>
    </>
  )
}

export default MyProperties