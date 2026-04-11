import React, { useState, useRef, useEffect } from "react";
import { countries, majorCities, getStatesForCountry, filterSuggestions } from "../utils/countries";
import "./AddressAutocomplete.css";

const AddressAutocomplete = ({
  address,
  onChange,
  section,
  subsection,
}) => {
  const [countrySuggestions, setCountrySuggestions] = useState([]);
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [stateSuggestions, setStateSuggestions] = useState([]);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [showStateDropdown, setShowStateDropdown] = useState(false);

  const countryRef = useRef(null);
  const cityRef = useRef(null);
  const stateRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (countryRef.current && !countryRef.current.contains(event.target)) {
        setShowCountryDropdown(false);
      }
      if (cityRef.current && !cityRef.current.contains(event.target)) {
        setShowCityDropdown(false);
      }
      if (stateRef.current && !stateRef.current.contains(event.target)) {
        setShowStateDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCountryChange = (value) => {
    onChange("address", "country", value);
    // Clear dependent fields when country changes
    onChange("address", "state", "");
    if (value) {
      const states = getStatesForCountry(value);
      setStateSuggestions(states);
      if (states.length > 0) {
        setShowStateDropdown(true);
      }
    } else {
      setStateSuggestions([]);
      setShowStateDropdown(false);
    }
  };

  const handleCountryInput = (e) => {
    const value = e.target.value;
    onChange("address", "country", value);
    const suggestions = filterSuggestions(value, countries);
    setCountrySuggestions(suggestions);
    setShowCountryDropdown(suggestions.length > 0);
  };

  const handleCountrySelect = (country) => {
    handleCountryChange(country);
    setShowCountryDropdown(false);
    setCountrySuggestions([]);
  };

  const handleCityChange = (value) => {
    onChange("address", "city", value);
    if (value) {
      const suggestions = filterSuggestions(value, majorCities);
      setCitySuggestions(suggestions);
      setShowCityDropdown(suggestions.length > 0);
    } else {
      setCitySuggestions([]);
      setShowCityDropdown(false);
    }
  };

  const handleCitySelect = (city) => {
    onChange("address", "city", city);
    setShowCityDropdown(false);
    setCitySuggestions([]);
  };

  const handleStateChange = (value) => {
    onChange("address", "state", value);
    if (value) {
      const suggestions = filterSuggestions(value, stateSuggestions);
      setStateSuggestions(suggestions);
      setShowStateDropdown(suggestions.length > 0);
    } else {
      setShowStateDropdown(false);
    }
  };

  const handleStateSelect = (state) => {
    onChange("address", "state", state);
    setShowStateDropdown(false);
  };

  const handleInputChange = (field, value) => {
    onChange("address", field, value);
  };

  const currentCountry = address?.country || "";
  const hasStateOptions = stateSuggestions.length > 0;

  return (
    <div className="address-form">
      <div className="address-header">
        <h4>Address Details</h4>
      </div>

      {/* Country - Autocomplete */}
      <div className="form-group" ref={countryRef}>
        <label>Country <span className="required">*</span></label>
        <div className="autocomplete-wrapper">
          <input
            type="text"
            value={currentCountry}
            onChange={handleCountryInput}
            onFocus={() => {
              const suggestions = filterSuggestions(currentCountry, countries);
              setCountrySuggestions(suggestions);
              setShowCountryDropdown(suggestions.length > 0);
            }}
            placeholder="Start typing country name..."
            autoComplete="off"
          />
          {showCountryDropdown && countrySuggestions.length > 0 && (
            <ul className="autocomplete-dropdown">
              {countrySuggestions.map((country, index) => (
                <li
                  key={index}
                  onClick={() => handleCountrySelect(country)}
                  className="autocomplete-item"
                >
                  {country}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Street Address Line 1 - Required */}
      <div className="form-group">
        <label>Street Address Line 1 <span className="required">*</span></label>
        <input
          type="text"
          value={address?.streetAddress1 || ""}
          onChange={(e) => handleInputChange("streetAddress1", e.target.value)}
          placeholder="Street address, P.O. box, company name"
          required
        />
      </div>

      {/* Street Address Line 2 - Optional */}
      <div className="form-group">
        <label>Address Line 2 <span className="optional">(Optional)</span></label>
        <input
          type="text"
          value={address?.streetAddress2 || ""}
          onChange={(e) => handleInputChange("streetAddress2", e.target.value)}
          placeholder="Apartment, suite, unit, building, floor"
        />
      </div>

      {/* City - Autocomplete */}
      <div className="form-group" ref={cityRef}>
        <label>City / Locality <span className="required">*</span></label>
        <div className="autocomplete-wrapper">
          <input
            type="text"
            value={address?.city || ""}
            onChange={(e) => handleCityChange(e.target.value)}
            onFocus={() => {
              const suggestions = filterSuggestions(address?.city || "", majorCities);
              setCitySuggestions(suggestions);
              setShowCityDropdown(suggestions.length > 0);
            }}
            placeholder="City, district, suburb"
            autoComplete="off"
          />
          {showCityDropdown && citySuggestions.length > 0 && (
            <ul className="autocomplete-dropdown">
              {citySuggestions.map((city, index) => (
                <li
                  key={index}
                  onClick={() => handleCitySelect(city)}
                  className="autocomplete-item"
                >
                  {city}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* State/Province - Autocomplete (conditional based on country) */}
      <div className="form-group" ref={stateRef}>
        <label>State / Province / Region</label>
        <div className="autocomplete-wrapper">
          <input
            type="text"
            value={address?.state || ""}
            onChange={(e) => handleStateChange(e.target.value)}
            onFocus={() => {
              if (hasStateOptions) {
                const suggestions = filterSuggestions(address?.state || "", stateSuggestions);
                setStateSuggestions(suggestions);
                setShowStateDropdown(suggestions.length > 0);
              }
            }}
            placeholder={hasStateOptions ? "Start typing..." : "State, province, region"}
            autoComplete="off"
          />
          {showStateDropdown && stateSuggestions.length > 0 && (
            <ul className="autocomplete-dropdown">
              {stateSuggestions.map((state, index) => (
                <li
                  key={index}
                  onClick={() => handleStateSelect(state)}
                  className="autocomplete-item"
                >
                  {state}
                </li>
              ))}
            </ul>
          )}
        </div>
        {hasStateOptions && (
          <small className="field-hint">Available options for {currentCountry}</small>
        )}
      </div>

      {/* Zip/Postal Code */}
      <div className="form-group">
        <label>Zip / Postal Code</label>
        <input
          type="text"
          value={address?.zipCode || ""}
          onChange={(e) => handleInputChange("zipCode", e.target.value)}
          placeholder="Postal code"
        />
      </div>
    </div>
  );
};

export default AddressAutocomplete;