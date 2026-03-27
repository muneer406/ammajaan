import { useEffect, useMemo, useState } from "react";
import { FaCartPlus, FaHeart, FaStar } from "react-icons/fa";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { useCart } from "../../hooks/useCart";
import { useWishlist } from "../../hooks/useWishlist";
import { getProductById } from "../../services/api";
import { formatCurrency } from "../../utils/helpers";

function ProductDetailsPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const { addToCart } = useCart();
  const { wishlistItems, toggleWishlist } = useWishlist();

  const isWishlisted = wishlistItems.some(
    (item) => item.productId === Number(id),
  );

  const galleryImages = useMemo(() => {
    if (!product) return [];
    return Array.from(new Set([product.image, ...(product.images ?? [])]));
  }, [product]);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setIsLoading(true);
        setError("");
        const data = await getProductById(id);
        setProduct(data);
      } catch {
        setError("Failed to load product details. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  if (isLoading) {
    return (
      <section className="page">
        <div className="neo-panel">
          <h2>Product Details</h2>
          <p>Loading product...</p>
        </div>
      </section>
    );
  }

  if (error || !product) {
    return (
      <section className="page">
        <div className="neo-panel">
          <h2>Product Details</h2>
          <p>{error || "Product not found."}</p>
        </div>
      </section>
    );
  }

  const handleAddToCart = () => {
    addToCart(product);
    toast.success("Added to cart");
  };

  const handleWishlist = () => {
    toggleWishlist(product);
    toast.info(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
  };

  return (
    <section className="page">
      <div className="details-layout">
        <div className="neo-panel details-gallery">
          <Swiper spaceBetween={12} slidesPerView={1}>
            {galleryImages.map((image, index) => (
              <SwiperSlide key={`${image}-${index}`}>
                <div className="details-image-wrap">
                  <img
                    src={image}
                    alt={`${product.title} view ${index + 1}`}
                    className="details-image"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="neo-panel details-content">
          <span className="product-chip">{product.category}</span>
          <h2>{product.title}</h2>

          <div className="product-card__meta">
            <strong className="product-price">
              {formatCurrency(product.price * 86)}
            </strong>
            <span className="product-rating">
              <FaStar /> {product.rating?.rate ?? 0}
            </span>
          </div>

          <p>{product.description}</p>

          <div className="product-card__actions">
            <button
              type="button"
              className="neo-btn neo-btn--cart"
              onClick={handleAddToCart}
            >
              <FaCartPlus /> Add
            </button>
            <button
              type="button"
              className="neo-btn neo-btn--wish"
              onClick={handleWishlist}
              aria-pressed={isWishlisted}
            >
              <FaHeart /> {isWishlisted ? "Saved" : "Wishlist"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductDetailsPage;
