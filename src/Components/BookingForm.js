import { useState, useEffect, useRef } from "react";
import axios from "axios";

function BookingForm({ onClose }) {
  const [selectedCheckbox, setSelectedCheckbox] = useState(null);
  const [labelValue, setLabelValue] = useState("");
  const [backResponse, setBackResponse] = useState("");
  const bookRef = useRef();
  const closeBook = (e) => {
    if (bookRef.current === e.target) {
      onClose();
    }
  };

  const handleCheckboxChange = (event) => {
    const { value } = event.target;

    // Update the selected checkbox and label value
    setSelectedCheckbox(value);
    switch (value) {
      case "1":
        setLabelValue("500");
        break;
      case "2":
        setLabelValue("800");
        break;
      case "3":
        setLabelValue("1200");
        break;
      default:
        setLabelValue("");
    }
  };

  const [formData, setFormData] = useState({
    theatreName: "",
    location: "",
    movieName: "",
    date: "",
    time: "",
    seatCategory: [],
    seatNumber: "",
    price: "",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.get("http://127.0.0.1:5000/getform", {
        params: {
          theatreName: formData.theatreName,
          location: formData.location,
          movieName: formData.movieName,
          date: formData.date,
          time: formData.time,
          "seatCategory[]": formData.seatCategory,
          seatNumber: formData.seatNumber,
          price: formData.price,
        },
      });
      if (response.data) {
        setBackResponse(response.data);
        console.log("Response from backend:", response.data);
        alert("Message from backend" + " : " + response.data);
      } else {
        console.log("Submission failed");
      }
    } catch (error) {
      console.error("Error submitting the form", error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      let updatedSeatCategory = [];

      if (checked) {
        updatedSeatCategory = [value]; // Only select the current checkbox
      }
      setFormData((prevState) => ({
        ...prevState,
        seatCategory: updatedSeatCategory,
      }));
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };
  let seat = 0;
  if (formData.seatCategory === "Normal Seat") {
    seat += 500;
  }
  if (formData.seatCategory === "Balcony Seat") {
    seat += 800;
  }
  if (formData.seatCategory === "Balcony Box") {
    seat += 1200;
  }

  return (
    <div ref={bookRef} onClick={closeBook} className="booking-form-container">
      <form onSubmit={handleSubmit} className="booking-form">
        <div>
          <label>Theatre Name:</label>
          <select
            name="theatreName"
            value={formData.theatreName}
            onChange={handleChange}
          >
            <option value="">Select a theatre</option>
            <option value="Savoy Cinema">Savoy Cinema</option>
            <option value="LP Cinema">LP Cinema</option>
            <option value="Queens Cinema">Queens Cinema</option>
          </select>
        </div>
        <div>
          <label>Location:</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            placeholder="Enter the location"
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Date:</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Time:</label>
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
          />
        </div>
        <div className="seatCategory">
          <div>
            <label>Seat Category: </label>
          </div>
          <div className="seatType">
            <label>
              <input
                type="checkbox"
                value="1"
                checked={selectedCheckbox === "1"}
                onChange={handleCheckboxChange}
              />
              Normal Seat
            </label>
            <label>
              <input
                type="checkbox"
                value="2"
                checked={selectedCheckbox === "2"}
                onChange={handleCheckboxChange}
              />
              Balcony Seat
            </label>
            <label>
              <input
                type="checkbox"
                value="3"
                checked={selectedCheckbox === "3"}
                onChange={handleCheckboxChange}
              />
              Balcony Box
            </label>
          </div>
        </div>
        <div>
          <label>Seat Number:</label>
          <input
            type="text"
            name="seatNumber"
            value={formData.seatNumber}
            placeholder="Enter your seat number"
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Price: {labelValue}</label>
        </div>
        <div>
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
}

export default BookingForm;
