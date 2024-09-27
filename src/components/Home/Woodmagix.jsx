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

const Woodmagix = () => {
  const baseUrl = "http://localhost:8080/woodmagix";
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
          `${baseUrl}/updatewoodmagix/${editingId}`,
          updatedFormState
        );
        console.log(`Data delivered to backend ${updatedFormState}`);
        toast.success("Entry updated successfully");
      } else {
        await axios.post(`${baseUrl}/addwoodmagix`, updatedFormState);
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
      const data = response.data[0];
      console.log("Data ", data);

      if (data) {
        setFormState({
          title: data.title || "",
          title2: data.title2 || "",
          background: data.bgimage || "",
          paragraphs: data.para ? [data.para] : [""],
          sections: Array.isArray(data.info)
            ? data.info
            : [{ heading: "", points: [""] }],
          images: Array.isArray(data.images) ? data.images : [""],
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
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Woodmagix</h1>
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
            {formState.paragraphs.map((paragraph, paragraphIndex) => (
              <textarea
                key={paragraphIndex}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={paragraph}
                onChange={(e) => {
                  const newParagraphs = [...formState.paragraphs];
                  newParagraphs[paragraphIndex] = e.target.value;
                  setFormState((prevState) => ({
                    ...prevState,
                    paragraphs: newParagraphs,
                  }));
                }}
              />
            ))}
          </div>

          {formState.sections?.map((section, sectionIndex) => (
            <div key={sectionIndex} className="mb-4">
              <label className="block text-gray-700 font-medium mb-1">
                Section Heading
              </label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={section.heading}
                onChange={(e) =>
                  handleHeadingChange(sectionIndex, e.target.value)
                }
              />

              <label className="block text-gray-700 font-medium mb-1 mt-2">
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
                    className="ml-2 bg-red-500 text-white px-2 py-1 rounded"
                    onClick={() => handleRemovePoint(sectionIndex, pointIndex)}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={() => handleAddPoint(sectionIndex)}
              >
                Add Point
              </button>
            </div>
          ))}

          <button
            type="button"
            className="bg-green-500 text-white px-4 py-2 rounded"
            onClick={handleAddSection}
          >
            Add Section
          </button>

          {formState.images?.map((image, index) => (
            <div key={index} className="mb-4">
              <label className="block text-gray-700 font-medium mb-1">
                Image {index + 1}
              </label>
              <input
                type="file"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => handleFileChange(e, "images", index)}
              />
              <button
                type="button"
                className="ml-2 bg-red-500 text-white px-2 py-1 rounded"
                onClick={() => handleRemoveImage(index)}
              >
                Remove Image
              </button>
            </div>
          ))}

          <button
            type="button"
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={handleAddImage}
          >
            Add Image
          </button>

          <button
            type="submit"
            className="mt-4 bg-green-500 text-white px-6 py-2 rounded"
          >
            {editingId ? "Update" : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Woodmagix;
