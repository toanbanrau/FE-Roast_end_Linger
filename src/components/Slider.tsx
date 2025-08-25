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
      src: "/slider/mau-website-cafe.png",
      alt: "Slide 1",
    },
    {
      id: 2,
      src: "/slider/mot-so-mau-banner-quang-cao-ca-phe-pho-bien-hien-tai-2.jpg",
      alt: "Slide 2",
    },
    {
      id: 3,
      src: "/slider/mot-so-mau-banner-quang-cao-ca-phe-pho-bien-hien-tai-8.jpg",
      alt: "Slide 3",
    },
    {
      id: 4,
      src: "/slider/TAN-GIA-BANG-DOWNLOAD-POSTER-CAFE-MIEN-PHI.jpg",
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
