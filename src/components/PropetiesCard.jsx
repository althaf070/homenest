/* eslint-disable react/prop-types */
import { useAuth } from "../lib/useAuth";
import { Button, Card, Dropdown,Badge } from "flowbite-react";
import tower from "../assets/tower.png";
import { useEffect, useState } from "react";
import Loader from "./Loader";


const PropertiesCard = ({ property, setGridView, gridView,onDelete }) => {
  const truncatedTitle =
    property.title.length > 20
      ? `${property.title.substring(0, 20)}...`
      : property.title;
  const [isHovered, setIsHovered] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if(gridView){
      setGridView(true);
    }else{
      setGridView(false)
    }
  }, [gridView,setGridView]);

  const handleDeleteClick = () => {
    if (window.confirm("Are you sure you want to delete this property?")) {
      onDelete(property.id);
    }
  };

  if(!property) return <Loader/>
  return (
    <>
      {gridView ? (
        <Card
          className="w-[280px] h-[480px] relative mt-4"
          imgAlt={property.title}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
         <div className="h-[290px] w-full">
         <img src={property.imageURL ? property.imageURL : tower} alt={property.title} className="h-full w-full object-cover" onError={(e) => {
            e.target.onerror = null;
            e.target.src = tower;
          }}/>
         </div>
          <div className="w-full h-[260px] flex flex-col gap-3">
            <h5 className="text-lg font-semibold tracking-tight text-gray-900 dark:text-white capitalize">
              {truncatedTitle}
            </h5>
            <p>Proprty Type:{property.type}</p>
            <h6>Rs:{property.price}</h6>
            <p>{property.size} Sqft.</p>
            <Button className="mb-2" href={`/propertinfo/${property.id}`}>View More</Button>
            {user?.uid == property.ownerId && isHovered && (
              <div  className="absolute top-0 right-0 ">
                <Dropdown
                  label="More Options"
                  inline
                >
                  <Dropdown.Item href={`/edit-proprty/${property.id}`}>
                  Edit
                  </Dropdown.Item>
                  <Dropdown.Item  onClick={handleDeleteClick} className="text-red-500">
                    {/* add an modeal asking do you want to delte */}
                      Delete
                  </Dropdown.Item>
                </Dropdown>
              </div>
            )}
          </div>
        </Card>
      ) : (
        <Card
          className="w-full cursor-pointer max-h-96 hover:scale-105 duration-500"
          imgSrc={tower}
          horizontal
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = tower;
          }}
          href={`/propertinfo/${property.id}`}
        >
          <h5 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white capitalize">
            {property.title}
          </h5>
          <p className="text-gray-700 dark:text-gray-300">
            About Property:{property.description}
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            Type:{property.type}
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            Location:{property.address.city},{property.address.state}
          </p>
          {property.available ? (
                  <Badge color="failure" className="w-40">
                    Property Currently Not Available
                  </Badge>
                ) : (
                  <Badge color="success" className="w-40">
                    Property Available
                  </Badge>
                )}
        </Card>
      )}
    </>
  );
};

export default PropertiesCard;