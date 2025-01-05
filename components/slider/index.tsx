import SliderCard from "./card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Testimonial } from "../data/testimonialsData";
import { WidgetSettings } from "@/interfaces/widget";

interface SliderProps {
  testimonials: Testimonial[];
}

const Slider: React.FC<SliderProps> = ({ testimonials }) => {
  return (
    <div className="w-full mx-auto">
      <Carousel
        opts={{
          loop: false,
        }}
        plugins={[
          Autoplay({
            delay: 5000,
            stopOnInteraction: true,
          }),
        ]}
        className="w-full"
      >
        <CarouselContent>
          {testimonials.map((testimonial) => (
            <CarouselItem
              key={testimonial.id}
              className="sm:basis-full lg:basis-1/2 xl:basis-1/3 p-4"
            >
              <SliderCard testimonial={testimonial} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <>
          <CarouselPrevious />
          <CarouselNext />
        </>
      </Carousel>
    </div>
  );
};

export default Slider;
