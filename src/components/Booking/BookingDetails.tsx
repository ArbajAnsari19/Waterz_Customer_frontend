import React, { useState, useEffect } from "react";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "../../styles/Booking/BookingDetails.module.css";
import Y2 from "../../assets/Yatch/Y2.svg";
import { yachtAPI } from '../../api/yachts';
import { useLocation, useNavigate } from "react-router-dom";
import { Yacht } from "../../types/yachts";



interface FormData {
  startDate: Date | null;
  startTime: Date | null;
  location: string;
  YachtType: string;
  capacity: number;
  PeopleNo: string;
  addonServices: string[];
  packages: string;
  specialRequest: string;
  yacht: string;
}

interface PriceCalculation {
  addonServicesTotal: number;
  packageTotal: number;
  totalPrice: number;
}

const BookingDetails: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { yachtId } = location.state || {};

  const [yachtData, setYachtData] = useState<Yacht | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [priceDetails, setPriceDetails] = useState<PriceCalculation>({
    addonServicesTotal: 0,
    packageTotal: 0,
    totalPrice: 0
  });

  const [formData, setFormData] = useState<FormData>({
    startDate: new Date(),
    startTime: new Date(),
    location: "",
    YachtType: "",
    capacity: 0,
    PeopleNo: "",
    addonServices: [],
    packages: "",
    specialRequest: "",
    yacht: yachtId || "",
  });

  useEffect(() => {
    const fetchYachtData = async () => {
      try {
        const response = await yachtAPI.getYachtById(yachtId);
        // @ts-ignore
        const yacht = response.yatch
        setYachtData(yacht);
        // Pre-fill some form fields with yacht data
        setFormData(prev => ({
          ...prev,
          location: yacht.location,
          YachtType: yacht.YachtType,
          capacity: yacht.capacity
        }));
      } catch (error) {
        setError("Failed to fetch yacht details");
        console.error("Error fetching yacht data:", error);
      }
    };

    if (yachtId) {
      fetchYachtData();
    }
  }, [yachtId]);

  // Convert addon services to Select options
  const addonServicesOptions = yachtData?.addonServices.map(service => ({
    value: service.service,
    label: `${service.service} ($${service.pricePerHour}/hour)`,
    price: service.pricePerHour
  })) || [];

  // Convert package types to Select options
  const packagesOptions = yachtData?.packageTypes.map(packageType => {
    const [sailingTime, anchoringTime] = packageType.split('_hours_sailing_')
      .map(time => parseFloat(time.replace('_hour_anchorage', '')));
    
    const sailingPrice = yachtData.price.sailing.nonPeakTime * sailingTime;
    const anchoringPrice = yachtData.price.anchoring.nonPeakTime * anchoringTime;
    const totalPrice = sailingPrice + anchoringPrice;

    return {
      value: packageType,
      label: `${sailingTime} hours sailing + ${anchoringTime} hour anchorage ($${totalPrice})`,
      price: totalPrice
    };
  }) || [];

  // Custom styles for react-select
  const selectStyles = {
    control: (base: any) => ({
      ...base,
      minHeight: "40px",
      backgroundColor: "#f5f5f5",
      border: "none",
      borderRadius: "8px",
      boxShadow: "none",
      padding: "7px",
      fontSize: "18px",
    }),
  };

  // Handler for single select fields
  const handleSingleSelect = (
    selectedOption: { value: string; label: string; price?: number } | null,
    field: keyof FormData
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: selectedOption ? selectedOption.value : "",
    }));
  
    // Update price calculation for packages
    if (field === 'packages') {
      // Use 0 as default if price is undefined
      const packagePrice = selectedOption?.price ?? 0;
  
      setPriceDetails(prev => ({
        ...prev,
        packageTotal: packagePrice,
        totalPrice: packagePrice + prev.addonServicesTotal
      }));
    }
  };

  // Handler for multi-select fields (addonServices)
  const handleMultiSelect = (
    selectedOptions: readonly { value: string; label: string; price?: number }[],
    field: keyof FormData
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: selectedOptions.map(option => option.value),
    }));

    // Calculate total price for addon services
    const addonTotal = selectedOptions.reduce((total, option) => {
      return total + (option.price || 0);
    }, 0);

    setPriceDetails(prev => ({
      ...prev,
      addonServicesTotal: addonTotal,
      totalPrice: addonTotal + prev.packageTotal
    }));
  };

  const handleSubmit = async () => {
    setError("");
    try {
      setIsLoading(true);
      const formattedDate = formData.startDate ? formData.startDate.toISOString().split('T')[0] : "";
      const hours = formData.startTime ? formData.startTime.getHours().toString().padStart(2, '0') : "";
      const minutes = formData.startTime ? formData.startTime.getMinutes().toString().padStart(2, '0') : "";
      const formattedTime = `${hours}:${minutes}`;

      const formattedData = {
        ...formData,
        startDate: formattedDate,
        startTime: formattedTime,
        totalPrice: priceDetails.totalPrice
      };

      // @ts-ignore
      const response = await yachtAPI.bookYacht(formattedData);
      if (response) {
        navigate('/to-pay', {
          state: {
            // @ts-ignore
            bookingDetails: response.booking,
            // @ts-ignore
            orderId: response.orderId,
            packageTotal: priceDetails.packageTotal,
            addonServicesTotal: priceDetails.addonServicesTotal
          }
        });
      }
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to book yacht. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!yachtData) {
    return <div>Loading yacht details...</div>;
  }

  return (
    <div className={styles.comp_body}>
      <div className={styles.yatchBox}>
        <div className={styles.section_head}>Step Closer to Your Yacht Adventure</div>
        <div className={styles.section_head2}>Complete your booking in just a few clicks & get ready for an unforgettable experience!</div>
      </div>
      <div className={styles.image_box}>
        <img src={yachtData.images[0] || Y2} alt="Yacht" className={styles.Y2} />
      </div>
      <div className={styles.yatchBox}>
        <div className={styles.section_head}>{yachtData.name || "Luxury Yacht"}</div>
        <div className={styles.section_head2}>Please mention or edit the details to process</div>
      </div>
      <div className={styles.location_filt_box}>
        <div className={styles.form_grid}>
          {/* Start Date */}
          <div className={styles.form_group}>
            <label className={styles.form_label}>Start Date*</label>
            <DatePicker
              selected={formData.startDate}
              onChange={(date) =>
                setFormData((prev) => ({ ...prev, startDate: date }))
              }
              minDate={new Date()}
              className={styles.date_picker}
              dateFormat="MM/dd/yyyy"
            />
          </div>

          {/* Start Time */}
          <div className={styles.form_group}>
            <label className={styles.form_label}>Start Time*</label>
            <DatePicker
              selected={formData.startTime}
              onChange={(time) =>
                setFormData((prev) => ({ ...prev, startTime: time }))
              }
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={30}
              timeCaption="Time"
              dateFormat="h:mm aa"
              className={styles.date_picker}
            />
          </div>

          {/* Location (Read-only) */}
          <div className={styles.form_group}>
            <label className={styles.form_label}>Location</label>
            <input
              type="text"
              className={styles.form_input}
              value={yachtData.location}
              disabled
            />
          </div>

          {/* Yacht Type (Read-only) */}
          <div className={styles.form_group}>
            <label className={styles.form_label}>Yacht Type</label>
            <input
              type="text"
              className={styles.form_input}
              value={yachtData.YachtType}
              disabled
            />
          </div>

          {/* Yacht Capacity (Read-only) */}
          <div className={styles.form_group}>
            <label className={styles.form_label}>Yacht Capacity</label>
            <input
              type="number"
              className={styles.form_input}
              value={yachtData.capacity}
              disabled
            />
          </div>

          {/* Number of People */}
          <div className={styles.form_group}>
            <label className={styles.form_label}>Number of People*</label>
            <input
              type="number"
              min="1"
              max={yachtData.capacity}
              className={styles.form_input}
              placeholder="Enter number of people"
              value={formData.PeopleNo}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, PeopleNo: e.target.value }))
              }
            />
          </div>

          {/* Addon Services */}
          <div className={styles.form_group}>
            <label className={styles.form_label}>Addon Services</label>
            <Select
              options={addonServicesOptions}
              styles={selectStyles}
              isMulti
              value={addonServicesOptions.filter((option) =>
                formData.addonServices.includes(option.value)
              )}
              onChange={(value) => handleMultiSelect(value, "addonServices")}
            />
          </div>

          {/* Packages */}
          <div className={styles.form_group}>
            <label className={styles.form_label}>Packages*</label>
            <Select
              options={packagesOptions}
              styles={selectStyles}
              value={
                packagesOptions.find(
                  (option) => option.value === formData.packages
                ) || null
              }
              onChange={(value) => handleSingleSelect(value, "packages")}
            />
          </div>

        </div>

        {/* Price Summary
        <div className={styles.price_summary}>
          <h3>Price Summary</h3>
          <div className={styles.price_details}>
            <p>Package Price: ${priceDetails.packageTotal}</p>
            <p>Addon Services: ${priceDetails.addonServicesTotal}</p>
            <p className={styles.total_price}>Total Price: ${priceDetails.totalPrice}</p>
          </div>
        </div> */}

        <button onClick={handleSubmit} className={styles.submit_button} disabled={isLoading}>
          {isLoading ? "Loading..." : "Confirm & Continue"}
        </button>
        {error && <div className={styles.error_message}>{error}</div>}
      </div>
    </div>
  );
};

export default BookingDetails;