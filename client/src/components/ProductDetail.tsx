import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ProductController } from "../controllers/ProductCatalogueController";
import type { Product } from "../models/ProductCatalogueModel";

const ProductDetail: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      const controller = new ProductController();
      if (productId) {
        const productDetails = await controller.getProductDetails(productId);
        setProduct(productDetails || null);
      }
      setLoading(false);
    };
    fetchProduct();
    setQuantity(1);
  }, [productId]);

  if (loading) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>Loading...</div>
    );
  }

  if (!product) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h2>Product not found</h2>
        <button
          onClick={() => navigate("/")}
          style={{
            padding: "10px 15px",
            backgroundColor: "#493aecff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Back to Products
        </button>
      </div>
    );
  }

  const addToCart = () => {
    console.log("Add to cart:", product, quantity);
    // Add your cart logic here
  };

  return (
    <div
      style={{
        padding: "20px",
        margin: "0 auto",
        maxWidth: "1000px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <button
        onClick={() => navigate(-1)}
        style={{
          padding: "8px 12px",
          backgroundColor: "#493aecff",
          border: "1px solid #ddd",
          borderRadius: "4px",
          cursor: "pointer",
          marginBottom: "20px",
        }}
      >
        ← Back
      </button>

      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "30px" }}>
          {/* Product Image */}
          <div style={{ flex: "1", minWidth: "300px" }}>
            <img
              src={product.imageUrl}
              alt={product.name}
              style={{
                width: "100%",
                maxWidth: "400px",
                borderRadius: "8px",
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              }}
            />
          </div>

          {/* Product Info */}
          <div style={{ flex: "2", minWidth: "300px" }}>
            <h1 style={{ color: "#000000", marginBottom: "10px" }}>
              {product.name}
            </h1>

            <p
              style={{
                fontSize: "1.5em",
                fontWeight: "bold",
                color: "#493aecff",
                margin: "15px 0",
              }}
            >
              ${product.price.toFixed(2)}
            </p>

            <p
              style={{
                color: product.stock > 0 ? "black" : "red",
                fontSize: "1.1em",
                margin: "10px 0",
              }}
            >
              {product.stock > 0
                ? `In stock: ${product.stock} units available`
                : "Out of stock"}
            </p>

            {product.rating && (
              <div style={{ margin: "15px 0" }}>
                <span style={{ fontWeight: "bold", color: "#000000" }}>
                  Customer Rating:{" "}
                </span>
                <span style={{ color: "#ffc107", fontSize: "1.2em" }}>
                  {"★".repeat(Math.round(product.rating))}
                </span>
                <span style={{ marginLeft: "8px", color: "#000000" }}>
                  ({product.rating}/5)
                </span>
              </div>
            )}

            <div style={{ margin: "20px 0" }}>
              <h3 style={{ marginBottom: "10px", color: "#000000" }}>
                Description
              </h3>
              <p style={{ lineHeight: "1.6", color: "#555" }}>
                {product.description}
              </p>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginTop: "10px",
              }}
            >
              <label style={{ fontWeight: 500 }}>Qty:</label>
              <input
                type="number"
                value={quantity}
                min={1}
                max={product.stock}
                disabled={product.stock === 0}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (val >= 1 && val <= product.stock) setQuantity(val);
                }}
                style={{ width: "60px", padding: "4px 8px" }}
              />
              <button
                onClick={addToCart}
                disabled={product.stock === 0}
                style={{
                  padding: "8px 16px",
                  backgroundColor: product.stock > 0 ? "#493aecff" : "#ccc",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: product.stock > 0 ? "pointer" : "not-allowed",
                }}
              >
                {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
