import { useState } from "react";

function SafeImage({ src, alt, className, wrapperClassName = "" }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={`safe-image-placeholder ${wrapperClassName}`.trim()}
        role="img"
        aria-label={alt ? `${alt} (image unavailable)` : "Image unavailable"}
      />
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
}

export default SafeImage;
