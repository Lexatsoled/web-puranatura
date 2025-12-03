export const WishlistEmpty = () => (
  <div className="text-center py-12">
    <svg
      className="mx-auto h-12 w-12 text-gray-400 mb-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
      />
    </svg>
    <h3 className="text-lg font-medium text-gray-900 mb-2">
      Tu lista de deseos está vacía
    </h3>
    <p className="text-gray-600 mb-4">
      Agrega productos que te interesen para guardarlos aquí
    </p>
    <a
      href="/tienda"
      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
    >
      Explorar productos
    </a>
  </div>
);
