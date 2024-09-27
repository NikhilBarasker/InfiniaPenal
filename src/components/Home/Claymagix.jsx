import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

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

const Claymagix = () => {
  const baseUrl = "http://localhost:8080/claymagix";
  const navigate = useNavigate();
  const [formState, setFormState] = useState({
    title: "",
    title2: "",
    background: "",
    paragraphs: [""],
    sections: [
      {
        heading: "",
        points: [""],
      },
    ],
    images: [""],
  });
  const [editingId, setEditingId] = useState(null);

  const handleAddSection = () => {
    setFormState((prevState) => ({
      ...prevState,
      sections: [...prevState.sections, { heading: "", points: [""] }],
    }));
  };

  const handleRemoveSection = (index) => {
    setFormState((prevState) => {
      const newSections = [...prevState.sections];
      newSections.splice(index, 1);
      return { ...prevState, sections: newSections };
    });
  };

  const handleHeadingChange = (index, value) => {
    setFormState((prevState) => {
      const newSections = [...prevState.sections];
      newSections[index].heading = value;
      return { ...prevState, sections: newSections };
    });
  };

  const handlePointChange = (sectionIndex, pointIndex, value) => {
    setFormState((prevState) => {
      const newSections = [...prevState.sections];
      newSections[sectionIndex].points[pointIndex] = value;
      return { ...prevState, sections: newSections };
    });
  };

  const handleAddPoint = (sectionIndex) => {
    setFormState((prevState) => {
      const newSections = [...prevState.sections];
      newSections[sectionIndex].points.push("");
      return { ...prevState, sections: newSections };
    });
  };

  const handleRemovePoint = (sectionIndex, pointIndex) => {
    setFormState((prevState) => {
      const newSections = [...prevState.sections];
      newSections[sectionIndex].points.splice(pointIndex, 1);
      return { ...prevState, sections: newSections };
    });
  };

  const handleFileChange = async (e, fieldName, index = null) => {
    const file = e.target.files[0];
    if (file) {
      const url = await uploadToCloudinary(file);
      if (url) {
        if (fieldName === "background") {
          setFormState((prevState) => ({
            ...prevState,
            background: url,
          }));
        } else if (fieldName === "images" && index !== null) {
          setFormState((prevState) => {
            const newImages = [...prevState.images];
            newImages[index] = url;
            return { ...prevState, images: newImages };
          });
        }
      }
    }
  };

  const handleAddImage = () => {
    setFormState((prevState) => ({
      ...prevState,
      images: [...prevState.images, ""],
    }));
  };

  const handleRemoveImage = (index) => {
    setFormState((prevState) => {
      const newImages = [...prevState.images];
      newImages.splice(index, 1);
      return { ...prevState, images: newImages };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedFormState = {
      ...formState,
      sections: formState.sections.map((section) => ({
        heading: section.heading,
        points: section.points,
      })),
    };

    try {
      if (editingId) {
        await axios.patch(
          `${baseUrl}/updateclaymagix/${editingId}`,
          updatedFormState
        );
         console.log(`Data delivered to backend ${updatedFormState}`);
        toast.success("Entry updated successfully");
      } else {  
        await axios.post(`${baseUrl}/addclaymagix`, updatedFormState);
        toast.success("Entry created successfully");
      }

      setFormState({
        title: "",
        title2: "",
        background: "",
        paragraphs: [""],
        sections: [{ heading: "", points: [""] }],
        images: [""],
      });
      setEditingId(null);
      fetchData();
    } catch (error) {
      toast.error("Error submitting form");
      console.error("Error submitting form: ", error);
    }
  };

 const fetchData = async () => {
   try {
     const response = await axios.get(`${baseUrl}/`);
     const data = response.data.data[0];
     console.log("Fetched Data:", data); 

     if (data) {
       setFormState({
         title: data.title,
         title2: data.title2,
         background: data.bgimage,
         paragraphs: [data.para || ""],
         sections: data.info || [{ heading: "", points: [""] }], 
         images: data.images || [""],
       });
       setEditingId(data._id);
     } else {
       toast.error("No data found");
     }
   } catch (error) {
     console.error("Error fetching data: ", error);
     toast.error("Error fetching entries");
   }
 };


  useEffect(() => {
    fetchData();
  }, []);

  const navigateBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex">
      <button
        onClick={navigateBack}
        className="h-[40px] mt-[10px] mb-[10px] cursor-pointer transition-all bg-blue-500 text-white px-6 py-2 rounded-lg border-blue-600 border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px]"
      >
        Back
      </button>
      <div className="ml-[400px] p-6 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">CLAYMAGIX</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">
              Title
            </label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formState.title}
              onChange={(e) =>
                setFormState({ ...formState, title: e.target.value })
              }
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">
              Title 2
            </label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formState.title2}
              onChange={(e) =>
                setFormState({ ...formState, title2: e.target.value })
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
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">
              Paragraph
            </label>
            <textarea
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formState.paragraphs[0] || ""}
              onChange={(e) =>
                setFormState({ ...formState, paragraphs: [e.target.value] })
              }
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">
              Images
            </label>
            {formState.images.map((image, index) => (
              <div key={index} className="flex mb-2">
                <input
                  type="file"
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => handleFileChange(e, "images", index)}
                />
                <button
                  type="button"
                  className="ml-2 text-red-500"
                  onClick={() => handleRemoveImage(index)}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              className="mt-2 text-blue-500"
              onClick={handleAddImage}
            >
              Add Image
            </button>
          </div>

          {formState.sections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="mb-4">
              <label className="block text-gray-700 font-medium mb-1">
                Heading
              </label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={section.heading}
                onChange={(e) =>
                  handleHeadingChange(sectionIndex, e.target.value)
                }
              />

              <label className="block text-gray-700 font-medium mb-1">
                Points
              </label>
              {section.points.map((point, pointIndex) => (
                <div key={pointIndex} className="flex mb-2">
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={point}
                    onChange={(e) =>
                      handlePointChange(
                        sectionIndex,
                        pointIndex,
                        e.target.value
                      )
                    }
                  />
                  <button
                    type="button"
                    className="ml-2 text-red-500"
                    onClick={() => handleRemovePoint(sectionIndex, pointIndex)}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="mt-2 text-blue-500"
                onClick={() => handleAddPoint(sectionIndex)}
              >
                Add Point
              </button>

              <button
                type="button"
                className="mt-2 text-red-500"
                onClick={() => handleRemoveSection(sectionIndex)}
              >
                Remove Section
              </button>
            </div>
          ))}
          <button
            type="button"
            className="mt-2 text-blue-500"
            onClick={handleAddSection}
          >
            Add Section
          </button>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            {editingId ? "Update" : "Create"} Entry
          </button>
        </form>
      </div>
    </div>
  );
};

export default Claymagix;
