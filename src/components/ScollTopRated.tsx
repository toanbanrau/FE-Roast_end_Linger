import React, { useRef } from "react";
import Slider from "react-slick";
import type { IProduct } from "../interfaces/product";
import { Link, useNavigate } from "react-router-dom";

function ScollTopRated({ productsTopRated }: { productsTopRated: IProduct[] }) {
  const sliderRef = useRef<Slider | null>(null);
  const navigate = useNavigate();

  const settings = {

    infinite: true,
    slidesToShow: 3,   // giống 3 cột grid
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
        {
          breakpoint: 1024,
          settings: { slidesToShow: 2 }
        },
        {
          breakpoint: 640,
          settings: { slidesToShow: 1 }
        }
      ]
  };

  return (
    <Slider ref={sliderRef} {...settings}>
      {productsTopRated.map((product) => (
        <div className="px-2 h-full">
        <div
          className="group m-2 relative flex flex-col h-full overflow-hidden rounded-xl bg-white shadow-md transition-all hover:shadow-xl cursor-pointer"
          onClick={() => navigate(`/products/${product.slug}`)}
        >
          {/* Ảnh sản phẩm */}
          <div className="aspect-square overflow-hidden">
            <img
              src={product.primary_image?.image_url || "/placeholder.svg?height=400&width=400"}
              alt={product.primary_image?.alt_text || product.product_name}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
          </div>
      
          {/* Nội dung */}
          <div className="p-6 flex flex-col flex-1">
            <h3 className="text-lg font-semibold text-stone-900 line-clamp-1">
              {product.product_name}
            </h3>
            <p className="mt-2 text-stone-600 text-sm line-clamp-1">
              {product.short_description || product.flavor_profile || "Cà phê chất lượng cao"}
            </p>
      
            {/* Footer dính đáy */}
            <div className="mt-auto flex items-center justify-between pt-4">
              <span className="text-lg font-bold text-amber-800">
                {product.display_price}
              </span>
              <Link
                to={`/products/${product.slug}`}
                className="px-3 py-1 rounded-md text-sm font-medium bg-amber-800 text-amber-50 hover:bg-amber-50 hover:text-amber-900 transition-colors"
              >
                Xem Chi Tiết
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      ))}
    </Slider>
  );
}

export default ScollTopRated;
