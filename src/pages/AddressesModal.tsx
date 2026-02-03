import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import { Trash2 } from "lucide-react";
import { Pencil } from "lucide-react";
import { Loader2 } from "lucide-react";
import { X } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { useApp } from "@/contexts/AppContext";

interface Props {
  close: () => void;
}

interface ApiAddress {
  id: "";
  street: "";
  city:"";
  state: "";
  pincode: "";
  default: boolean;
}

const isValidPincode = (value: string) => /^[0-9]{6}$/.test(value);
const isValidAlpha = (value: string) => /^[A-Za-z\s]{1,15}$/.test(value);

export default function AddressesModal({ close }: Props) {
  const { dispatch } = useApp();

  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isAddMode, setIsAddMode] = useState(false);

  const [newAddress, setNewAddress] = useState({
    flat: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [editingValue, setEditingValue] = useState({
    flat: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  });

  useEffect(() => {
    fetchAddresses();
  }, []);

  // ================= FETCH =================
  const fetchAddresses = async () => {
 
    try {
      setLoading(true);
      const res = await api.get("/api/user/addresses");

      const list = Array.isArray(res.data?.addresses)
        ? res.data.addresses
        : Array.isArray(res.data)
          ? res.data
          : [];

      setAddresses(list);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to fetch addresses",
      );
      setAddresses([]);
    } finally {
      setLoading(false);
    }
  };

  // ================= ADD =================
  const handleAddAddress = async () => {
    if (
      !newAddress.flat ||
      !newAddress.street ||
      !newAddress.city ||
      !newAddress.state ||
      !newAddress.pincode
    ) {
      toast.error("Please fill all address fields");
      return;
    }

    if (!isValidPincode(newAddress.pincode)) {
      toast.error("Pincode must be exactly 6 digits");
      return;
    }

    if (!isValidAlpha(newAddress.city)) {
      toast.error("City must contain only letters (max 15 characters)");
      return;
    }

    if (!isValidAlpha(newAddress.state)) {
      toast.error("State must contain only letters (max 15 characters)");
      return;
    }

    try {
      const payload = {
        street: `${newAddress.flat}, ${newAddress.street}`,
        city: newAddress.city,
        state: newAddress.state,
        pincode: newAddress.pincode,
        default: addresses.length === 0,
      };

      const res = await api.post("/api/user/addresses", payload);
      const data: ApiAddress = res.data;

      setAddresses((prev) => [...prev, data]);

      dispatch({
        type: "ADD_ADDRESS",
        payload: {
          id: data.id,
          address: `${data.street}, ${data.city}, ${data.state} - ${data.pincode}`,
          isDefault: data.default,
        },
      });

      setNewAddress({
        flat: "",
        street: "",
        city: "",
        state: "",
        pincode: "",
      });

      setIsAddMode(false);
      toast.success("Address added successfully!");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to add address");
    }
  };

  // ================= EDIT =================
  const handleEditAddress = async (id: string) => {
    if (
      !editingValue.flat ||
      !editingValue.street ||
      !editingValue.city ||
      !editingValue.state ||
      !editingValue.pincode
    ) {
      toast.error("Please fill all address fields");
      return;
    }

    if (!isValidPincode(newAddress.pincode)) {
      toast.error("Pincode must be exactly 6 digits");
      return;
    }

    if (!isValidAlpha(newAddress.city)) {
      toast.error("City must contain only letters (max 15 characters)");
      return;
    }

    if (!isValidAlpha(newAddress.state)) {
      toast.error("State must contain only letters (max 15 characters)");
      return;
    }

    try {
      const payload = {
        street: `${editingValue.flat}, ${editingValue.street}`,
        city: editingValue.city,
        state: editingValue.state,
        pincode: editingValue.pincode,
      };

      const res = await api.put(`/api/user/addresses/${id}`, payload);
      const data: ApiAddress = res.data;

      setAddresses((prev) => prev.map((a) => (a.id === id ? data : a)));

      dispatch({
        type: "UPDATE_ADDRESS",
        payload: {
          id: data.id,
          address: `${data.street}, ${data.city}, ${data.state} - ${data.pincode}`,
          isDefault: data.default,
        },
      });

      setEditingId(null);
      toast.success("Address updated successfully!");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to update address");
    }
  };

  // ================= DELETE =================
  const handleDeleteAddress = async (id: string) => {
    try {
      await api.delete(`/api/user/addresses/${id}`);

      setAddresses((prev) => prev.filter((a) => a.id !== id));
      dispatch({ type: "DELETE_ADDRESS", payload: id });

      toast.success("Address deleted successfully!");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to delete address");
    }
  };

  // ================= SELECT =================
  const handleSelectAddress = (addr: ApiAddress) => {
    dispatch({
      type: "SELECT_ADDRESS",
      payload: {
        id: addr.id,
        address: `${addr.street}, ${addr.city}, ${addr.state} - ${addr.pincode}`,
        isDefault: addr.default,
      },
    });

    toast.success("Address selected!");
    close();
  };

  const startEditing = (addr: ApiAddress) => {
    const parts = addr.street.split(", ");
    setEditingId(addr.id);
    setEditingValue({
      flat: parts[0] || "",
      street: parts.slice(1).join(", "),
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
    });
  };

  // ================= LOADING =================
  if (loading) {
    return (
      <motion.div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-3xl p-8">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
        </div>
      </motion.div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
        <motion.div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-lg max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">My Addresses</h2>
            <button onClick={close}>
              <X />
            </button>
          </div>

          <div className="space-y-3 mb-4">
            {addresses.length === 0 && !isAddMode && (
              <p className="text-center text-gray-400 py-6">
                No addresses saved yet
              </p>
            )}

            {addresses.map((addr) => (
              <div
                key={addr.id}
                className="p-4 border rounded-xl hover:bg-orange-50"
              >
                {editingId === addr.id ? (
                  <div className="space-y-2">
                    {["flat", "street", "city", "state", "pincode"].map(
                      (field) => (
                        <input
                          key={field}
                          placeholder={field}
                          value={(editingValue as any)[field]}
                          onChange={(e) =>
                            setEditingValue({
                              ...editingValue,
                              [field]: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border rounded-lg"
                        />
                      ),
                    )}

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditAddress(addr.id)}
                        className="flex-1 bg-green-500 text-white py-2 rounded-lg"
                      >
                        <Check className="mx-auto" />
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="flex-1 bg-gray-200 py-2 rounded-lg"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between">
                    <div
                      className="cursor-pointer"
                      onClick={() => handleSelectAddress(addr)}
                    >
                      <p className="text-sm">
                        {addr.street}, {addr.city}, {addr.state} -{" "}
                        {addr.pincode}
                      </p>
                      {addr.default && (
                        <span className="text-xs text-orange-600">Default</span>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button onClick={() => startEditing(addr)}>
                        <Pencil size={16} />
                      </button>
                      <button onClick={() => handleDeleteAddress(addr.id)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {!isAddMode ? (
            <button
              onClick={() => setIsAddMode(true)}
              className="w-full py-3 border-2 border-dashed border-orange-300 text-orange-600 rounded-xl"
            >
              + Add New Address
            </button>
          ) : (
            <div className="space-y-3 bg-orange-50 p-4 rounded-xl">
              {Object.keys(newAddress).map((field) => (
                <input
                  key={field}
                  placeholder={field}
                  value={(newAddress as any)[field]}
                  onChange={(e) =>
                    setNewAddress({
                      ...newAddress,
                      [field]: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                />
              ))}

              <div className="flex gap-2">
                <button
                  onClick={() => setIsAddMode(false)}
                  className="flex-1 bg-gray-200 py-2 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddAddress}
                  className="flex-1 bg-orange-500 text-white py-2 rounded-lg"
                >
                  Save Address
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
