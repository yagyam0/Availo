"use client"
import React from 'react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from './ui/carousel'
import { Card, CardContent } from './ui/card'
import Image from 'next/image'
import { testimonials } from '@/constants/siteConstants'
import Autoplay from 'embla-carousel-autoplay'

const Testimonials = () => {
  return (
    <div className="flex flex-col items-center justify-center mt-16 mx-auto text-center w-full px-6">
      <h4 className="text-3xl font-bold text-blue-600 mb-6">
        What Our User&apos;s Say
      </h4>
      <Carousel
        plugins={[
          Autoplay({
            delay: 2000,
          }),
        ]}
        opts={{ align: 'start' }}
        className="w-11/12"
      >
        <CarouselContent>
          {testimonials.map((testimonial) => {
            const { id, avatar, name, message } = testimonial
            return (
              <CarouselItem key={id} className="md:basis-1/2 lg:basis-1/3 p-4">
                <Card className="shadow-md border border-gray-200 rounded-lg">
                  <CardContent className="p-6 flex flex-col items-center">
                    <Image
                      src={avatar}
                      alt={name}
                      width={60}
                      height={60}
                      className="rounded-full mb-4"
                    />
                    <p className="text-gray-700 italic text-lg max-w-md">
                      &quot;{message}&quot;
                    </p>
                    <span className="mt-4 font-semibold text-blue-600">
                      - {name}
                    </span>
                  </CardContent>
                </Card>
              </CarouselItem>
            )
          })}
        </CarouselContent>
        <CarouselPrevious className="hover: text-white main-bg" />
        <CarouselNext className="hover: text-white main-bg" />
      </Carousel>
    </div>
  )
}

export default Testimonials
