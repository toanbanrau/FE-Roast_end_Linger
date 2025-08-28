import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const MySlider = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    arrows: false,
  };

  const slides = [
    {
      id: 1,
      src: "/slider/z6951855058241_fbec65f671ecf90d94b4cc43fd165a2b.jpg",
      alt: "Slide 1",
    },
    {
      id: 2,
      src: "/slider/z6951855058249_40ab8b6fd737854519073d6d9dd7821e.jpg",
      alt: "Slide 2",
    },
    {
      id: 3,
      src: "/slider/z6951855058250_62445d3998c9e21d1796d9ecf6631516.jpg",
      alt: "Slide 3",
    },
    {
      id: 4,
      src: "/slider/z6951855058251_9f57925be900fab90238058c615e4cfb.jpg",
      alt: "Slide 4",
    },
  ];

  return (
    <div className="w-full h-full absolute inset-0 brightness-80">
      <Slider {...settings}>
        {slides.map((slide) => (
          <div key={slide.id}>
            <img
              src={slide.src}
              alt={slide.alt}
              className="h-[100vh] w-full object-cover"
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default MySlider;
