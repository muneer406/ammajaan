import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { AddressesContext } from "./addressesContextInstance";

const ADDRESSES_KEY = "ammajaan_addresses";

function safeWrite(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    toast.warning(
      "Could not save to device storage. Addresses may be lost when you close the tab.",
      { toastId: "addresses-storage-warning" },
    );
  }
}

function sanitizeAddress(raw) {
  if (!raw || typeof raw !== "object") return null;

  const id = raw.id != null ? String(raw.id) : null;
  const fullName = raw.fullName != null ? String(raw.fullName) : "";
  const email = raw.email != null ? String(raw.email) : "";
  const address = raw.address != null ? String(raw.address) : "";
  const city = raw.city != null ? String(raw.city) : "";
  const pinCode = raw.pinCode != null ? String(raw.pinCode) : "";

  if (!id) return null;
  if (!fullName.trim()) return null;
  if (!email.trim()) return null;
  if (!address.trim()) return null;
  if (!city.trim()) return null;
  if (!pinCode.trim()) return null;

  return {
    id,
    fullName: fullName.trim(),
    email: email.trim(),
    address: address.trim(),
    city: city.trim(),
    pinCode: pinCode.trim(),
  };
}

const readStorage = (key, sanitizer) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map(sanitizer).filter(Boolean);
  } catch {
    return [];
  }
};

export function AddressesProvider({ children }) {
  const [addresses, setAddresses] = useState(() =>
    readStorage(ADDRESSES_KEY, sanitizeAddress),
  );

  useEffect(() => {
    safeWrite(ADDRESSES_KEY, addresses);
  }, [addresses]);

  const addAddress = (address) => {
    if (
      !address ||
      typeof address !== "object" ||
      !address.fullName?.trim() ||
      !address.email?.trim() ||
      !address.address?.trim() ||
      !address.city?.trim() ||
      !address.pinCode?.trim()
    ) {
      toast.error("Please fill in all address fields.");
      return false;
    }

    const newAddress = {
      id: Date.now().toString(),
      fullName: address.fullName.trim(),
      email: address.email.trim(),
      address: address.address.trim(),
      city: address.city.trim(),
      pinCode: address.pinCode.trim(),
    };

    setAddresses((prev) => [newAddress, ...prev]);
    toast.success("Address saved successfully");
    return true;
  };

  const removeAddress = (addressId) => {
    setAddresses((prev) => prev.filter((addr) => addr.id !== addressId));
    toast.info("Address removed");
  };

  const value = {
    addresses,
    addAddress,
    removeAddress,
  };

  return (
    <AddressesContext.Provider value={value}>
      {children}
    </AddressesContext.Provider>
  );
}
