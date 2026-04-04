import { motion } from "framer-motion";
import ProductCard from "../ProductCard/ProductCard";

const MotionDiv = motion.div;

const listVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } },
};

function ProductGrid({ products }) {
  return (
    <MotionDiv
      className="page-grid"
      aria-live="polite"
      variants={listVariants}
      initial="hidden"
      animate="show"
    >
      {products.map((product) => (
        <MotionDiv key={product.id} variants={itemVariants}>
          <ProductCard product={product} />
        </MotionDiv>
      ))}
    </MotionDiv>
  );
}

export default ProductGrid;
