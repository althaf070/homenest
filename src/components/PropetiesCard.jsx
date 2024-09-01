/* eslint-disable react/prop-types */
import { useAuth } from "../lib/useAuth";
import { Button, Card, Dropdown } from "flowbite-react";
import tower from "../assets/tower.png";
import { useEffect, useState } from "react";


const PropertiesCard = ({ property, setGridView, gridView,onDelete }) => {
  const truncatedTitle =
    property.title.length > 20
      ? `${property.title.substring(0, 20)}...`
      : property.title;
  const [isHovered, setIsHovered] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    setGridView(true);
  }, [setGridView]);

  const handleDeleteClick = () => {
    if (window.confirm("Are you sure you want to delete this property?")) {
      onDelete(property.id);
    }
  };

  if(!property) return <h1 className="text-4xl p-2 font-semibold">No Property Found</h1>
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
          className="max-w-sm"
          imgSrc={tower}
          horizontal
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = tower;
          }}
        >
          <h5 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
            {property.title.toUpperCase()}
          </h5>
          <p className="font-normal text-gray-700 dark:text-gray-400">
            {property.description}
          </p>
        </Card>
      )}
    </>
  );
};

export default PropertiesCard;
