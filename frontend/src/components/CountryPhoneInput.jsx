import React from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const PhoneInputComponent =
  typeof PhoneInput === 'function'
    ? PhoneInput
    : (PhoneInput?.default || PhoneInput?.PhoneInput);

const inputStyle = {
  width: '100%',
  height: '50px',
  border: 'none',
  borderRadius: '0 0.85rem 0.85rem 0',
  background: 'rgba(255, 255, 255, 0.9)',
  color: 'var(--ink-900)',
  fontSize: '1rem',
  fontFamily: "'IBM Plex Sans', 'Segoe UI', sans-serif",
  paddingLeft: '56px',
  boxShadow: 'none',
};

const buttonStyle = {
  position: 'absolute',
  left: '0',
  top: '0',
  bottom: '0',
  width: '52px',
  height: '100%',
  border: 'none',
  borderRadius: '0.85rem 0 0 0.85rem',
  background: 'rgba(255, 255, 255, 0.9)',
};

const dropdownStyle = {
  border: '1px solid var(--line)',
  borderRadius: '0.75rem',
  boxShadow: 'var(--shadow-soft)',
  color: 'var(--ink-900)',
  fontFamily: "'IBM Plex Sans', 'Segoe UI', sans-serif",
  zIndex: 30,
};

const CountryPhoneInput = ({
  id,
  name = 'phone',
  label,
  value,
  onChange,
  placeholder = 'Enter mobile number',
  helperText,
  required = false,
  disabled = false,
}) => {
  if (typeof PhoneInputComponent !== 'function') {
    return null;
  }

  return (
    <div className="phone-field">
      {label && (
        <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-slate-700">
          {label}
        </label>
      )}

      <PhoneInputComponent
        country="in"
        value={value}
        onChange={(phone, country) => {
          const dialCode = String(country?.dialCode || '91');
          const digits = String(phone || '').replace(/\D/g, '');
          const localNumber = digits.startsWith(dialCode) ? digits.slice(dialCode.length) : digits;

          onChange({
            countryCode: dialCode,
            countryIso2: String(country?.countryCode || 'in').toUpperCase(),
            phoneNumber: localNumber,
            internationalNumber: digits,
          });
        }}
        inputProps={{
          id,
          name,
          required,
          disabled,
          autoComplete: 'tel',
        }}
        inputClass="phone-input-native"
        buttonClass="phone-country-button"
        dropdownClass="phone-country-dropdown"
        containerClass="phone-input-container"
        inputStyle={inputStyle}
        buttonStyle={buttonStyle}
        dropdownStyle={dropdownStyle}
        containerStyle={{
          width: '100%',
          border: '1px solid var(--line)',
          borderRadius: '0.85rem',
          overflow: 'visible',
          background: 'rgba(255, 255, 255, 0.9)',
          position: 'relative',
        }}
        enableSearch
        disableSearchIcon
        countryCodeEditable={false}
        placeholder={placeholder}
        disabled={disabled}
      />

      {helperText && (
        <p className="mt-1.5 text-xs text-slate-500" id={`${id}-help`}>
          {helperText}
        </p>
      )}
    </div>
  );
};

export default CountryPhoneInput;