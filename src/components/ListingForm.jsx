/* eslint-disable react/prop-types */
import { Label, TextInput, Select, Checkbox, Button, FileInput } from "flowbite-react";
import {
  MdTitle,
  MdDescription,
  MdStreetview,
  MdOutlinePriceCheck,
  MdContacts
} from "react-icons/md";
import {
  FaCity,
  FaChartArea,
  FaBed,
  FaBath,
  FaPhoneAlt,
  FaLocationArrow
} from "react-icons/fa";
import { FaSignsPost } from "react-icons/fa6";
import { amenitiesOptions, propertyTypes } from "../utils/constants";
import { useEffect, useState } from "react";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { db, storage } from "../config/firebase";
import { useAuth } from "../lib/useAuth";
import { useNavigate } from "react-router-dom";
import { ref,uploadBytes,getDownloadURL } from "firebase/storage";

const ListingForm = ({ existingData, isEditMode }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "apartment",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    price: "",
    size: "",
    bedrooms: 1,
    bathrooms: 1,
    amenities: [],
    contactName: "",
    contactEmail: "",
    contactPhone: ""
  });
const [fileUpload, setFileUpload] = useState(null)

  const propetiesref = collection(db, "properties");
  useEffect(() => {
    if (isEditMode && existingData) {
      setFormData({
        ...formData,
        title: existingData.title || "",
        description: existingData.description || "",
        type: existingData.type || "apartment",
        street: existingData.address?.street || "",
        city: existingData.address?.city || "",
        state: existingData.address?.state || "",
        zipCode: existingData.address?.zipCode || "",
        price: existingData.price || "",
        size: existingData.size || "",
        bedrooms: existingData.bedrooms || 1,
        bathrooms: existingData.bathrooms || 1,
        amenities: existingData.amenities || [],
        contactName: existingData.contactinfo?.name || "",
        contactEmail: existingData.contactinfo?.email || "",
        contactPhone: existingData.contactinfo?.phno || ""
      });
    }
  }, []);
  

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      if (checked) {
        setFormData({
          ...formData,
          amenities: [...formData.amenities, value]
        });
      } else {
        setFormData({
          ...formData,
          amenities: formData.amenities.filter((amenity) => amenity !== value)
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const imageUrl = await uploadFile()
    try {
      if (isEditMode) {
        // Update existing property
        const propertyDoc = doc(db, "properties", existingData.id);
        await updateDoc(propertyDoc, {
          ...formData,
          title: formData.title ,
          description: formData.description,
          type: formData.type,
          address: {
            street: formData.street,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode
          },
          price: formData.price,
          size: formData.size,
          bedrooms: formData.bedrooms,
          bathrooms: formData.bathrooms,
          amenities: formData.amenities,
          isAvailable: true,
          ownerId: user.uid,
          contactinfo: {
            email: user.email,
            name: formData.contactName,
            phno: formData.contactPhone

          }
        });
     
        
      } else {
        await addDoc(propetiesref, {
          title: formData.title,
          description: formData.description,
          type: formData.type,
          address: {
            street: formData.street,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode
          },
          price: formData.price,
          size: formData.size,
          bedrooms: formData.bedrooms,
          bathrooms: formData.bathrooms,
          amenities: formData.amenities,
          isAvailable: true,
          ownerId: user.uid,
          imageURL: imageUrl,
          contactinfo: {
            email: user.email,
            name: formData.contactName,
            phno: formData.contactPhone
          }
        });
        uploadFile()
      }
      navigate("/");
    } catch (error) {
      console.log(error.message);
    }
  };
const uploadFile =async () => {
  if(!fileUpload) return
try {
  const propertyImgRef  = ref(storage,`propertyImg/property-${fileUpload.name}`)
  const snapshot = await uploadBytes(propertyImgRef,fileUpload)
  const downloadUrl = await getDownloadURL(snapshot.ref)
 return downloadUrl
} catch (error) {
  console.log(error.message);
  
}
}
  return (
    <div className="bg-[#135D66] mx-auto w-full">
      <div className="p-4 md:p-14 w-full flex justify-center">
        <form
          onSubmit={handleSubmit}
          className="md:grid md:grid-cols-2 gap-3 place-items-center"
        >
          <div className="max-w-md">
            <div className="mb-2 block">
              <Label
                htmlFor="title"
                value="Your Property Name"
                className="text-gray-200"
              />
            </div>
            <TextInput
              id="title"
              name="title"
              type="text"
              icon={MdTitle}
              placeholder="eg: Residential Land, Ernakulam"
              required
              className="p-1 md:w-[24rem]"
              value={formData.title}
              onChange={handleChange}
            />
          </div>

          <div className="max-w-md">
            <div className="mb-2 block">
              <Label
                htmlFor="description"
                value="Description"
                className="text-gray-200"
              />
            </div>
            <TextInput
              id="description"
              name="description"
              type="text"
              icon={MdDescription}
              placeholder="Tell Us breifly about Your Property"
              required
              className="p-1 md:w-[24rem]"
              value={formData.description}
              onChange={handleChange}
              sizing="lg"
            />
          </div>

          <div className="max-w-md">
            <div className="mb-2 block">
              <Label
                htmlFor="type"
                value="Select your Property type"
                className="text-gray-200"
              />
            </div>
            <Select
              id="type"
              name="type"
              required
              value={formData.type}
              onChange={handleChange}
            >
              {propertyTypes.map((type, i) => (
                <option key={i} value={type}>
                  {type}
                </option>
              ))}
            </Select>
          </div>

        
          <div className="max-w-md">
            <div className="mb-2 block">
              <Label
                htmlFor="street"
                value="Street Name"
                className="text-gray-200"
              />
            </div>
            <TextInput
              id="street"
              name="street"
              type="text"
              icon={MdStreetview}
              placeholder="eg: Town road"
              required
              className="p-1 md:w-[24rem]"
              value={formData.street}
              onChange={handleChange}
            />
          </div>

          <div className="max-w-md">
            <div className="mb-2 block">
              <Label htmlFor="city" value="City" className="text-gray-200" />
            </div>
            <TextInput
              id="city"
              name="city"
              type="text"
              icon={FaCity}
              placeholder="eg: Kochi"
              required
              className="p-1 md:w-[24rem]"
              value={formData.city}
              onChange={handleChange}
            />
          </div>

          <div className="max-w-md">
            <div className="mb-2 block">
              <Label
                htmlFor="zipCode"
                value="Zip Code"
                className="text-gray-200"
              />
            </div>
            <TextInput
              id="zipCode"
              name="zipCode"
              type="text"
              icon={FaSignsPost}
              placeholder="eg: 683542"
              required
              className="p-1 md:w-[24rem]"
              value={formData.zipCode}
              onChange={handleChange}
            />
          </div>

          <div className="max-w-md">
            <div className="mb-2 block">
              <Label htmlFor="state" value="State" className="text-gray-200" />
            </div>
            <TextInput
              id="state"
              name="state"
              type="text"
              icon={FaLocationArrow}
              placeholder="eg: Kerala"
              required
              className="p-1 md:w-[24rem]"
              value={formData.state}
              onChange={handleChange}
            />
          </div>

          <div className="max-w-md">
            <div className="mb-2 block">
              <Label htmlFor="price" value="Price" className="text-gray-200" />
            </div>
            <TextInput
              id="price"
              name="price"
              type="text"
              icon={MdOutlinePriceCheck}
              placeholder="eg: 120000"
              required
              className="p-1 md:w-[24rem]"
              value={formData.price}
              onChange={handleChange}
            />
          </div>

          <div className="max-w-md">
            <div className="mb-2 block">
              <Label
                htmlFor="size"
                value={
                  formData.type == "Land" ? "Size in Scent" : "Size in Sqft."
                }
                className="text-gray-200"
              />
            </div>
            <TextInput
              id="size"
              name="size"
              type="text"
              icon={FaChartArea}
              placeholder="eg: 1200"
              required
              className="p-1 md:w-[24rem]"
              value={formData.size}
              onChange={handleChange}
            />
          </div>

          <div className="max-w-md">
            <div className="mb-2 block">
              <Label
                htmlFor="contactPhone"
                value="Contact Number"
                className="text-gray-200"
              />
            </div>
            <TextInput
              id="contactPhone"
              name="contactPhone"
              type="text"
              icon={FaPhoneAlt}
              placeholder="eg: 9000111123"
              required
              className="p-1 md:w-[24rem]"
              value={formData.contactPhone}
              onChange={handleChange}
            />
          </div>

          <div className="max-w-md">
            <div className="mb-2 block">
              <Label
                htmlFor="contactName"
                value="Contact Name"
                className="text-gray-200"
              />
            </div>
            <TextInput
              id="contactName"
              name="contactName"
              type="text"
              icon={MdContacts}
              placeholder="eg: John"
              required
              className="p-1 md:w-[24rem]"
              value={formData.contactName}
              onChange={handleChange}
            />
          </div>

          {/* Amenities */}
          {formData.type !== "Land" ? (
            <>
              <div className="max-w-md">
                <div className="mb-2 block">
                  <Label
                    htmlFor="bedrooms"
                    value="Bedrooms"
                    className="text-gray-200"
                  />
                </div>
                <TextInput
                  id="bedrooms"
                  name="bedrooms"
                  type="number"
                  icon={FaBed}
                  placeholder="eg: 3"
                  required
                  className="p-1 md:w-[24rem]"
                  value={formData.bedrooms}
                  onChange={handleChange}
                />
              </div>

              <div className="max-w-md">
                <div className="mb-2 block">
                  <Label
                    htmlFor="bathrooms"
                    value="Bathrooms"
                    className="text-gray-200"
                  />
                </div>
                <TextInput
                  id="bathrooms"
                  name="bathrooms"
                  type="number"
                  icon={FaBath}
                  placeholder="eg: 2"
                  required
                  className="p-1 md:w-[24rem]"
                  value={formData.bathrooms}
                  onChange={handleChange}
                />
              </div>
              <div className="max-w-md bg-[#2D3250] p-5 mt-5 rounded-xl drop-shadow-lg">
                <div className="mb-2 block">
                  <Label
                    value="Tick all facilities you have"
                    className="text-gray-100"
                  />
                  <div className="flex max-w-lg gap-4 flex-wrap" id="checkbox">
                    {amenitiesOptions.map((amenity) => (
                      <div key={amenity}>
                        <Checkbox
                          id={amenity}
                          name="amenities"
                          value={amenity}
                          onChange={handleChange}
                          checked={formData.amenities.includes(amenity)}
                        />
                        <Label htmlFor={amenity} className="text-white p-1">
                          {amenity}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          ) : null}

<div className="w-full flex flex-col">
<Label value="Upload Your Property thumbanail" className="text-lg text-gray-300"/>
<div className="flex w-full items-center justify-center">
      <Label
        htmlFor="dropzone-file"
        className="flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
        onChange={(e) => setFileUpload(e.target.files[0])}
      >
        <div className="flex flex-col items-center justify-center pb-4 pt-3">
          <svg
            className="mb-4 h-8 w-8 text-gray-500 dark:text-gray-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 16"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
            />
          </svg>
          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
            <span className="font-semibold">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
        </div>
        <FileInput id="dropzone-file"  />
      </Label>
    </div>
</div>

          <div className="max-w-md mt-5">
            <div className="flex items-center gap-2">
              <Checkbox id="accept" defaultChecked />
              <Label htmlFor="accept" className="text-gray-200">
                I agree with the&nbsp;
                <a
                  href="#"
                  className="text-cyan-600 hover:underline dark:text-cyan-500"
                >
                  terms and conditions
                </a>
              </Label>
              <Button type="submit" color={"success"}>
                Submit Property
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ListingForm;
