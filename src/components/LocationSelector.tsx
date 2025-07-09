import React, { useState, useEffect } from "react";
import { MapPin, ChevronDown } from "lucide-react";
import {
  getProvinces,
  getDistrictsByProvince,
  getWardsByDistrict,
  searchProvinces,
  searchDistricts,
  searchWards,
  type Province,
  type District,
  type Ward,
} from "../services/locationService";

interface LocationSelectorProps {
  onProvinceChange: (province: Province | null) => void;
  onDistrictChange: (district: District | null) => void;
  onWardChange: (ward: Ward | null) => void;
  initialProvince?: string;
  initialDistrict?: string;
  initialWard?: string;
  className?: string;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({
  onProvinceChange,
  onDistrictChange,
  onWardChange,
  initialProvince,
  initialDistrict,
  initialWard,
  className = "",
}) => {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);

  const [selectedProvince, setSelectedProvince] = useState<Province | null>(
    null
  );
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(
    null
  );
  const [selectedWard, setSelectedWard] = useState<Ward | null>(null);

  const [provinceQuery, setProvinceQuery] = useState(initialProvince || "");
  const [districtQuery, setDistrictQuery] = useState(initialDistrict || "");
  const [wardQuery, setWardQuery] = useState(initialWard || "");

  const [showProvinceDropdown, setShowProvinceDropdown] = useState(false);
  const [showDistrictDropdown, setShowDistrictDropdown] = useState(false);
  const [showWardDropdown, setShowWardDropdown] = useState(false);

  const [filteredProvinces, setFilteredProvinces] = useState<Province[]>([]);
  const [filteredDistricts, setFilteredDistricts] = useState<District[]>([]);
  const [filteredWards, setFilteredWards] = useState<Ward[]>([]);

  const [loading, setLoading] = useState(false);

  // Load provinces on mount
  useEffect(() => {
    const loadProvinces = async () => {
      try {
        setLoading(true);
        const data = await getProvinces();
        setProvinces(data);
        setFilteredProvinces(data);
      } catch (error) {
        console.error("Failed to load provinces:", error);
      } finally {
        setLoading(false);
      }
    };
    loadProvinces();
  }, []);

  // Search provinces
  useEffect(() => {
    if (provinceQuery.length > 0) {
      const filtered = provinces.filter((province) => {
        if (!province) return false;
        const name = province.name || "";
        const fullName = province.full_name || "";
        const query = provinceQuery.toLowerCase();
        return (
          name.toLowerCase().includes(query) ||
          fullName.toLowerCase().includes(query)
        );
      });
      setFilteredProvinces(filtered);
    } else {
      setFilteredProvinces(provinces);
    }
  }, [provinceQuery, provinces]);

  // Search districts
  useEffect(() => {
    if (districtQuery.length > 0 && selectedProvince) {
      const filtered = districts.filter((district) => {
        if (!district) return false;
        const name = district.name || "";
        const fullName = district.full_name || "";
        const query = districtQuery.toLowerCase();
        return (
          name.toLowerCase().includes(query) ||
          fullName.toLowerCase().includes(query)
        );
      });
      setFilteredDistricts(filtered);
    } else {
      setFilteredDistricts(districts);
    }
  }, [districtQuery, districts, selectedProvince]);

  // Search wards
  useEffect(() => {
    if (wardQuery.length > 0 && selectedDistrict) {
      const filtered = wards.filter((ward) => {
        if (!ward) return false;
        const name = ward.name || "";
        const fullName = ward.full_name || "";
        const query = wardQuery.toLowerCase();
        return (
          name.toLowerCase().includes(query) ||
          fullName.toLowerCase().includes(query)
        );
      });
      setFilteredWards(filtered);
    } else {
      setFilteredWards(wards);
    }
  }, [wardQuery, wards, selectedDistrict]);

  const handleProvinceSelect = async (province: Province) => {
    if (!province) return;
    setSelectedProvince(province);
    setProvinceQuery(province.name || "");
    setShowProvinceDropdown(false);
    onProvinceChange(province);

    // Reset district and ward
    setSelectedDistrict(null);
    setSelectedWard(null);
    setDistrictQuery("");
    setWardQuery("");
    setDistricts([]);
    setWards([]);
    onDistrictChange(null);
    onWardChange(null);

    // Load districts
    try {
      setLoading(true);
      const districtData = await getDistrictsByProvince(province.code);
      setDistricts(districtData);
      setFilteredDistricts(districtData);
    } catch (error) {
      console.error("Failed to load districts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDistrictSelect = async (district: District) => {
    if (!district) return;
    setSelectedDistrict(district);
    setDistrictQuery(district.name || "");
    setShowDistrictDropdown(false);
    onDistrictChange(district);

    // Reset ward
    setSelectedWard(null);
    setWardQuery("");
    setWards([]);
    onWardChange(null);

    // Load wards
    try {
      setLoading(true);
      const wardData = await getWardsByDistrict(district.code);
      setWards(wardData);
      setFilteredWards(wardData);
    } catch (error) {
      console.error("Failed to load wards:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleWardSelect = (ward: Ward) => {
    if (!ward) return;
    setSelectedWard(ward);
    setWardQuery(ward.name || "");
    setShowWardDropdown(false);
    onWardChange(ward);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Province Selector */}
      <div className="relative">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          <MapPin className="inline w-4 h-4 mr-1" />
          Tỉnh/Thành phố *
        </label>
        <div className="relative">
          <input
            type="text"
            value={provinceQuery}
            onChange={(e) => {
              setProvinceQuery(e.target.value);
              setShowProvinceDropdown(true);
            }}
            onFocus={() => setShowProvinceDropdown(true)}
            placeholder="Nhập tên tỉnh/thành phố..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-800 focus:border-amber-800"
            required
          />
          <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-gray-400" />

          {showProvinceDropdown && (
            <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
              {loading ? (
                <div className="px-3 py-2 text-gray-500">Đang tải...</div>
              ) : filteredProvinces.length > 0 ? (
                filteredProvinces.map((province) => (
                  <div
                    key={province?.code || Math.random()}
                    onClick={() => handleProvinceSelect(province)}
                    className="px-3 py-2 hover:bg-amber-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                  >
                    <div className="font-medium">{province?.name || "N/A"}</div>
                    <div className="text-xs text-gray-500">
                      {province?.full_name || "N/A"}
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-3 py-2 text-gray-500">
                  Không tìm thấy tỉnh/thành phố
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* District Selector */}
      <div className="relative">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Quận/Huyện *
        </label>
        <div className="relative">
          <input
            type="text"
            value={districtQuery}
            onChange={(e) => {
              setDistrictQuery(e.target.value);
              setShowDistrictDropdown(true);
            }}
            onFocus={() => setShowDistrictDropdown(true)}
            placeholder={
              selectedProvince
                ? "Nhập tên quận/huyện..."
                : "Vui lòng chọn tỉnh/thành phố trước"
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-800 focus:border-amber-800 disabled:bg-gray-100"
            disabled={!selectedProvince}
            required
          />
          <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-gray-400" />

          {showDistrictDropdown && selectedProvince && (
            <div className="absolute z-40 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
              {loading ? (
                <div className="px-3 py-2 text-gray-500">Đang tải...</div>
              ) : filteredDistricts.length > 0 ? (
                filteredDistricts.map((district) => (
                  <div
                    key={district?.code || Math.random()}
                    onClick={() => handleDistrictSelect(district)}
                    className="px-3 py-2 hover:bg-amber-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                  >
                    <div className="font-medium">{district?.name || "N/A"}</div>
                    <div className="text-xs text-gray-500">
                      {district?.full_name || "N/A"}
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-3 py-2 text-gray-500">
                  Không tìm thấy quận/huyện
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Ward Selector */}
      <div className="relative">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Phường/Xã *
        </label>
        <div className="relative">
          <input
            type="text"
            value={wardQuery}
            onChange={(e) => {
              setWardQuery(e.target.value);
              setShowWardDropdown(true);
            }}
            onFocus={() => setShowWardDropdown(true)}
            placeholder={
              selectedDistrict
                ? "Nhập tên phường/xã..."
                : "Vui lòng chọn quận/huyện trước"
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-800 focus:border-amber-800 disabled:bg-gray-100"
            disabled={!selectedDistrict}
            required
          />
          <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-gray-400" />

          {showWardDropdown && selectedDistrict && (
            <div className="absolute z-30 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
              {loading ? (
                <div className="px-3 py-2 text-gray-500">Đang tải...</div>
              ) : filteredWards.length > 0 ? (
                filteredWards.map((ward) => (
                  <div
                    key={ward?.code || Math.random()}
                    onClick={() => handleWardSelect(ward)}
                    className="px-3 py-2 hover:bg-amber-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                  >
                    <div className="font-medium">{ward?.name || "N/A"}</div>
                    <div className="text-xs text-gray-500">
                      {ward?.full_name || "N/A"}
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-3 py-2 text-gray-500">
                  Không tìm thấy phường/xã
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {(showProvinceDropdown || showDistrictDropdown || showWardDropdown) && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => {
            setShowProvinceDropdown(false);
            setShowDistrictDropdown(false);
            setShowWardDropdown(false);
          }}
        />
      )}
    </div>
  );
};

export default LocationSelector;
