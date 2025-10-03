import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ProductController } from "../controllers/ProductCatalogueController";
import { useCartContext } from "../context/CartContext";
import type { Product } from "../models/ProductCatalogueModel";

const QuantityInput: React.FC<{
  quantity: number;
  setQuantity: (qty: number) => void;
  max: number;
  disabled?: boolean;
  id: string;
}> = ({ quantity, setQuantity, max, disabled, id }) => (
  <input
    id={id}
    type="number"
    min={1}
    max={max}
    value={quantity}
    disabled={disabled}
    onChange={(e) =>
      setQuantity(Math.max(1, Math.min(max, Number(e.target.value))))
    }
    style={{ width: 50, padding: 6, borderRadius: 4, border: "1px solid #ccc" }}
  />
);

const FeedbackMessage: React.FC<{ visible: boolean }> = ({ visible }) => {
  if (!visible) return null;
  return (
    <span
      style={{
        position: "absolute",
        left: "50%",
        top: "-38px",
        transform: "translateX(-50%)",
        background: "#28a745",
        color: "white",
        padding: "7px 18px",
        borderRadius: "20px",
        fontWeight: 600,
        fontSize: "1em",
        boxShadow: "0 2px 8px rgba(40,167,69,0.15)",
        display: "flex",
        alignItems: "center",
        pointerEvents: "none",
        zIndex: 2,
      }}
    >
      Added!
    </span>
  );
};

const AddToCartButton: React.FC<{
  product: Product;
  quantity: number;
  onAdd: () => void;
}> = ({ product, quantity, onAdd }) => {
  const [addedMsg, setAddedMsg] = useState(false);

  const handleClick = () => {
    onAdd();
    setAddedMsg(true);
    setTimeout(() => setAddedMsg(false), 1200);
  };

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <button
        disabled={product.stockQty === 0}
        onClick={handleClick}
        style={{
          padding: "12px 32px",
          backgroundColor: product.stockQty > 0 ? "#493aecff" : "#ccc",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: product.stockQty > 0 ? "pointer" : "not-allowed",
          fontSize: "1.1em",
          fontWeight: 700,
        }}
      >
        {product.stockQty > 0 ? "Add to Cart" : "Out of Stock"}
      </button>
      <FeedbackMessage visible={addedMsg} />
    </div>
  );
};

const ProductDetail: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCartContext();
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

  if (loading)
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>Loading...</div>
    );
  if (!product)
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

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8f8f8",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "white",
          border: "1.5px solid #e0e0e0",
          borderRadius: "12px",
          padding: "40px 32px",
          maxWidth: "700px",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <button
          onClick={() => navigate(-1)}
          style={{
            alignSelf: "flex-start",
            padding: "8px 12px",
            backgroundColor: "#493aecff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            marginBottom: "20px",
            color: "white",
          }}
        >
          ← Back
        </button>

        <div
          style={{
            display: "flex",
            width: "100%",
            gap: "32px",
            alignItems: "flex-start",
            marginBottom: 24,
          }}
        >
          <img
            src={product.imageUrl}
            alt={product.name || "Product Image"}
            style={{
              width: "220px",
              height: "220px",
              objectFit: "cover",
              borderRadius: "8px",
              border: "1px solid #eee",
              background: "#fafaff",
              flexShrink: 0,
            }}
          />
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <h1 style={{ color: "#000000", marginBottom: "10px" }}>
              {product.name}
            </h1>
            <p
              style={{
                fontSize: "1.5em",
                fontWeight: "bold",
                color: "#493aecff",
                margin: "10px 0 8px 0",
              }}
            >
              ${(product.priceCents / 100).toFixed(2)}
            </p>
            <p
              style={{
                color: product.stockQty > 0 ? "black" : "red",
                fontSize: "1.1em",
                margin: "0 0 12px 0",
              }}
            >
              {product.stockQty > 0
                ? `In stock: ${product.stockQty} units available`
                : "Out of stock"}
            </p>
          </div>
        </div>

        <div style={{ margin: "18px 0", width: "100%" }}>
          <h3
            style={{
              marginBottom: "8px",
              color: "#000000",
              paddingLeft: "24px",
            }}
          >
            Description
          </h3>
          <p
            style={{
              color: "#444",
              fontSize: "1.08em",
              margin: 0,
              paddingLeft: "24px",
            }}
          >
            {product.description}
          </p>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginTop: 8,
          }}
        >
          <label
            style={{ fontWeight: 500 }}
            htmlFor={`qty-input-detail-${product.id}`}
          >
            Qty:
          </label>
          <QuantityInput
            id={`qty-input-detail-${product.id}`}
            quantity={quantity}
            setQuantity={setQuantity}
            max={product.stockQty}
            disabled={product.stockQty === 0}
          />
          <AddToCartButton
            product={product}
            quantity={quantity}
            onAdd={() => addToCart(product, quantity)}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
