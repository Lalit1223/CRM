import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  X,
  Upload,
  DollarSign,
  Package,
  ShoppingBag,
  Tag,
  Truck,
  Plus,
  Minus,
  AlertCircle,
  Image as ImageIcon,
  ArrowLeft,
  Check,
} from "lucide-react";

const StandaloneProductForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  // States
  const [product, setProduct] = useState(null);
  const [catalogs, setCatalogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [fileInputRef] = useState(React.createRef());

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    salePrice: "",
    currency: "INR",
    category: "electronics_gadgets",
    subCategory: "mobile",
    brand: "",
    quantity: "1",
    sku: "",
    weight: "",
    weightUnit: "kg",
    length: "",
    width: "",
    height: "",
    dimensionUnit: "cm",
    isDigital: false,
    hasVariants: false,
    catalogId: "",
    adminNotes: "",
    attributes: [],
  });

  // Image state
  const [selectedImages, setSelectedImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);
  const [attributeInput, setAttributeInput] = useState({ name: "", value: "" });

  // Get admin token from localStorage or sessionStorage
  const token =
    localStorage.getItem("adminToken") ||
    localStorage.getItem("token") ||
    sessionStorage.getItem("adminToken") ||
    sessionStorage.getItem("token") ||
    localStorage.getItem("authToken") ||
    sessionStorage.getItem("authToken");

  // Check if we actually have a token
  if (!token) {
    console.warn(
      "No authentication token found in storage. API requests will likely fail with 401 Unauthorized."
    );
  }

  const baseUrl =
    import.meta.env.VITE_API_BASE_URL ||
    "https://pixe-backend-83iz.onrender.com";

  // Updated Categories to match backend enum values
  const categories = [
    { value: "general", label: "General" },
    { value: "fashion_apparel", label: "Fashion & Apparel" },
    { value: "electronics_gadgets", label: "Electronics & Gadgets" },
    { value: "home_garden", label: "Home & Garden" },
    { value: "health_beauty", label: "Health & Beauty" },
    { value: "sports_outdoors", label: "Sports & Outdoors" },
    { value: "automotive", label: "Automotive" },
    { value: "books_media", label: "Books & Media" },
    { value: "toys_games", label: "Toys & Games" },
    { value: "food_beverage", label: "Food & Beverage" },
    { value: "jewelry_accessories", label: "Jewelry & Accessories" },
    { value: "business_industrial", label: "Business & Industrial" },
    { value: "art_collectibles", label: "Art & Collectibles" },
    { value: "baby_kids", label: "Baby & Kids" },
    { value: "pet_supplies", label: "Pet Supplies" },
    { value: "services", label: "Services" },
    { value: "digital_products", label: "Digital Products" },
    { value: "software", label: "Software" },
    { value: "courses_education", label: "Courses & Education" },
    { value: "handmade_crafts", label: "Handmade & Crafts" },
    { value: "vintage_antiques", label: "Vintage & Antiques" },
    { value: "real_estate", label: "Real Estate" },
    { value: "travel_experiences", label: "Travel & Experiences" },
    { value: "custom", label: "Custom" },
  ];

  // Updated Sub-categories to match the new category structure
  const subCategories = {
    electronics_gadgets: [
      { value: "mobile", label: "Mobile Phones" },
      { value: "laptop", label: "Laptops & Computers" },
      { value: "audio", label: "Audio Devices" },
      { value: "camera", label: "Cameras & Photography" },
      { value: "gaming", label: "Gaming" },
      { value: "wearables", label: "Wearables" },
      { value: "accessories", label: "Electronics Accessories" },
    ],
    fashion_apparel: [
      { value: "mens", label: "Men's Clothing" },
      { value: "womens", label: "Women's Clothing" },
      { value: "kids", label: "Kids' Clothing" },
      { value: "shoes", label: "Footwear" },
      { value: "bags", label: "Bags & Luggage" },
      { value: "accessories", label: "Fashion Accessories" },
    ],
    home_garden: [
      { value: "furniture", label: "Furniture" },
      { value: "decor", label: "Home Decor" },
      { value: "kitchen", label: "Kitchen & Dining" },
      { value: "bedding", label: "Bedding & Bath" },
      { value: "garden", label: "Garden & Outdoor" },
      { value: "storage", label: "Storage & Organization" },
    ],
    health_beauty: [
      { value: "skincare", label: "Skincare" },
      { value: "makeup", label: "Makeup & Cosmetics" },
      { value: "haircare", label: "Hair Care" },
      { value: "personal_care", label: "Personal Care" },
      { value: "wellness", label: "Health & Wellness" },
      { value: "fitness", label: "Fitness Equipment" },
    ],
    sports_outdoors: [
      { value: "fitness", label: "Fitness & Exercise" },
      { value: "outdoor_gear", label: "Outdoor Gear" },
      { value: "sports_equipment", label: "Sports Equipment" },
      { value: "cycling", label: "Cycling" },
      { value: "water_sports", label: "Water Sports" },
      { value: "team_sports", label: "Team Sports" },
    ],
    automotive: [
      { value: "car_accessories", label: "Car Accessories" },
      { value: "motorcycle", label: "Motorcycle" },
      { value: "car_parts", label: "Car Parts" },
      { value: "tools", label: "Automotive Tools" },
      { value: "maintenance", label: "Maintenance & Care" },
    ],
    books_media: [
      { value: "books", label: "Books" },
      { value: "ebooks", label: "E-books" },
      { value: "audiobooks", label: "Audiobooks" },
      { value: "movies", label: "Movies & TV" },
      { value: "music", label: "Music" },
      { value: "magazines", label: "Magazines" },
    ],
    toys_games: [
      { value: "kids_toys", label: "Kids' Toys" },
      { value: "board_games", label: "Board Games" },
      { value: "video_games", label: "Video Games" },
      { value: "puzzles", label: "Puzzles" },
      { value: "educational", label: "Educational Toys" },
      { value: "outdoor_toys", label: "Outdoor Toys" },
    ],
    digital_products: [
      { value: "software", label: "Software" },
      { value: "apps", label: "Mobile Apps" },
      { value: "digital_art", label: "Digital Art" },
      { value: "templates", label: "Templates" },
      { value: "music", label: "Digital Music" },
      { value: "courses", label: "Online Courses" },
    ],
    general: [
      { value: "other", label: "Other" },
      { value: "miscellaneous", label: "Miscellaneous" },
    ],
    food_beverage: [
      { value: "snacks", label: "Snacks" },
      { value: "beverages", label: "Beverages" },
      { value: "organic", label: "Organic" },
      { value: "specialty", label: "Specialty Foods" },
    ],
    jewelry_accessories: [
      { value: "jewelry", label: "Jewelry" },
      { value: "watches", label: "Watches" },
      { value: "accessories", label: "Accessories" },
    ],
    business_industrial: [
      { value: "office_supplies", label: "Office Supplies" },
      { value: "industrial_equipment", label: "Industrial Equipment" },
      { value: "safety", label: "Safety Equipment" },
    ],
    art_collectibles: [
      { value: "artwork", label: "Artwork" },
      { value: "collectibles", label: "Collectibles" },
      { value: "antiques", label: "Antiques" },
    ],
    baby_kids: [
      { value: "baby_gear", label: "Baby Gear" },
      { value: "kids_clothing", label: "Kids Clothing" },
      { value: "toys", label: "Kids Toys" },
    ],
    pet_supplies: [
      { value: "dog_supplies", label: "Dog Supplies" },
      { value: "cat_supplies", label: "Cat Supplies" },
      { value: "pet_food", label: "Pet Food" },
      { value: "pet_accessories", label: "Pet Accessories" },
    ],
    services: [
      { value: "professional", label: "Professional Services" },
      { value: "personal", label: "Personal Services" },
      { value: "consultation", label: "Consultation" },
    ],
    software: [
      { value: "productivity", label: "Productivity Software" },
      { value: "creative", label: "Creative Software" },
      { value: "business", label: "Business Software" },
      { value: "games", label: "Games & Entertainment" },
    ],
    courses_education: [
      { value: "online_courses", label: "Online Courses" },
      { value: "certification", label: "Certification Programs" },
      { value: "tutorials", label: "Tutorials" },
      { value: "educational_materials", label: "Educational Materials" },
    ],
    handmade_crafts: [
      { value: "handmade", label: "Handmade Items" },
      { value: "crafts", label: "Crafts" },
      { value: "diy", label: "DIY Materials" },
    ],
    vintage_antiques: [
      { value: "vintage", label: "Vintage Items" },
      { value: "antiques", label: "Antiques" },
      { value: "collectibles", label: "Vintage Collectibles" },
    ],
    real_estate: [
      { value: "residential", label: "Residential" },
      { value: "commercial", label: "Commercial" },
      { value: "land", label: "Land" },
    ],
    travel_experiences: [
      { value: "travel_packages", label: "Travel Packages" },
      { value: "experiences", label: "Experiences" },
      { value: "tours", label: "Tours" },
    ],
    custom: [
      { value: "custom", label: "Custom Products" },
      { value: "personalized", label: "Personalized Items" },
    ],
  };

  // Currencies
  const currencies = [
    { value: "INR", label: "INR (₹)" },
    { value: "USD", label: "USD ($)" },
    { value: "EUR", label: "EUR (€)" },
    { value: "GBP", label: "GBP (£)" },
  ];

  // Fetch catalogs on component mount
  useEffect(() => {
    fetchCatalogs();

    if (isEditMode && id) {
      fetchProduct(id);
    }
  }, [id]);

  // Fetch product to edit
  const fetchProduct = async (productId) => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${baseUrl}/api/products/admin/${productId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        setProduct(data.productRequest);

        // Set form data from product
        setFormData({
          name: data.productRequest.name || "",
          description: data.productRequest.description || "",
          price: data.productRequest.price?.toString() || "",
          salePrice: data.productRequest.salePrice?.toString() || "",
          currency: data.productRequest.currency || "INR",
          category: data.productRequest.category || "electronics_gadgets",
          subCategory: data.productRequest.subCategory || "mobile",
          brand: data.productRequest.brand || "",
          quantity: data.productRequest.inventory?.quantity?.toString() || "1",
          sku: data.productRequest.inventory?.sku || "",
          weight: data.productRequest.shipping?.weight?.toString() || "",
          weightUnit: data.productRequest.shipping?.weightUnit || "kg",
          length:
            data.productRequest.shipping?.dimensions?.length?.toString() || "",
          width:
            data.productRequest.shipping?.dimensions?.width?.toString() || "",
          height:
            data.productRequest.shipping?.dimensions?.height?.toString() || "",
          dimensionUnit: data.productRequest.shipping?.dimensions?.unit || "cm",
          isDigital: data.productRequest.isDigital || false,
          hasVariants: data.productRequest.hasVariants || false,
          catalogId: data.productRequest.catalogId?._id || "",
          adminNotes: data.productRequest.adminNotes || "",
          attributes: data.productRequest.attributes || [],
        });

        // Set existing images
        if (
          data.productRequest.images &&
          data.productRequest.images.length > 0
        ) {
          setExistingImages(
            data.productRequest.images.map((img) => ({
              url: img.url,
              isPrimary: img.isPrimary || false,
              caption: img.caption || "",
            }))
          );
        }
      } else {
        setError(data.message || "Failed to fetch product");
      }
    } catch (err) {
      console.error("Error fetching product:", err);
      setError("An error occurred while fetching the product");
    } finally {
      setLoading(false);
    }
  };

  // Fetch available catalogs
  const fetchCatalogs = async () => {
    try {
      //   console.log(
      //     "Fetching catalogs with token:",
      //     token ? "Token exists" : "No token"
      //   );

      const response = await fetch(
        `${baseUrl}/api/product-catalogs/admin?includeStats=false`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Catalog fetch failed:", response.status, errorText);
        throw new Error(`Failed to fetch catalogs: ${response.status}`);
      }

      const data = await response.json();
      //   console.log("Catalogs response:", data);

      if (data.success) {
        if (data.data && Array.isArray(data.data)) {
          setCatalogs(data.data);

          // Set default catalog if not in edit mode
          if (!isEditMode && data.data.length > 0) {
            const defaultCatalog =
              data.data.find((catalog) => catalog.isDefault) || data.data[0];
            setFormData((prev) => ({
              ...prev,
              catalogId: defaultCatalog._id,
            }));
          }
        } else {
          console.warn("Catalog data is not in expected format:", data);
          setCatalogs([]);
        }
      } else {
        console.error("Failed to fetch catalogs:", data.message);
        setError("Failed to load catalogs. Please try again later.");
      }
    } catch (err) {
      console.error("Error fetching catalogs:", err);
      setError(
        "Failed to load catalogs. Please check your connection and try again."
      );
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Handle category change - reset subcategory to first available option
    if (name === "category") {
      const availableSubCategories = subCategories[value];
      const defaultSubCategory = availableSubCategories?.[0]?.value || "";

      setFormData((prev) => ({
        ...prev,
        [name]: value,
        subCategory: defaultSubCategory,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  // Handle attribute input changes
  const handleAttributeInputChange = (e) => {
    const { name, value } = e.target;
    setAttributeInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Add attribute
  const handleAddAttribute = () => {
    if (!attributeInput.name.trim() || !attributeInput.value.trim()) {
      setError("Both attribute name and value are required");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      attributes: [
        ...prev.attributes,
        {
          name: attributeInput.name.trim(),
          value: attributeInput.value.trim(),
        },
      ],
    }));

    // Reset attribute input
    setAttributeInput({ name: "", value: "" });
    setError("");
  };

  // Remove attribute
  const handleRemoveAttribute = (index) => {
    setFormData((prev) => ({
      ...prev,
      attributes: prev.attributes.filter((_, i) => i !== index),
    }));
  };

  // Handle image selection
  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Check file types
    const invalidFiles = files.filter((file) => !file.type.includes("image/"));
    if (invalidFiles.length > 0) {
      setError("Only image files are allowed");
      return;
    }

    // Add to selected images
    setSelectedImages((prev) => [...prev, ...files]);

    // Create preview URLs
    const newPreviewImages = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      isPrimary: false,
      caption: "",
    }));

    // If this is the first image, set it as primary
    if (previewImages.length === 0 && existingImages.length === 0) {
      newPreviewImages[0].isPrimary = true;
    }

    setPreviewImages((prev) => [...prev, ...newPreviewImages]);
  };

  // Remove preview image
  const handleRemovePreviewImage = (index) => {
    // Release object URL to prevent memory leaks
    URL.revokeObjectURL(previewImages[index].url);

    // Check if removed image was primary
    const wasPrimary = previewImages[index].isPrimary;

    // Remove from selected images and previews
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));

    // If removed image was primary, set a new primary if available
    if (wasPrimary) {
      if (previewImages.length > 1) {
        // Set first remaining preview as primary
        setPreviewImages((prev) => {
          const newPreviews = [...prev];
          if (newPreviews.length > 0 && index < newPreviews.length) {
            const newIndex = index === 0 ? 0 : index - 1;
            newPreviews[newIndex].isPrimary = true;
          }
          return newPreviews;
        });
      } else if (existingImages.length > 0) {
        // Set first existing image as primary
        setExistingImages((prev) => {
          const newExisting = [...prev];
          newExisting[0].isPrimary = true;
          return newExisting;
        });
      }
    }
  };

  // Remove existing image
  const handleRemoveExistingImage = (index) => {
    // Check if removed image was primary
    const wasPrimary = existingImages[index].isPrimary;

    // Add to removed images list
    setRemovedImages((prev) => [...prev, existingImages[index].url]);

    // Remove from existing images
    setExistingImages((prev) => prev.filter((_, i) => i !== index));

    // If removed image was primary, set a new primary if available
    if (wasPrimary) {
      if (existingImages.length > 1) {
        // Set first remaining existing image as primary
        setExistingImages((prev) => {
          const newExisting = [...prev];
          if (newExisting.length > 0 && index < newExisting.length) {
            const newIndex = index === 0 ? 0 : index - 1;
            newExisting[newIndex].isPrimary = true;
          }
          return newExisting;
        });
      } else if (previewImages.length > 0) {
        // Set first preview image as primary
        setPreviewImages((prev) => {
          const newPreviews = [...prev];
          newPreviews[0].isPrimary = true;
          return newPreviews;
        });
      }
    }
  };

  // Set primary image
  const handleSetPrimaryPreview = (index) => {
    // Remove primary from all existing images
    setExistingImages((prev) =>
      prev.map((img) => ({ ...img, isPrimary: false }))
    );

    // Set primary in preview images
    setPreviewImages((prev) =>
      prev.map((img, i) => ({ ...img, isPrimary: i === index }))
    );
  };

  // Set primary existing image
  const handleSetPrimaryExisting = (index) => {
    // Remove primary from all preview images
    setPreviewImages((prev) =>
      prev.map((img) => ({ ...img, isPrimary: false }))
    );

    // Set primary in existing images
    setExistingImages((prev) =>
      prev.map((img, i) => ({ ...img, isPrimary: i === index }))
    );
  };

  // Update caption for preview image
  const handleUpdatePreviewCaption = (index, caption) => {
    setPreviewImages((prev) => {
      const newPreviews = [...prev];
      newPreviews[index].caption = caption;
      return newPreviews;
    });
  };

  // Update caption for existing image
  const handleUpdateExistingCaption = (index, caption) => {
    setExistingImages((prev) => {
      const newExisting = [...prev];
      newExisting[index].caption = caption;
      return newExisting;
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    // Validate form
    if (!formData.name.trim()) {
      setError("Product name is required");
      setLoading(false);
      return;
    }

    if (!formData.description.trim()) {
      setError("Product description is required");
      setLoading(false);
      return;
    }

    if (!formData.price || formData.price.trim() === "") {
      setError("Product price is required");
      setLoading(false);
      return;
    }

    const priceValue = parseFloat(formData.price);
    if (isNaN(priceValue) || priceValue <= 0) {
      setError("Price must be a valid number greater than 0");
      setLoading(false);
      return;
    }

    if (priceValue > 999999.99) {
      setError("Price cannot exceed 999,999.99");
      setLoading(false);
      return;
    }

    // Sale price validation
    if (formData.salePrice && formData.salePrice.trim() !== "") {
      const salePriceValue = parseFloat(formData.salePrice);
      if (isNaN(salePriceValue) || salePriceValue < 0) {
        setError("Sale price must be a valid number");
        setLoading(false);
        return;
      }

      if (salePriceValue >= priceValue) {
        setError("Sale price must be less than regular price");
        setLoading(false);
        return;
      }

      if (salePriceValue > 999999.99) {
        setError("Sale price cannot exceed 999,999.99");
        setLoading(false);
        return;
      }
    }

    if (!formData.catalogId) {
      setError("Please select a catalog");
      setLoading(false);
      return;
    }

    try {
      // Create FormData object for multipart form submission
      const formDataObj = new FormData();

      // Add all product data fields to FormData
      Object.keys(formData).forEach((key) => {
        // Handle nested objects like attributes
        if (key === "attributes" && Array.isArray(formData[key])) {
          formData[key].forEach((attr, index) => {
            formDataObj.append(`attributes[${index}][name]`, attr.name);
            formDataObj.append(`attributes[${index}][value]`, attr.value);
          });
        } else if (
          typeof formData[key] !== "object" ||
          formData[key] === null
        ) {
          formDataObj.append(key, formData[key]);
        }
      });

      // Add images to FormData
      if (selectedImages && selectedImages.length > 0) {
        selectedImages.forEach((image) => {
          formDataObj.append("files", image);
        });
      }

      // Add existing images data if needed
      if (existingImages.length > 0) {
        formDataObj.append("existingImages", JSON.stringify(existingImages));
      }

      // Add removed images data if needed
      if (removedImages.length > 0) {
        formDataObj.append("removeImages", JSON.stringify(removedImages));
      }

      let response;

      if (isEditMode) {
        // Update existing product
        response = await fetch(`${baseUrl}/api/products/${id}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formDataObj,
        });
      } else {
        // Create new product
        response = await fetch(`${baseUrl}/api/products/`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formDataObj,
        });
      }

      const data = await response.json();

      if (data.success) {
        setSuccess(
          isEditMode
            ? "Product updated successfully"
            : "Product created successfully"
        );

        // Redirect after a short delay
        setTimeout(() => {
          handleCancel();
        }, 2000);
      } else {
        setError(
          data.message ||
            `Failed to ${isEditMode ? "update" : "create"} product`
        );
      }
    } catch (err) {
      console.error(
        `Error ${isEditMode ? "updating" : "creating"} product:`,
        err
      );
      setError(
        `An error occurred while ${
          isEditMode ? "updating" : "creating"
        } the product`
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle cancel - Fixed navigation
  const handleCancel = () => {
    // Try different navigation paths based on your routing structure
    if (window.history.length > 1) {
      navigate(-1); // Go back to previous page
    } else {
      // Fallback navigation options
      navigate("/ecommerce", { replace: true });
    }
  };

  if (loading && !product && isEditMode) {
    return (
      <div className="standalone-product-form-container">
        <div className="loading-indicator">
          <div className="spinner"></div>
          <p>Loading product data...</p>
        </div>
      </div>
    );
  }

  const getCurrencySymbol = (currencyCode) => {
    const symbols = {
      INR: "₹",
      USD: "$",
      EUR: "€",
      GBP: "£",
    };
    return symbols[currencyCode] || currencyCode;
  };

  // Enhanced handle change for price validation
  const handlePriceChange = (e) => {
    const { name, value } = e.target;

    // Allow empty value
    if (value === "") {
      setFormData((prev) => ({ ...prev, [name]: "" }));
      return;
    }

    // Validate price format
    const priceRegex = /^\d+(\.\d{0,2})?$/;
    if (priceRegex.test(value) || value === "") {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Enhanced handle change for sale price with validation
  const handleSalePriceChange = (e) => {
    const { value } = e.target;

    // Allow empty value
    if (value === "") {
      setFormData((prev) => ({ ...prev, salePrice: "" }));
      return;
    }

    // Validate price format
    const priceRegex = /^\d+(\.\d{0,2})?$/;
    if (priceRegex.test(value)) {
      setFormData((prev) => ({ ...prev, salePrice: value }));
    }
  };

  return (
    <div className="standalone-product-form-container">
      {/* Header */}
      <div className="standalone-form-header">
        <button className="back-button" onClick={handleCancel} type="button">
          <ArrowLeft size={16} />
          <span>Back to Products</span>
        </button>
        <div className="title-section">
          <h1>{isEditMode ? "Edit Product" : "Create New Product"}</h1>
          <p>
            {isEditMode
              ? "Update your product information and settings"
              : "Add a new product to your catalog"}
          </p>
        </div>
      </div>

      {/* Alert Messages */}
      {error && (
        <div className="error-message">
          <AlertCircle size={16} />
          <span>{error}</span>
          <button className="close-alert" onClick={() => setError("")}>
            <X size={14} />
          </button>
        </div>
      )}

      {success && (
        <div className="success-message">
          <Check size={16} />
          <span>{success}</span>
          <button className="close-alert" onClick={() => setSuccess("")}>
            <X size={14} />
          </button>
        </div>
      )}

      {/* Form */}
      <div className="product-form-wrapper standalone">
        <form className="product-form" onSubmit={handleSubmit}>
          {/* Basic Information */}
          <div className="form-section">
            <h3 className="section-title">
              <Package size={16} />
              Basic Information
            </h3>

            <div className="form-group">
              <label htmlFor="name">Product Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter product name"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="category">Category *</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="subCategory">Sub-Category *</label>
                <select
                  id="subCategory"
                  name="subCategory"
                  value={formData.subCategory}
                  onChange={handleChange}
                  required
                >
                  {subCategories[formData.category]?.map((subCategory) => (
                    <option key={subCategory.value} value={subCategory.value}>
                      {subCategory.label}
                    </option>
                  )) || <option value="">Select sub-category</option>}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="brand">Brand *</label>
              <input
                type="text"
                id="brand"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                placeholder="Enter brand name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                placeholder="Enter product description"
                required
              ></textarea>
            </div>

            <div className="form-group catalog-selection">
              <label htmlFor="catalogId">Select Catalog *</label>

              {catalogs.length === 0 ? (
                <div className="no-catalogs-message">
                  <p>No catalogs found. Please create a catalog first.</p>
                  <button
                    type="button"
                    className="create-catalog-button"
                    onClick={() =>
                      window.open("/product-catalogs/create", "_blank")
                    }
                  >
                    Create New Catalog
                  </button>
                </div>
              ) : (
                <div className="catalogs-grid">
                  {catalogs.map((catalog) => (
                    <div
                      key={catalog._id}
                      className={`catalog-card ${
                        formData.catalogId === catalog._id ? "selected" : ""
                      }`}
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          catalogId: catalog._id,
                        }))
                      }
                    >
                      <div className="catalog-card-content">
                        <div className="catalog-name">
                          {catalog.name}
                          {catalog.isDefault && (
                            <span className="default-badge">Default</span>
                          )}
                        </div>
                        <div className="catalog-category">
                          {catalog.category}
                        </div>
                        {catalog.productCount !== undefined && (
                          <div className="catalog-product-count">
                            {catalog.productCount}{" "}
                            {catalog.productCount === 1
                              ? "product"
                              : "products"}
                          </div>
                        )}
                      </div>
                      {formData.catalogId === catalog._id && (
                        <div className="catalog-selected-indicator">
                          <Check size={16} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Hidden input for form submission */}
              <input
                type="hidden"
                name="catalogId"
                value={formData.catalogId}
                required
              />
            </div>
          </div>

          {/* Pricing */}
          <div className="form-section">
            <h3 className="section-title">
              <DollarSign size={16} />
              Pricing
            </h3>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="price">Price *</label>
                <div className="price-input-wrapper">
                  <select
                    id="currency"
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
                    className="currency-select"
                  >
                    {currencies.map((currency) => (
                      <option key={currency.value} value={currency.value}>
                        {currency.label}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handlePriceChange}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className="price-input"
                    required
                  />
                </div>
                {formData.price &&
                  !isNaN(formData.price) &&
                  parseFloat(formData.price) > 0 && (
                    <div className="price-preview">
                      {getCurrencySymbol(formData.currency)}
                      {parseFloat(formData.price).toFixed(2)}
                    </div>
                  )}
              </div>

              <div className="form-group">
                <label htmlFor="salePrice">Sale Price (Optional)</label>
                <div className="price-input-wrapper">
                  <span className="currency-symbol">
                    {getCurrencySymbol(formData.currency)}
                  </span>
                  <input
                    type="number"
                    id="salePrice"
                    name="salePrice"
                    value={formData.salePrice}
                    onChange={handleSalePriceChange}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className="price-input"
                  />
                </div>
                {formData.salePrice &&
                  parseFloat(formData.salePrice) >=
                    parseFloat(formData.price) && (
                    <div className="price-warning">
                      ⚠️ Sale price should be less than regular price
                    </div>
                  )}
                {formData.salePrice &&
                  formData.price &&
                  parseFloat(formData.salePrice) <
                    parseFloat(formData.price) && (
                    <div className="price-savings">
                      💰 Save {getCurrencySymbol(formData.currency)}
                      {(
                        parseFloat(formData.price) -
                        parseFloat(formData.salePrice)
                      ).toFixed(2)}{" "}
                      (
                      {(
                        ((parseFloat(formData.price) -
                          parseFloat(formData.salePrice)) /
                          parseFloat(formData.price)) *
                        100
                      ).toFixed(0)}
                      % off)
                    </div>
                  )}
              </div>
            </div>
          </div>

          {/* Inventory */}
          <div className="form-section">
            <h3 className="section-title">
              <ShoppingBag size={16} />
              Inventory
            </h3>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="quantity">Quantity *</label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  placeholder="1"
                  min="0"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="sku">SKU</label>
                <input
                  type="text"
                  id="sku"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  placeholder="Stock Keeping Unit"
                />
              </div>
            </div>

            <div className="form-row checkbox-row">
              <div className="form-checkbox">
                <input
                  type="checkbox"
                  id="isDigital"
                  name="isDigital"
                  checked={formData.isDigital}
                  onChange={handleChange}
                />
                <label htmlFor="isDigital">Digital Product</label>
              </div>

              <div className="form-checkbox">
                <input
                  type="checkbox"
                  id="hasVariants"
                  name="hasVariants"
                  checked={formData.hasVariants}
                  onChange={handleChange}
                />
                <label htmlFor="hasVariants">Has Variants</label>
              </div>
            </div>
          </div>

          {/* Shipping */}
          <div className="form-section">
            <h3 className="section-title">
              <Truck size={16} />
              Shipping
            </h3>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="weight">Weight</label>
                <div className="input-with-select">
                  <input
                    type="number"
                    id="weight"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                  <select
                    id="weightUnit"
                    name="weightUnit"
                    value={formData.weightUnit}
                    onChange={handleChange}
                  >
                    <option value="kg">kg</option>
                    <option value="g">g</option>
                    <option value="lb">lb</option>
                    <option value="oz">oz</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Dimensions</label>
                <div className="dimensions-inputs">
                  <div className="dimension-input">
                    <label htmlFor="length">L</label>
                    <input
                      type="number"
                      id="length"
                      name="length"
                      value={formData.length}
                      onChange={handleChange}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                  </div>

                  <div className="dimension-input">
                    <label htmlFor="width">W</label>
                    <input
                      type="number"
                      id="width"
                      name="width"
                      value={formData.width}
                      onChange={handleChange}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                  </div>

                  <div className="dimension-input">
                    <label htmlFor="height">H</label>
                    <input
                      type="number"
                      id="height"
                      name="height"
                      value={formData.height}
                      onChange={handleChange}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                  </div>

                  <select
                    id="dimensionUnit"
                    name="dimensionUnit"
                    value={formData.dimensionUnit}
                    onChange={handleChange}
                    className="dimension-unit"
                  >
                    <option value="cm">cm</option>
                    <option value="mm">mm</option>
                    <option value="in">in</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Attributes */}
          <div className="form-section">
            <h3 className="section-title">
              <Tag size={16} />
              Attributes
            </h3>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="attributeName">Attribute Name</label>
                <input
                  type="text"
                  id="attributeName"
                  name="name"
                  value={attributeInput.name}
                  onChange={handleAttributeInputChange}
                  placeholder="e.g. Color, Size, Material"
                />
              </div>

              <div className="form-group">
                <label htmlFor="attributeValue">Attribute Value</label>
                <input
                  type="text"
                  id="attributeValue"
                  name="value"
                  value={attributeInput.value}
                  onChange={handleAttributeInputChange}
                  placeholder="e.g. Red, XL, Cotton"
                />
              </div>

              <button
                type="button"
                className="add-attribute-button"
                onClick={handleAddAttribute}
              >
                <Plus size={16} />
                Add
              </button>
            </div>

            {formData.attributes.length > 0 && (
              <div className="attributes-list">
                <h4>Added Attributes:</h4>
                <ul>
                  {formData.attributes.map((attr, index) => (
                    <li key={index} className="attribute-item">
                      <span className="attribute-name">{attr.name}:</span>
                      <span className="attribute-value">{attr.value}</span>
                      <button
                        type="button"
                        className="remove-attribute-button"
                        onClick={() => handleRemoveAttribute(index)}
                      >
                        <Minus size={14} />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Images */}
          <div className="form-section">
            <h3 className="section-title">
              <ImageIcon size={16} />
              Product Images
            </h3>

            <div className="image-upload-container">
              <div
                className="image-upload-area"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload size={24} />
                <p>Click to upload or drag images here</p>
                <span className="upload-hint">
                  JPG, PNG or WebP (max 5MB each)
                </span>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageSelect}
                  accept="image/*"
                  multiple
                  hidden
                />
              </div>

              {/* Existing images */}
              {existingImages.length > 0 && (
                <div className="images-preview-section">
                  <h4>Existing Images:</h4>
                  <div className="images-preview-grid">
                    {existingImages.map((image, index) => (
                      <div
                        key={index}
                        className={`image-preview-item ${
                          image.isPrimary ? "primary" : ""
                        }`}
                      >
                        <div className="image-preview">
                          <img src={image.url} alt={`Product ${index}`} />
                          {image.isPrimary && (
                            <span className="primary-badge">Primary</span>
                          )}
                        </div>
                        <div className="image-actions">
                          <div className="image-caption">
                            <input
                              type="text"
                              placeholder="Image caption"
                              value={image.caption || ""}
                              onChange={(e) =>
                                handleUpdateExistingCaption(
                                  index,
                                  e.target.value
                                )
                              }
                            />
                          </div>
                          <div className="image-buttons">
                            {!image.isPrimary && (
                              <button
                                type="button"
                                className="set-primary-button"
                                onClick={() => handleSetPrimaryExisting(index)}
                              >
                                Set as Primary
                              </button>
                            )}
                            <button
                              type="button"
                              className="remove-image-button"
                              onClick={() => handleRemoveExistingImage(index)}
                            >
                              <X size={14} />
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* New images preview */}
              {previewImages.length > 0 && (
                <div className="images-preview-section">
                  <h4>New Images:</h4>
                  <div className="images-preview-grid">
                    {previewImages.map((image, index) => (
                      <div
                        key={index}
                        className={`image-preview-item ${
                          image.isPrimary ? "primary" : ""
                        }`}
                      >
                        <div className="image-preview">
                          <img
                            src={image.url}
                            alt={`Upload Preview ${index}`}
                          />
                          {image.isPrimary && (
                            <span className="primary-badge">Primary</span>
                          )}
                        </div>
                        <div className="image-actions">
                          <div className="image-caption">
                            <input
                              type="text"
                              placeholder="Image caption"
                              value={image.caption || ""}
                              onChange={(e) =>
                                handleUpdatePreviewCaption(
                                  index,
                                  e.target.value
                                )
                              }
                            />
                          </div>
                          <div className="image-buttons">
                            {!image.isPrimary && (
                              <button
                                type="button"
                                className="set-primary-button"
                                onClick={() => handleSetPrimaryPreview(index)}
                              >
                                Set as Primary
                              </button>
                            )}
                            <button
                              type="button"
                              className="remove-image-button"
                              onClick={() => handleRemovePreviewImage(index)}
                            >
                              <X size={14} />
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Admin Notes */}
          <div className="form-section">
            <h3 className="section-title">Admin Notes</h3>
            <div className="form-group">
              <textarea
                id="adminNotes"
                name="adminNotes"
                value={formData.adminNotes}
                onChange={handleChange}
                rows="3"
                placeholder="Additional notes about this product (visible to admins only)"
              ></textarea>
            </div>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button
              type="button"
              className="cancel-button"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`save-button ${loading ? "loading" : ""}`}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-small"></span>
                  <span>{isEditMode ? "Updating..." : "Creating..."}</span>
                </>
              ) : (
                <span>{isEditMode ? "Update Product" : "Create Product"}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StandaloneProductForm;
