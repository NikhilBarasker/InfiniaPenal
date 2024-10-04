import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "myCloud");
  formData.append("cloud_name", "dnevtbn0x");

  try {
    const response = await axios.post(
      "https://api.cloudinary.com/v1_1/dnevtbn0x/image/upload",
      formData
    );
    return response.data.secure_url;
  } catch (error) {
    console.error("Error uploading to Cloudinary: ", error);
    return null;
  }
};

const Skyace = () => {
  const [formState, setFormState] = useState({
    title: "",
    background: "",
    heading: "",
    paragraph: "",
    points: "",
    images: [],
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/skyace/getskyace"
        );
        const data = response.data;
        console.log('Skyace Data', data);
        setFormState({
          title: data.title || "",
          background: data.backgroundImage || "",
          heading: data.heading || "",
          paragraph: data.paragraph || "",
          points: data.points || "",
          images: data.images || [],
        });
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, []);

  // Handle file changes and upload to Cloudinary
  const handleFileChange = async (e, field) => {
    const file = e.target.files[0];
    if (file) {
      const url = await uploadToCloudinary(file);
      if (url) {
        setFormState((prevState) => {
          if (field === "images") {
            return { ...prevState, images: [...prevState.images, url] };
          }
          return { ...prevState, [field]: url };
        });
      }
    }
  };

  // Handle form submission (update data)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.patch(
        "http://localhost:8080/skyace/updateskyace",
        formState
      );
      console.log(response.data.msg);
    } catch (error) {
      console.error("Error submitting form: ", error);
    }
  };

  const navigateBack = () => {
    navigate(-1);
  };

  return (
    <div>
      <button
        onClick={navigateBack}
        className="h-[40px] mt-[10px] mb-[10px] cursor-pointer transition-all bg-blue-500 text-white px-6 py-2 rounded-lg
      border-blue-600 border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px]
      active:border-b-[2px] active:brightness-90 active:translate-y-[2px]"
      >
        Back
      </button>
      <div className="max-w-4xl p-6 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Skyace</h1>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">Title</label>
          <input
            type="text"
            value={formState.title}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) =>
              setFormState({ ...formState, title: e.target.value })
            }
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">
            Background Image
          </label>
          <input
            type="file"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => handleFileChange(e, "background")}
          />
          {formState.background && (
            <img src={formState.background} alt="background" className="mt-2" />
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">
            Heading
          </label>
          <input
            type="text"
            value={formState.heading}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) =>
              setFormState({ ...formState, heading: e.target.value })
            }
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">
            Paragraph
          </label>
          <textarea
            value={formState.paragraph}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) =>
              setFormState({ ...formState, paragraph: e.target.value })
            }
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">Points</label>
          <input
            type="text"
            value={formState.points}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) =>
              setFormState({ ...formState, points: e.target.value })
            }
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">Images</label>
          <input
            type="file"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => handleFileChange(e, "images")}
          />
          {formState.images.length > 0 && (
            <div className="mt-2">
              {formState.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Image ${index}`}
                  className="mr-2"
                />
              ))}
            </div>
          )}
        </div>

        <button
          onClick={handleSubmit}
          className="w-full p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default Skyace;
