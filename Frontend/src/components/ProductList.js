import React, { useEffect, useState } from "react";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    fetch("/api/products")
      .then(r => r.json())
      .then(setProducts);
  }, []);
  return (
    <div>
      <h2>Products</h2>
      <ul>
        {products.map(p => (
          <li key={p.ProductId}>
            {p.Name} - {p.Colour} - £{p.ListPrice} - Size: {p.Size}
          </li>
        ))}
      </ul>
    </div>
  );
}