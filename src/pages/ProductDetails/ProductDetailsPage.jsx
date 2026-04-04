import { useCallback, useEffect, useMemo, useState } from "react";
import { FaCartPlus, FaHeart, FaStar } from "react-icons/fa";
import { toast } from "react-toastify";
import { Link, useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import SafeImage from "../../components/SafeImage/SafeImage";
import { useCart } from "../../hooks/useCart";
import { useWishlist } from "../../hooks/useWishlist";
import { getProductById } from "../../services/api";
import { getRequestErrorMessage } from "../../utils/errors";
import { formatCurrency, usdToInr } from "../../utils/helpers";
import { parseProductRouteId } from "../../utils/productIds";

function ProductDetailsPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const { addToCart } = useCart();
  const { wishlistItems, toggleWishlist } = useWishlist();

  const routeProductId = parseProductRouteId(id);
  const invalidLink = routeProductId == null;

  const isWishlisted = wishlistItems.some(
    (item) => Number(item.productId) === (product?.id ?? routeProductId)
  );

  const galleryImages = useMemo(() => {
    if (!product) return [];
    return Array.from(
      new Set([product.image, ...(product.images ?? [])].filter(Boolean))
    );
  }, [product]);

  const loadProduct = useCallback(async () => {
    if (parseProductRouteId(id) == null) {
      setProduct(null);
      setError(getRequestErrorMessage({ code: "INVALID_PRODUCT_ID" }));
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      setProduct(null);
      const data = await getProductById(id);
      setProduct(data);
    } catch (err) {
      setProduct(null);
      setError(
        getRequestErrorMessage(
          err,
          "Failed to load product details. Please try again."
        )
      );
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadProduct();
  }, [loadProduct]);

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
          <div className="error-actions">
            {!invalidLink && (
              <button type="button" className="nav-link" onClick={loadProduct}>
                Retry
              </button>
            )}
            <Link to="/products" className="nav-link">
              Browse products
            </Link>
          </div>
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
          {galleryImages.length > 0 ? (
            <Swiper spaceBetween={12} slidesPerView={1}>
              {galleryImages.map((imageUrl, index) => (
                <SwiperSlide key={`${imageUrl}-${index}`}>
                  <div className="details-image-wrap">
                    <SafeImage
                      src={imageUrl}
                      alt={`${product.title} view ${index + 1}`}
                      className="details-image"
                      wrapperClassName="details-image details-image--placeholder"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div className="details-image-wrap">
              <div
                className="safe-image-placeholder details-image details-image--placeholder"
                role="img"
                aria-label="No images for this product"
              />
            </div>
          )}
        </div>

        <div className="neo-panel details-content">
          <span className="product-chip">{product.category}</span>
          <h2>{product.title}</h2>

          <div className="product-card__meta">
            <strong className="product-price">
              {formatCurrency(usdToInr(product.price))}
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
