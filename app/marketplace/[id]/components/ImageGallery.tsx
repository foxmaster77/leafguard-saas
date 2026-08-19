type Props = { images: string[] };

export default function ImageGallery({ images }: Props) {
  if (images.length === 0) {
    return (
      <div className="w-full h-64 rounded-xl bg-gray-900 border border-gray-700 flex items-center justify-center text-gray-600 text-5xl">
        🖼️
      </div>
    );
  }

  return (
    <div
      className={`grid gap-2 rounded-xl overflow-hidden ${
        images.length === 1 ? "grid-cols-1" : "grid-cols-2"
      }`}
    >
      {images.map((src, i) => (
        <div
          key={i}
          className={`relative bg-gray-900 ${
            images.length === 1 ? "h-72" : "h-48"
          }`}
        >
          <img
            src={src}
            alt={`Product image ${i + 1}`}
            className="object-cover w-full h-full"
            onError={(e) => {
              const el = e.target as HTMLImageElement;
              el.style.display = "none";
              el.parentElement!.innerHTML =
                '<div class="w-full h-full flex items-center justify-center text-4xl text-gray-600">🌾</div>';
            }}
          />
        </div>
      ))}
    </div>
  );
}
