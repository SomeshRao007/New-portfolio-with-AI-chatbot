import React, { useState, useEffect } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Card } from "./card";
import { Button } from "./button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "./carousel";

export interface GalleryItem {
  id: string;
  title: string;
  summary: string;
  url: string;
  image: string;
}

interface GalleryHoverCarouselProps {
  heading?: string;
  items: GalleryItem[];
}

export default function GalleryHoverCarousel({
  heading = "Featured Projects",
  items,
}: GalleryHoverCarouselProps) {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  useEffect(() => {
    if (!carouselApi) return;
    const update = () => {
      setCanScrollPrev(carouselApi.canScrollPrev());
      setCanScrollNext(carouselApi.canScrollNext());
    };
    update();
    carouselApi.on("select", update);
    return () => {
      carouselApi.off("select", update);
    };
  }, [carouselApi]);

  return (
    <section className="py-20 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-6">
        <div className="mb-8 flex flex-col justify-between md:mb-14 md:flex-row md:items-end lg:mb-16">
          <div className="max-w-2xl">
            <h3 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-50 leading-relaxed">
              {heading}{" "}
            </h3>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
               Explore a collection of innovative solutions and technologies.
            </p>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
            <Button
              variant="outline"
              size="icon"
              onClick={() => carouselApi?.scrollPrev()}
              disabled={!canScrollPrev}
              className="h-10 w-10 rounded-full"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => carouselApi?.scrollNext()}
              disabled={!canScrollNext}
              className="h-10 w-10 rounded-full"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="w-full max-w-full">
          <Carousel
            setApi={setCarouselApi}
            opts={{ breakpoints: { "(max-width: 768px)": { dragFree: true } } }}
            className="relative w-full max-w-full"
          >
            <CarouselContent className="w-full max-w-full md:ml-4 md:-mr-4">
              {items.map((item) => (
                <CarouselItem key={item.id} className="ml-6 md:max-w-[350px]">
                  <a 
                    href={item.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="group block relative w-full h-[300px] md:h-[350px]"
                  >
                    <Card className="overflow-hidden rounded-3xl h-full w-full border-none shadow-md">
                      {/* Image */}
                      <div className="relative h-full w-full transition-all duration-500 group-hover:h-1/2">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.title}
                            loading="lazy"
                            className="h-full w-full object-cover object-center"
                          />
                        ) : (
                          <div className="h-full w-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                             <span className="text-slate-400 font-bold">No Image</span>
                          </div>
                        )}
                        {/* Fade overlay at bottom */}
                        <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      </div>

                      {/* Text Section */}
                      <div className="absolute bottom-0 left-0 w-full p-6 transition-all duration-500 group-hover:h-1/2 group-hover:flex flex-col justify-center bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm opacity-0 group-hover:opacity-100">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">{item.title}</h3>
                        <p className="mt-2 text-slate-600 dark:text-slate-400 text-sm line-clamp-2">
                          {item.summary}
                        </p>
                        <div
                          className="absolute bottom-4 right-4 p-2 border border-slate-200 dark:border-slate-700 hover:-rotate-45 transition-all duration-500 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400"
                        >
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </Card>
                  </a>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </section>
  );
}